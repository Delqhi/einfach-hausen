"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { BackIcon, ChatBubbleIcon } from "@/components/icons";

export default function AnfrageDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [anfrage, setAnfrage] = useState<any>(null);
  const [angebote, setAngebote] = useState<any[]>([]);
  const [angebotText, setAngebotText] = useState("");
  const [angebotPreis, setAngebotPreis] = useState("");
  const [gesendet, setGesendet] = useState(false);
  const [proMode, setProMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("eh_role") === "pro") queueMicrotask(() => setProMode(true));
    getSupabase().then((supabase) => {
      supabase.from("anfragen").select("*").eq("id", id as string).single().then(({ data }: any) => setAnfrage(data));
      supabase.from("angebote").select("*").eq("anfrage_id", id as string).then(({ data }: any) => setAngebote((data as any) ?? []));
    }).catch(() => {
      // No Supabase client (preview without env vars) — detail stays empty.
    });
  }, [id]);

  async function annehmen(angebotId: string) {
    const supabase = await getSupabase();
    await supabase.from("angebote").update({ status: "angenommen" } as any).eq("id", angebotId);
    await supabase.from("anfragen").update({ status: "in_bearbeitung" } as any).eq("id", id as string);
    setAngebote((a) => a.map((x) => (x.id === angebotId ? { ...x, status: "angenommen" } : x)));
  }

  async function angebotSenden() {
    const supabase = await getSupabase();
    const { data: auth }: any = await supabase.auth.getUser();
    await supabase.from("angebote").insert({ anfrage_id: id as string, pro_id: auth.user?.id, firma: (auth.user as any)?.user_metadata?.company_name || (auth.user as any)?.user_metadata?.full_name || "Dienstleister", text: angebotText, preis: parseFloat(angebotPreis.replace(",", ".")) || 0, bewertung: 4.8, entfernung: 12, status: "offen" } as any);
    setGesendet(true);
    const { data }: any = await supabase.from("angebote").select("*").eq("anfrage_id", id as string);
    setAngebote((data as any) ?? []);
  }

  if (!anfrage) return <div className="page center-page"><p>Lädt…</p></div>;
  const hasAccepted = angebote.some((a) => a.status === "angenommen");
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head"><h1>{anfrage.titel}</h1></section>
      <div className="summary-card"><div className="sum-row"><span>Beschreibung</span><strong>{anfrage.beschreibung || "—"}</strong></div><div className="sum-row"><span>Ort</span><strong>{anfrage.plz} {anfrage.ort}</strong></div>{anfrage.budget && <div className="sum-row"><span>Budget</span><strong>{anfrage.budget}</strong></div>}</div>
      <h3 className="own-section-title" style={{ padding: "24px 20px 0" }}>Angebote ({angebote.length})</h3>
      {angebote.length === 0 && (<div className="empty-box"><p>Noch keine Angebote. Dienstleister prüfen deine Anfrage.</p></div>)}
      <div className="req-card">{angebote.map((ag, i) => (<div className="req-item" key={ag.id}>{i > 0 && <div className="req-divider" />}<div className="req-icon"><ChatBubbleIcon /></div><div className="req-body"><strong className="req-title">{ag.firma}</strong><p className="req-text">{ag.text}</p><p className="req-plz">⭐ {ag.bewertung} • {ag.entfernung} km</p></div><div className="req-right"><span className="req-price">{ag.preis} €</span>{ag.status === "angenommen" ? (<span className="badge badge-green">Angenommen</span>) : !proMode ? (<button className="quote-btn" onClick={() => annehmen(ag.id)}>Annehmen</button>) : null}</div></div>))}</div>
      {!proMode && hasAccepted && (<button className="btn-primary btn-full" style={{ margin: "16px 18px 0" }} onClick={() => router.push(`/chat/${id}`)}>💬 Mit Handwerker chatten</button>)}
      {proMode && (
        <div className="summary-card" style={{ marginTop: 24 }}>
          <h3 style={{ padding: "12px 0 4px", fontSize: 17, fontWeight: 800 }}>Angebot abgeben</h3>
          {gesendet ? (<p style={{ color: "var(--green)", fontWeight: 700, padding: "8px 0 14px" }}>✅ Angebot gesendet!</p>) : (
            <>
              <div className="if-wrap" style={{ marginBottom: 12 }}><span className="if-label">Nachricht an den Eigentümer</span><textarea rows={4} value={angebotText} onChange={(e) => setAngebotText(e.target.value)} placeholder="Warum bist du der Richtige? Enthaltene Leistungen…" /></div>
              <div className="if-wrap" style={{ marginBottom: 14 }}><span className="if-label">Preis (€)</span><input inputMode="decimal" value={angebotPreis} onChange={(e) => setAngebotPreis(e.target.value)} placeholder="z. B. 1250" /></div>
              <button className="btn-primary btn-full" disabled={!angebotText || !angebotPreis} onClick={angebotSenden}>Angebot senden</button><div style={{ height: 14 }} />
            </>
          )}
        </div>
      )}
      <div className="home-indicator" />
    </div>
  );
}
