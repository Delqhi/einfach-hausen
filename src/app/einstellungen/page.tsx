"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { supabase } from "@/lib/supabase";
import { BackIcon, CloseIcon } from "@/components/icons";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return <button className={`switch ${on ? "on" : ""}`} onClick={onClick}><span className="knob" /></button>;
}

export default function EinstellungenPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [push, setPush] = useState(true);
  const [emails, setEmails] = useState(true);
  const [delOpen, setDelOpen] = useState(false);
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <section className="ob-head"><h1>Einstellungen</h1></section>
      <div style={{ padding: "18px 18px 0" }}>
        <div className="toggle-card"><div className="toggle-icon">🔔</div><div className="toggle-text"><strong>Push-Benachrichtigungen</strong><span>Neue Angebote & Chat-Nachrichten</span></div><Toggle on={push} onClick={() => setPush(!push)} /></div>
        <div className="toggle-card"><div className="toggle-icon">✉️</div><div className="toggle-text"><strong>E-Mail-Benachrichtigungen</strong><span>Zusammenfassung per E-Mail</span></div><Toggle on={emails} onClick={() => setEmails(!emails)} /></div>
        <button className="subcat-item" onClick={() => router.push("/profil")} style={{ marginTop: 14 }}><span className="toggle-icon">🧑</span><span className="subcat-text"><strong>Profil bearbeiten</strong><span>Name & Telefon</span></span></button>
        <button className="btn-ghost btn-full" style={{ marginTop: 14 }} onClick={async () => { await signOut(); router.replace("/"); }}>Abmelden</button>
        <button className="btn-ghost btn-full" style={{ borderColor: "#d0452e", color: "#d0452e", marginTop: 12 }} onClick={() => setDelOpen(true)}>Konto löschen</button>
      </div>
      {delOpen && (
        <>
          <div className="menu-overlay open" onClick={() => setDelOpen(false)} />
          <div className="sheet"><div className="sheet-handle" /><div className="sheet-head"><h3>Konto wirklich löschen?</h3><button onClick={() => setDelOpen(false)}><CloseIcon /></button></div><p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>Alle deine Anfragen und Daten werden dauerhaft gelöscht. Das kann nicht rückgängig gemacht werden.</p><button className="btn-danger btn-full" style={{ marginBottom: 10 }} onClick={async () => { const { data } = await supabase.auth.getUser(); await fetch("/api/konto-loeschen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: (data as any).user?.id }) }); await signOut(); router.replace("/"); }}>Endgültig löschen</button><button className="btn-ghost btn-full" style={{ marginBottom: 20 }} onClick={() => setDelOpen(false)}>Abbrechen</button></div>
        </>
      )}
      <div className="home-indicator" />
    </div>
  );
}
