import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";
import { grantAdCreditsOnce, aiQuotaSnapshot, AD_CREDIT_GRANT } from "@/lib/ai-engine";
import { verifyAdReceipt } from "@/lib/ad-receipt";

// Rewarded-ad credit grant. The ad SDK posts a signed receipt; it is
// verified server-side (HMAC, freshness, single-use) before granting.
// Verification contract: docs/OPERATIONS.md ("KI-Ad-Credits").
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const gateKey = `u:${user.id}`;
  if (!checkRateLimit("account_mutation", gateKey).allowed) {
    return NextResponse.json({ error: "Zu viele Versuche." }, { status: 429 });
  }
  consumeRateLimitAttempt("account_mutation", gateKey);
  let body: unknown = null;
  try { body = await req.json(); } catch { body = null; }
  const verdict = verifyAdReceipt(body);
  if (!verdict.ok) return NextResponse.json({ error: verdict.reason }, { status: verdict.status });
  const source = `rewarded-ad:${verdict.provider}:${verdict.nonce}`;
  const creditId = grantAdCreditsOnce(user.id, AD_CREDIT_GRANT, source);
  if (creditId === null) return NextResponse.json({ error: "Dieser Werbenachweis wurde bereits eingelöst." }, { status: 409 });
  return NextResponse.json({ ok: true, granted: AD_CREDIT_GRANT, quota: aiQuotaSnapshot(user.id) });
}
