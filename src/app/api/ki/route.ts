import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { applyRateLimitLockout, checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";

const SYSTEM = `Du bist der freundliche Assistent von "einfachhausen", einer App für Hauseigentümer.
Du hilfst bei Problemen runds Haus (Handwerk, Garten, Sanitär, Elektro, Energie).
Antworte kurz (max. 4 Sätze), auf Deutsch, praktisch. Schließe ab mit einer gezielten Rückfrage
und schlage bei Bedarf vor, eine konkrete Anfrage zu erstellen ("Auftrag", "Beratung", "Notfall").`;

const RATE_LIMITED = "Du hast gerade sehr viele Fragen gestellt. Bitte versuch es später erneut.";

function sanitize(messages: unknown): Array<{ role: "user" | "assistant"; content: string }> {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((m): m is { role: unknown; content: unknown } => Boolean(m) && typeof (m as { content?: unknown }).content === "string")
    .slice(-12)
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content).slice(0, 4000) }));
}

// Authenticated, rate-limited AI chat. The assistant runs on the configured
// OpenAI-compatible gateway (OmniRoute) — never on a hard-coded provider — so
// cost and access stay under local control (EH T-0202).
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

  const apiKey = process.env.AI_API_KEY || process.env.OMNIROUTE_MASTER_KEY;
  if (!apiKey) {
    return NextResponse.json({ reply: "KI ist gerade nicht konfiguriert. Du kannst trotzdem über 'Neuen Auftrag' direkt starten." });
  }
  const base = (process.env.AI_BASE_URL || "http://127.0.0.1:20128/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL || "auto/best-fast";
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, stream: false, messages: [{ role: "system", content: SYSTEM }, ...history], max_tokens: 300 }),
    });
    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "Entschuldigung, ich habe dich nicht verstanden." });
  } catch {
    return NextResponse.json({ reply: "Ups, KI nicht erreichbar. Versuch es später oder erstelle direkt eine Anfrage." });
  }
}
