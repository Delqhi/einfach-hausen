"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { BackIcon, BookThinIcon, CatInnenIcon, CatGartenIcon, CatElektroIcon, CatDachIcon, CatSanitaerIcon, MoreIcon } from "@/components/icons";

const katIcon: Record<string, React.ReactNode> = {
  renovation: <CatInnenIcon />,
  garten: <CatGartenIcon />,
  elektro: <CatElektroIcon />,
  heizung: <CatSanitaerIcon />,
  dach: <CatDachIcon />,
  bad: <CatSanitaerIcon />,
  sonstiges: <MoreIcon />,
};

export default function HistoriePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { if (!user) return; supabase.from("anfragen").select("*").order("created_at", { ascending: false }).then(({ data }: any) => setItems(data ?? [])); }, [user]);
  const statusMap: Record<string, { label: string; cls: string }> = { offen: { label: "Unterwegs", cls: "badge-orange" }, angenommen: { label: "Abgeschlossen", cls: "badge-green" } };
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head history-head"><div className="history-title-icon"><BookThinIcon /></div><div><h1>Haus-Historie</h1><p>Alle Ereignisse und Aufträge deines Zuhauses.</p></div></section>
      {items.length === 0 ? (<div className="empty-box"><p>Noch keine Einträge.</p></div>) : (
        <div className="timeline">{items.map((a: any) => { const st = statusMap[a.status] ?? statusMap.offen; return (<div className="tl-item" key={a.id}><div className="tl-dot">{katIcon[a.kategorie] ?? <MoreIcon />}</div><div className="tl-body"><div className="tl-head"><strong>{a.titel}</strong><span className={`badge ${st.cls}`}>{st.label}</span></div><p>{new Date(a.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })} · {a.plz} {a.ort}</p></div></div>); })}</div>
      )}
      <div className="home-indicator" />
    </div>
  );
}
