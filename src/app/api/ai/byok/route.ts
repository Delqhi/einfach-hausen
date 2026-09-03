import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";
import { db } from "@/lib/db";
import { encryptSecret, maskKey, decryptSecret } from "@/lib/security/secret-box";
import { byokGateway } from "@/lib/ai-engine";

// EH T-0207 BYOK: store a personal OpenAI-compatible API key, encrypted at
// rest. The key is never returned in plain text (only a masked preview) and
// never logged. Provider base/model are optional overrides.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const gateKey = `u:${user.id}`;
  if (!checkRateLimit("account_mutation", gateKey).allowed) {
    return NextResponse.json({ error: "Zu viele Versuche." }, { status: 429 });
  }
  consumeRateLimitAttempt("account_mutation", gateKey);

  let body: { apiKey?: string; baseUrl?: string; model?: string; disable?: boolean };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 }); }

  if (body.disable) {
    db.prepare(`UPDATE user_settings SET ai_byok_enabled=0,ai_byok_key_enc=NULL,updated_at=CURRENT_TIMESTAMP WHERE user_id=?`).run(user.id);
    return NextResponse.json({ ok: true, enabled: false });
  }

  const apiKey = String(body.apiKey ?? "").trim();
  const baseUrl = String(body.baseUrl ?? "").trim().replace(/\/$/, "");
  const model = String(body.model ?? "").trim();
  if (apiKey.length < 16 || /[^A-Za-z0-9_\-.]/.test(apiKey.slice(0, 200))) {
    return NextResponse.json({ error: "API-Key ungültig." }, { status: 400 });
  }
  if (baseUrl && !/^https:\/\//.test(baseUrl)) {
    return NextResponse.json({ error: "Basis-URL muss https sein." }, { status: 400 });
  }
  const enc = encryptSecret(apiKey);
  if (!enc) return NextResponse.json({ error: "BYOK serverseitig nicht verfügbar." }, { status: 503 });

  db.prepare(`INSERT INTO user_settings(user_id,ai_byok_enabled,ai_byok_provider,ai_byok_key_enc,ai_byok_base_url,ai_byok_model,updated_at)
              VALUES(?,1,'openai-compatible',?,?,?,CURRENT_TIMESTAMP)
              ON CONFLICT(user_id) DO UPDATE SET ai_byok_enabled=1,ai_byok_provider='openai-compatible',ai_byok_key_enc=excluded.ai_byok_key_enc,ai_byok_base_url=excluded.ai_byok_base_url,ai_byok_model=excluded.ai_byok_model,updated_at=CURRENT_TIMESTAMP`)
    .run(user.id, enc, baseUrl, model);
  return NextResponse.json({ ok: true, enabled: true, masked: maskKey(apiKey), gateway: byokGateway(user.id) });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const row = db.prepare('SELECT ai_byok_enabled,ai_byok_key_enc,ai_byok_base_url,ai_byok_model FROM user_settings WHERE user_id=?').get(user.id) as any;
  const masked = row?.ai_byok_key_enc ? maskKey(decryptSecret(row.ai_byok_key_enc) || '') : null;
  return NextResponse.json({ enabled: Boolean(row?.ai_byok_enabled), masked, baseUrl: row?.ai_byok_base_url || '', model: row?.ai_byok_model || '' });
}
