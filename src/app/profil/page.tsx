"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { BackIcon, PersonSmallIcon } from "@/components/icons";

export default function ProfilPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [name, setName] = useState("");
  const [tel, setTel] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (!user) return; queueMicrotask(() => { setName((user as any).user_metadata?.full_name || ""); setTel((user as any).user_metadata?.telefon || ""); }); }, [user]);
  async function save() { await supabase.auth.updateUser({ data: { full_name: name, telefon: tel } as any }); setSaved(true); setTimeout(() => setSaved(false), 1500); }
  if (!user) return null;
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <div className="profile-hero" style={{ textAlign: "center", padding: "10px 0 4px" }}><div className="profile-avatar" style={{ width: 92, height: 92, borderRadius: "50%", background: "#eaf4ee", display: "grid", placeItems: "center", margin: "0 auto 12px" }}><PersonSmallIcon /></div><h1 style={{ fontSize: 22, fontWeight: 800 }}>{(user as any).user_metadata?.full_name || "Profil"}</h1><span className="profile-role" style={{ display: "inline-block", marginTop: 6, background: "#eaf4ee", color: "#14735c", fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "4px 10px" }}>Konto</span></div>
      <div className="ob-form"><div className="if-wrap"><span className="if-label">Name</span><input value={name} onChange={(e) => setName(e.target.value)} /></div><div className="if-wrap"><span className="if-label">Telefon</span><input inputMode="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="+49 …" /></div><div className="if-wrap"><span className="if-label">E-Mail</span><input value={(user as any).email ?? ""} disabled style={{ opacity: .6 }} /></div><button className="btn-primary btn-full" onClick={save}>{saved ? "✅ Gespeichert" : "Speichern"}</button><button className="btn-ghost" style={{ background: "none", border: "1.5px solid #16333d", borderRadius: 16, padding: 16, fontWeight: 700 }} onClick={async () => { await signOut(); router.replace("/"); }}>Abmelden</button></div>
      <div className="home-indicator" />
    </div>
  );
}
