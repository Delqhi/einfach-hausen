"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { BackIcon, PlusIcon2 } from "@/components/icons";

export default function MeinHausPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [haeuser, setHaeuser] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", adresse: "", plz: "", ort: "", baujahr: "" });
  useEffect(() => { if (!user) return; getSupabase().then((supabase) => supabase.from("haeuser").select("*").order("created_at").then(({ data }: any) => setHaeuser(data ?? []))).catch(() => { /* no Supabase client (preview) — list stays empty */ }); }, [user]);
  async function save() {
    const supabase = await getSupabase();
    await supabase.from("haeuser").insert({ user_id: (user as any).id, name: form.name || "Mein Zuhause", adresse: form.adresse, plz: form.plz, ort: form.ort, baujahr: form.baujahr ? parseInt(form.baujahr) : null } as any);
    setAddOpen(false); setForm({ name: "", adresse: "", plz: "", ort: "", baujahr: "" });
    const { data }: any = await supabase.from("haeuser").select("*").order("created_at");
    setHaeuser(data ?? []);
  }
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button><button className="back-btn" onClick={() => setAddOpen(true)}><PlusIcon2 /></button></header>
      <section className="ob-head"><h1>Mein Haus 🏡</h1><p>Deine Immobilien auf einen Blick.</p></section>
      {haeuser.length === 0 ? (<div className="empty-box"><p>Noch kein Haus angelegt. Tippe oben auf +.</p></div>) : haeuser.map((h: any) => (<div className="cat-panel" key={h.id} style={{ marginBottom: 14 }}><h3 style={{ fontSize: 18, fontWeight: 800 }}>{h.name}</h3><p style={{ marginTop: 6 }}>📍 {h.adresse}{h.plz && `, ${h.plz} ${h.ort}`}</p>{h.baujahr && <p style={{ marginTop: 4 }}>🏗️ Baujahr {h.baujahr}</p>}</div>))}
      {addOpen && (<><div className="menu-overlay open" onClick={() => setAddOpen(false)} /><div className="sheet"><div className="sheet-handle" /><div className="sheet-head"><h3>Neues Haus</h3></div><div style={{ padding: "0 22px 10px" }}><div className="if-wrap"><span className="if-label">Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="z. B. Familienhaus" /></div><div className="if-wrap"><span className="if-label">Adresse</span><input value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} /></div><div className="icon-field"><div className="if-wrap"><span className="if-label">PLZ</span><input inputMode="numeric" maxLength={5} value={form.plz} onChange={(e) => setForm({ ...form, plz: e.target.value })} /></div><div className="if-wrap"><span className="if-label">Ort</span><input value={form.ort} onChange={(e) => setForm({ ...form, ort: e.target.value })} /></div></div><div className="if-wrap"><span className="if-label">Baujahr</span><input inputMode="numeric" value={form.baujahr} onChange={(e) => setForm({ ...form, baujahr: e.target.value })} /></div><button className="btn-primary btn-full" onClick={save}>Speichern</button><div style={{ height: 18 }} /></div></div></>)}
      <div className="home-indicator" />
    </div>
  );
}
