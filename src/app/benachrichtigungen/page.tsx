"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { BackIcon } from "@/components/icons";

export default function BenachrichtigungenPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("angebote").select("*, anfragen!inner(titel, user_id)").eq("anfragen.user_id", user.id).order("created_at", { ascending: false }).limit(30).then(({ data }: any) => setItems((data as any) ?? []));
  }, [user]);
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head"><h1>Benachrichtigungen</h1></section>
      {items.length === 0 ? (<div className="empty-box"><p>🔔 Keine neuen Benachrichtigungen.</p></div>) : (
        <div className="req-card">{items.map((a: any, i: number) => (<div className="req-item" key={a.id}>{i > 0 && <div className="req-divider" />}<div className="req-icon" style={{ fontSize: 22 }}>🎉</div><div className="req-body"><strong className="req-title">Neues Angebot von {a.firma}</strong><p className="req-text">für „{(a.anfragen as any)?.titel}" · {a.preis} €</p></div><button className="quote-btn" onClick={() => router.push(`/anfrage/${a.anfrage_id}`)}>Öffnen</button></div>))}</div>
      )}
      <div className="home-indicator" />
    </div>
  );
}
