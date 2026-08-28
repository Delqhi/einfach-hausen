"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { getOffeneAnfragenFuerPro } from "@/lib/anfragen";
import { BackIcon, PinSmallIcon, ArrowRightThin } from "@/components/icons";

export default function AnfragenProPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [liste, setListe] = useState<any[]>([]);
  const [filter, setFilter] = useState("Alle");
  useEffect(() => {
    if (!user) return;
    const cats = (user as any).user_metadata?.kategorien || (user as any).user_metadata?.leistungen || [];
    const pls = (user as any).user_metadata?.plz_liste || [];
    getOffeneAnfragenFuerPro(cats, pls).then((data: any) => setListe(data as any));
  }, [user]);
  const shown = filter === "Dringend" ? liste.filter((a) => a.dringend) : liste;
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head"><h1>Offene Anfragen</h1><p>{liste.length} passende Anfragen in deinem Gebiet.</p></section>
      <div className="seg-tabs">{["Alle", "Dringend"].map((f) => (<button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>{f}</button>))}</div>
      {shown.length === 0 ? (<div className="empty-box"><p>Keine offenen Anfragen gefunden.</p></div>) : (
        <div className="req-card">{shown.map((a: any, i: number) => (<button className="req-item as-btn" key={a.id} onClick={() => router.push(`/anfrage/${a.id}`)}>{i > 0 && <div className="req-divider" />}<div className="req-body"><div className="req-title-row">{a.dringend && <span className="badge badge-orange">⚡ Dringend</span>}<strong className="req-title">{a.titel}</strong></div><p className="req-plz"><PinSmallIcon /> {a.plz} {a.ort}</p></div><ArrowRightThin /></button>))}</div>
      )}
      <div className="home-indicator" />
    </div>
  );
}
