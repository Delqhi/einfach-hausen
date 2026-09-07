import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.headers.get("x-webhook-secret") !== process.env.WEBHOOK_SECRET) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // Stillgelegt (2026-09-03): Legacy-Supabase-Hook für die `angebote`-Welt
  // (las `anfragen`/`angebote`-Tabellen per Service-Role). Angebote laufen
  // über das App-Modell (quotes); siehe docs/JOBS_VS_ANFRAGEN.md.
  return NextResponse.json({ ok: false, error: "decommissioned", detail: "Legacy-Hook neues-angebot ist stillgelegt (siehe docs/JOBS_VS_ANFRAGEN.md)." }, { status: 410 });
}
