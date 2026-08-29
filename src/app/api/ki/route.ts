import { NextResponse } from "next/server";

const SYSTEM = `Du bist der freundliche Assistent von "einfachhausen", einer App für Hauseigentümer.
Du hilfst bei Problemen runds Haus (Handwerk, Garten, Sanitär, Elektro, Energie).
Antworte kurz (max. 4 Sätze), auf Deutsch, praktisch. Schließe ab mit einer gezielten Rückfrage
und schlage bei Bedarf vor, eine konkrete Anfrage zu erstellen ("Auftrag", "Beratung", "Notfall").`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) return NextResponse.json({ reply: "KI ist gerade nicht konfiguriert (OPENAI_API_KEY fehlt). Du kannst trotzdem über 'Neuen Auftrag' direkt starten." });
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages: [{ role: "system", content: SYSTEM }, ...(messages as any[]).slice(-12)], max_tokens: 300 }),
    });
    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "Entschuldigung, ich habe dich nicht verstanden." });
  } catch {
    return NextResponse.json({ reply: "Ups, KI nicht erreichbar. Versuch es später oder erstelle direkt eine Anfrage." });
  }
}
