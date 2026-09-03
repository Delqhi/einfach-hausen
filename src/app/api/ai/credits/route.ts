import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";
import { grantAdCredits, aiQuotaSnapshot, AD_CREDIT_GRANT } from "@/lib/ai-engine";

// Rewarded-ad credit grant. In production the ad SDK posts a signed receipt;
// this endpoint must verify it before granting (placeholder documented in
// docs/OPERATIONS.md). Rate limiting keeps abuse bounded until then.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const gateKey = `u:${user.id}`;
  if (!checkRateLimit("account_mutation", gateKey).allowed) {
    return NextResponse.json({ error: "Zu viele Versuche." }, { status: 429 });
  }
  consumeRateLimitAttempt("account_mutation", gateKey);
  // TODO(T-0207 production): verify ad SDK receipt signature server-side.
  grantAdCredits(user.id, AD_CREDIT_GRANT, "rewarded-ad");
  return NextResponse.json({ ok: true, granted: AD_CREDIT_GRANT, quota: aiQuotaSnapshot(user.id) });
}
