import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, consumeRateLimitAttempt } from "@/lib/security/rate-limit";
import { db } from "@/lib/db";
import { logSecurityEvent } from "@/lib/security/audit";

// GDPR data export (EH T-0203): a machine-readable JSON download of the
// requester's own personal data. Secrets (password hash) are never included.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key = `u:${user.id}`;
  if (!checkRateLimit("account_mutation", key).allowed) {
    return NextResponse.json({ error: "Zu viele Versuche. Bitte später erneut." }, { status: 429 });
  }
  consumeRateLimitAttempt("account_mutation", key);

  const id = user.id;
  const one = (sql: string) => db.prepare(sql).get(id) ?? null;
  const all = (sql: string) => db.prepare(sql).all(id);
  const allBoth = (sql: string) => db.prepare(sql).all(id, id);
  const payload = {
    exported_at: new Date().toISOString(),
    account: one("SELECT id,email,role,first_name,last_name,phone,created_at FROM users WHERE id=?"),
    homeowner_profile: one("SELECT postcode,address FROM homeowner_profiles WHERE user_id=?"),
    provider_profile: one("SELECT business_name,trades,postcode,radius_km,description,street_address FROM provider_profiles WHERE user_id=?"),
    provider_preferences: one("SELECT * FROM provider_preferences WHERE provider_id=?"),
    properties: all(`SELECT p.* FROM properties p JOIN property_ownerships o ON o.property_id=p.id WHERE o.homeowner_id=?`),
    house_assets: all("SELECT * FROM house_assets WHERE homeowner_id=?"),
    maintenance_tasks: all("SELECT * FROM maintenance_tasks WHERE homeowner_id=?"),
    house_history_entries: all("SELECT * FROM house_history_entries WHERE homeowner_id=?"),
    jobs_as_homeowner: all("SELECT id,title,description,category,status,created_at FROM jobs WHERE homeowner_id=?"),
    quotes_as_provider: all("SELECT job_id,amount,status,message,created_at FROM quotes WHERE provider_id=?"),
    subscriptions: all("SELECT plan_slug,status,current_period_end,created_at FROM subscriptions WHERE homeowner_id=?"),
    partner_subscriptions: all("SELECT plan_slug,status,current_period_end,created_at FROM partner_subscriptions WHERE provider_id=?"),
    invoices: allBoth("SELECT invoice_number,issue_date,service_date,currency,seller_name,buyer_name,subtotal_net,tax_amount,total_gross,status,created_at FROM invoices WHERE provider_id=? OR homeowner_id=?"),
    notifications: all("SELECT kind,title,body,href,created_at FROM notifications WHERE user_id=?"),
  };
  logSecurityEvent("account_export", `user:${id}`);
  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="einfach-hausen-export-${id}-${Date.now()}.json"`,
      "cache-control": "no-store",
    },
  });
}
