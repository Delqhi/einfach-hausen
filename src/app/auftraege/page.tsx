"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BackIcon, ArrowRightThin, PlusIcon2, PinSmallIcon } from "@/components/icons";

const statusMap: Record<string, { label: string; cls: string }> = {
  offen: { label: "Offen", cls: "badge-orange" },
  in_bearbeitung: { label: "In Bearbeitung", cls: "badge-green" },
  abgeschlossen: { label: "Abgeschlossen", cls: "badge-gray" },
};

export default function AuftraegePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"aktiv" | "fertig">("aktiv");
  const [anfragen, setAnfragen] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("anfragen").select("*").order("created_at", { ascending: false }).then(({ data }: any) => setAnfragen((data as any) ?? []));
  }, []);
  const liste = anfragen.filter((a) => (tab === "aktiv" ? a.status !== "abgeschlossen" : a.status === "abgeschlossen"));
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head"><h1>Meine Aufträge</h1></section>
      <div className="seg-tabs"><button className={tab === "aktiv" ? "on" : ""} onClick={() => setTab("aktiv")}>Aktiv</button><button className={tab === "fertig" ? "on" : ""} onClick={() => setTab("fertig")}>Abgeschlossen</button></div>
      {liste.length === 0 && (<div className="empty-box"><p>Noch keine Aufträge hier.</p><button className="btn-primary" onClick={() => router.push("/anfrage/neu")}>Erste Anfrage erstellen</button></div>)}
      <div className="req-card">{liste.map((a, i) => { const st = statusMap[a.status] ?? statusMap.offen; return (<button className="req-item as-btn" key={a.id} onClick={() => router.push(`/anfrage/${a.id}`)}>{i > 0 && <div className="req-divider" />}<div className="req-body"><div className="req-title-row"><span className={`badge ${st.cls}`}>{st.label}</span><strong className="req-title">{a.titel}</strong></div><p className="req-plz"><PinSmallIcon /> {a.plz} {a.ort}{a.dringend && <span className="req-price">⚡ Dringend</span>}</p></div><ArrowRightThin /></button>); })}</div>
      <button className="fab-plus" onClick={() => router.push("/anfrage/neu")}><PlusIcon2 /></button>
      <div className="home-indicator" />
    </div>
  );
}
