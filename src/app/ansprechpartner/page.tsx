"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { BackIcon, PlusIcon2 } from "@/components/icons";

export default function AnsprechpartnerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [liste, setListe] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rolle: "", telefon: "", email: "", notiz: "" });
  useEffect(() => { if (!user) return; getSupabase().then((supabase) => supabase.from("ansprechpartner").select("*").order("created_at", { ascending: false }).then(({ data }: any) => setListe(data ?? []))).catch(() => { /* no Supabase client (preview) — list stays empty */ }); }, [user]);
  async function save() {
    const supabase = await getSupabase();
    await supabase.from("ansprechpartner").insert({ user_id: (user as any).id, ...form } as any);
    setAddOpen(false); setForm({ name: "", rolle: "", telefon: "", email: "", notiz: "" });
    const { data }: any = await supabase.from("ansprechpartner").select("*").order("created_at", { ascending: false });
    setListe(data ?? []);
  }
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button><button className="back-btn" onClick={() => setAddOpen(true)}><PlusIcon2 /></button></header>
      <section className="ob-head"><h1>Ansprechpartner 👤</h1><p>Alle wichtigen Kontakte für dein Zuhause.</p></section>
      {liste.length === 0 ? (<div className="empty-box"><p>Noch keine Kontakte gespeichert.</p></div>) : (
        <div className="req-card">{liste.map((p: any, i: number) => (<div className="req-item" key={p.id}>{i > 0 && <div className="req-divider" />}<div className="req-icon" style={{ fontSize: 22 }}>{p.rolle === "Elektriker" ? "⚡" : p.rolle === "Schornsteinfeger" ? "🧹" : p.rolle === "Verwaltung" ? "🏢" : "👤"}</div><div className="req-body"><strong className="req-title">{p.name}</strong><p className="req-text">{p.rolle}</p>{p.telefon && <a href={`tel:${p.telefon}`} className="req-plz" style={{ color: "var(--green)", fontWeight: 700 }}>📞 {p.telefon}</a>}</div></div>))}</div>
      )}
      {addOpen && (<><div className="menu-overlay open" onClick={() => setAddOpen(false)} /><div className="sheet"><div className="sheet-handle" /><div className="sheet-head"><h3>Neuer Kontakt</h3></div><div style={{ padding: "0 22px 10px" }}><div className="if-wrap"><span className="if-label">Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div className="if-wrap"><span className="if-label">Rolle</span><input value={form.rolle} onChange={(e) => setForm({ ...form, rolle: e.target.value })} placeholder="z. B. Elektriker" /></div><div className="if-wrap"><span className="if-label">Telefon</span><input inputMode="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} /></div><div className="if-wrap"><span className="if-label">E-Mail</span><input inputMode="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div><button className="btn-primary btn-full" disabled={!form.name} onClick={save}>Speichern</button><div style={{ height: 18 }} /></div></div></>)}
      <div className="home-indicator" />
    </div>
  );
}
