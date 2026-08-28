import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail, mailTemplates } from "@/lib/mailer";

export async function POST(req: Request) {
  const body = await req.json();
  if (req.headers.get("x-webhook-secret") !== process.env.WEBHOOK_SECRET) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (body.type !== "INSERT" || body.table !== "angebote") return NextResponse.json({ ok: true });
  const angebot = body.record;
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: anfrage } = await admin.from("anfragen").select("user_id, titel").eq("id", angebot.anfrage_id).single();
  if (!anfrage) return NextResponse.json({ ok: true });
  const { data: owner } = await admin.auth.admin.getUserById((anfrage as any).user_id);
  const email = (owner as any)?.user?.email;
  if (!email) return NextResponse.json({ ok: true });
  await sendMail(email, `🏠 Neues Angebot: ${(anfrage as any).titel}`, mailTemplates.neuesAngebotFuerOwner(angebot.firma, (anfrage as any).titel, angebot.preis, angebot.anfrage_id));
  return NextResponse.json({ ok: true });
}
