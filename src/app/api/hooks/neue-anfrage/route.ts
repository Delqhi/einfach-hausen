import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.headers.get("x-webhook-secret") !== process.env.WEBHOOK_SECRET) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // Stillgelegt (2026-09-03): Legacy-Supabase-Hook für die `anfragen`-Welt.
  // Dispatch läuft über das App-Modell (jobs/quotes); siehe
  // docs/JOBS_VS_ANFRAGEN.md. Der Hook antwortet 410 statt zu dispatchen.
  return NextResponse.json({ ok: false, error: "decommissioned", detail: "Legacy-Hook neue-anfrage ist stillgelegt (siehe docs/JOBS_VS_ANFRAGEN.md)." }, { status: 410 });
}
