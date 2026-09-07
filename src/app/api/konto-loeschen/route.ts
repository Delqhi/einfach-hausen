import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";
import { deleteAccountData } from "@/lib/account-deletion";
import { structuredLog } from "@/lib/observability";

// Self-service account deletion (EH T-0203). The session's verified identity
// is the only authorization input; any body payload (e.g. a legacy userId) is
// deliberately ignored so one account can never delete another.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = `u:${user.id}`;
  if (!checkRateLimit("account_mutation", key).allowed) {
    return NextResponse.json({ error: "Zu viele Versuche. Bitte später erneut." }, { status: 429 });
  }
  consumeRateLimitAttempt("account_mutation", key);

  try {
    await deleteAccountData(user.id);
  } catch (error) {
    // Never leak internals to the client, but keep the failure diagnosable.
    structuredLog.error("database", "account deletion failed", {
      user_id: user.id,
      reason: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Löschen fehlgeschlagen. Bitte Support kontaktieren." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
