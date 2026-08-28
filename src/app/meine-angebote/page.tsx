"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { getMeineAngebote } from "@/lib/anfragen";
import { BackIcon } from "@/components/icons";

const statusBadge: Record<string, { label: string; cls: string }> = {
  offen: { label: "Warte auf Antwort", cls: "badge-orange" },
  angenommen: { label: "✅ Angenommen!", cls: "badge-green" },
};

export default function MeineAngebotePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [liste, setListe] = useState<any[]>([]);
  useEffect(() => { if (!user) return; getMeineAngebote(user.id).then(({ data }: any) => setListe((data as any) ?? [])); }, [user]);
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head"><h1>Meine Angebote</h1></section>
      {liste.length === 0 ? (<div className="empty-box"><p>Noch keine Angebote abgegeben.</p></div>) : (
        <div className="req-card">{liste.map((ag: any, i: number) => { const st = statusBadge[ag.status] ?? statusBadge.offen; return (<div className="req-item" key={ag.id}>{i > 0 && <div className="req-divider" />}<div className="req-body"><div className="req-title-row"><span className={`badge ${st.cls}`}>{st.label}</span><strong className="req-title">{(ag.anfragen as any)?.titel}</strong></div><p className="req-plz">📍 {(ag.anfragen as any)?.plz} {(ag.anfragen as any)?.ort}</p></div><div className="req-right"><span className="req-price">{ag.preis} €</span>{ag.status === "angenommen" && <button className="quote-btn" onClick={() => router.push(`/chat/${ag.anfrage_id}`)}>Chat</button>}</div></div>); })}</div>
      )}
      <div className="home-indicator" />
    </div>
  );
}
