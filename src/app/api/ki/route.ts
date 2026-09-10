import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { applyRateLimitLockout, checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";
import { aiQuotaSnapshot, byokEnabled, byokKeyEnc, byokGateway, consumeCloudAction, voidCloudAction, FREEMIUM_MONTHLY, grantAdCreditsOnce, AD_CREDIT_GRANT } from "@/lib/ai-engine";
import { verifyAdReceipt } from "@/lib/ad-receipt";
import { decryptSecret } from "@/lib/security/secret-box";

const SYSTEM = `Du bist der freundliche Assistent von "einfachhausen", einer App für Hauseigentümer.
Du hilfst bei Problemen runds Haus (Handwerk, Garten, Sanitär, Elektro, Energie).
Antworte kurz (max. 4 Sätze), auf Deutsch, praktisch. Schließe ab mit einer gezielten Rückfrage
und schlage bei Bedarf vor, eine konkrete Anfrage zu erstellen ("Auftrag", "Beratung", "Notfall").`;

const RATE_LIMITED = "Du hast gerade sehr viele Fragen gestellt. Bitte versuch es später erneut.";
const UPSTREAM_TIMEOUT_MS = 25000;
const EXHAUSTED = `Dein kostenloses KI-Kontingent (${FREEMIUM_MONTHLY} pro Monat) ist aufgebraucht.`;

function sanitize(messages: unknown): Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m): m is { role: unknown; content: unknown } => Boolean(m) && typeof (m as { content?: unknown }).content === "string")
    .slice(-12)
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 4000) }));
}

function operatorGateway() {
  const key = process.env.AI_API_KEY || process.env.OMNIROUTE_MASTER_KEY;
  const base = (process.env.AI_BASE_URL || "http://127.0.0.1:20128/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "auto/best-fast";
  return key ? { key, base, model } : null;
}

// EH T-0207: 3-stage AI access.
// 1) BYOK: with a stored personal key the call runs against the user's own
//    OpenAI-compatible gateway — unmetered by the operator, the user's
//    provider limits and costs apply.
//    The key never appears in logs or responses.
// 2) Freemium: operator gateway with a monthly allowance + ai_credits
//    (rewarded ads / purchases). Exhausted => honest, actionable UX.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ reply: "Bitte melde dich an, um den Assistenten zu nutzen." }, { status: 401 });
  }

  const key = `u:${user.id}`;
  const limit = checkRateLimit("ki_chat", key);
  if (!limit.allowed) {
    return NextResponse.json({ reply: RATE_LIMITED }, { status: 429, headers: { "retry-after": String(limit.retryAfterSeconds) } });
  }
  const consumed = consumeRateLimitAttempt("ki_chat", key);
  if (!consumed.consumed || consumed.blocked) {
    applyRateLimitLockout("ki_chat", key);
    return NextResponse.json({ reply: RATE_LIMITED }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ reply: "Ungültige Anfrage." }, { status: 400 }); }
  const history = sanitize((body as { messages?: unknown } | null)?.messages);
  if (!history.length) return NextResponse.json({ reply: "Schreib mir kurz, worum es geht." }, { status: 400 });

  // BYOK: the personal key lives encrypted (secret-box) in user_settings.
  // It is decrypted only inside this request and never logged or returned.
  const encKey = byokEnabled(user.id) ? byokKeyEnc(user.id) : null;
  const byokKey = encKey ? decryptSecret(encKey) : null;
  const gateway = byokKey
    ? { key: byokKey, ...byokGateway(user.id) }
    : operatorGateway();

  if (!gateway) {
    return NextResponse.json({ reply: "KI ist gerade nicht konfiguriert. Du kannst trotzdem über 'Neuen Auftrag' direkt starten." }, { status: 503 });
  }

  // Reserve quota BEFORE the gateway call so parallel requests cannot
  // overspend the allowance. The reservation is refunded when upstream fails
  // before delivering value.
  let usageId: number | null = null;
  if (!byokKey) {
    const verdict = consumeCloudAction(user.id);
    if (!verdict.ok) {
      const snapshot = aiQuotaSnapshot(user.id);
      return NextResponse.json({
        reply: EXHAUSTED,
        exhausted: true,
        quota: snapshot,
        options: ["ad", "purchase", "byok"],
      }, { status: 402 });
    }
    usageId = verdict.usageId;
  }

  const userId = user.id;
  function refund() {
    if (usageId !== null) voidCloudAction(usageId, userId);
  }

  const upstreamSignal = req.signal
    ? AbortSignal.any([req.signal, AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)])
    : AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(`${gateway.base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${gateway.key}` },
      body: JSON.stringify({ model: gateway.model, stream: false, messages: [{ role: "system", content: SYSTEM }, ...history], max_tokens: 300 }),
      signal: upstreamSignal,
    });
    if (!res.ok) {
      refund();
      return NextResponse.json({ reply: "Die KI ist gerade nicht erreichbar. Deine Frage bleibt erhalten — versuche es später erneut oder erstelle direkt eine Anfrage." }, { status: 502 });
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      refund();
      return NextResponse.json({ reply: "Die KI hat gerade keine verwertbare Antwort geliefert. Deine Frage bleibt erhalten — versuche es später erneut." }, { status: 502 });
    }
    return NextResponse.json({
      reply,
      quota: byokKey ? { byok: true } : aiQuotaSnapshot(user.id),
    });
  } catch (e) {
    refund();
    const timedOut = e instanceof Error && e.name === "TimeoutError";
    return NextResponse.json({ reply: timedOut ? "Die KI-Anfrage hat zu lange gedauert. Deine Frage bleibt erhalten — versuche es später erneut." : "Ups, KI nicht erreichbar. Versuch es später oder erstelle direkt eine Anfrage." }, { status: timedOut ? 504 : 503 });
  }
}

// Quota snapshot + rewarded-ad credit grant for the settings screen.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const snapshot = aiQuotaSnapshot(user.id);
  return NextResponse.json(snapshot);
}

// Grant +10 actions after a rewarded ad (the ad SDK callback hits this).
// The SDK receipt is verified server-side before granting (see
// docs/OPERATIONS.md "KI-Ad-Credits"); replays grant exactly once (409).
export async function PUT(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const gate = checkRateLimit("account_mutation", `u:${user.id}`);
  if (!gate.allowed) return NextResponse.json({ error: "Zu viele Versuche." }, { status: 429 });
  consumeRateLimitAttempt("account_mutation", `u:${user.id}`);
  let body: unknown = null;
  try { body = await req.json(); } catch { body = null; }
  const verdict = verifyAdReceipt(body);
  if (!verdict.ok) return NextResponse.json({ error: verdict.reason }, { status: verdict.status });
  const creditId = grantAdCreditsOnce(user.id, AD_CREDIT_GRANT, `rewarded-ad:${verdict.provider}:${verdict.nonce}`);
  if (creditId === null) return NextResponse.json({ error: "Dieser Werbenachweis wurde bereits eingelöst." }, { status: 409 });
  return NextResponse.json({ ok: true, quota: aiQuotaSnapshot(user.id) });
}
