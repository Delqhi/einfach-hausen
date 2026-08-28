import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, mailTemplates } from "@/lib/mailer";

export async function POST(req: Request) {
  if (req.headers.get("x-webhook-secret") !== process.env.WEBHOOK_SECRET) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  if (body.type !== "INSERT" || body.table !== "anfragen") return NextResponse.json({ ok: true });
  const anfrage = body.record;
  if (anfrage.kategorie === "notfall") return NextResponse.json({ ok: true });
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data } = await admin.auth.admin.listUsers();
  const users: any[] = (data as any)?.users ?? [];
  // Legacy Supabase metadata is not an authorization source. Provider dispatch is
  // handled by the server-controlled application model; fail closed here until
  // this legacy hook is migrated to that model.
  const treffer: any[] = [];
  for (const pro of treffer) if (pro.email) await sendMail(pro.email, `${anfrage.dringend ? "⚡ " : ""}Neue Anfrage: ${anfrage.titel}`, mailTemplates.neueAnfrageFuerPro(anfrage.titel, anfrage.plz, anfrage.ort, anfrage.dringend, anfrage.id));
  return NextResponse.json({ ok: true, benachrichtigt: treffer.length });
}
