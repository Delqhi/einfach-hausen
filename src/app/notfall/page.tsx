"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BackIcon, NotfallSirenIcon } from "@/components/icons";

const notfaelle = [
  { id: "wasser", icon: "💧", title: "Wasserschaden / Rohrbruch", text: "Wasser läuft aus – sofort Hilfe nötig" },
  { id: "strom", icon: "⚡", title: "Stromausfall / Gefahr", text: "Strom weg oder Funken, Brandgeruch" },
  { id: "heizung", icon: "🔥", title: "Heizungsausfall", text: "Keine Wärme, im Winter kritisch" },
  { id: "einplock", icon: "🚪", title: "Ausgesperrt", text: "Tür zu, Schlüssel weg" },
];

export default function NotfallPage() {
  const router = useRouter();
  const [sel, setSel] = useState<string | null>(null);
  const [plz, setPlz] = useState("");
  const [tel, setTel] = useState("");
  const [sent, setSent] = useState(false);
  async function send() {
    const { data } = await supabase.auth.getUser();
    await supabase.from("anfragen").insert({ user_id: (data as any).user?.id, kategorie: "notfall", unterkategorie: sel, titel: `NOTFALL: ${notfaelle.find((n) => n.id === sel)?.title}`, beschreibung: "Sofortige Hilfe angefordert über Notfall-Formular.", plz, telefon: tel, dringend: true, status: "offen" } as any);
    setSent(true);
  }
  if (sent) {
    return (
      <div className="page center-page safe-top safe-bottom">
        <div className="success-circle alert">🚨</div>
        <h1>Hilfe ist auf dem Weg!</h1>
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "0 24px" }}>Verfügbare Notfall-Dienstleister in deiner Nähe werden alarmiert und rufen dich zurück.</p>
        <button className="btn-primary" style={{ marginTop: 20, padding: "14px 28px", borderRadius: 14 }} onClick={() => router.replace("/dashboard")}>Zurück zur Startseite</button>
        <div className="home-indicator" />
      </div>
    );
  }
  return (
    <div className="safe-top safe-bottom page ob-page notfall-page">
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      <div className="nf-hero"><div className="nf-icon"><NotfallSirenIcon /></div><h1>Notfall melden</h1><p>Wähle die Art des Notfalls – verfügbare Dienstleister in deiner Nähe werden sofort alarmiert.</p></div>
      <div className="subcat-section" style={{ padding: 0, marginTop: 18 }}><div className="subcat-list">{notfaelle.map((n) => (<button key={n.id} className={`subcat-item ${sel === n.id ? "sel" : ""}`} onClick={() => setSel(n.id)}><span className="nf-emoji" style={{ fontSize: 24 }}>{n.icon}</span><span className="subcat-text"><strong>{n.title}</strong><span>{n.text}</span></span><span className={`checkbox-square ${sel === n.id ? "on" : ""}`} /></button>))}</div></div>
      <div className="ob-form" style={{ marginTop: 20 }}><div className="if-wrap"><span className="if-label">PLZ des Einsatzortes</span><input inputMode="numeric" maxLength={5} value={plz} onChange={(e) => setPlz(e.target.value)} placeholder="85609" /></div><div className="if-wrap"><span className="if-label">Telefonnummer für Rückruf</span><input inputMode="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="+49 …" /></div></div>
      <div className="ob-actions"><button className="btn-danger btn-full" disabled={!sel || !plz || !tel} onClick={send}>🚨 Sofort Hilfe anfordern</button><p className="nf-hint" style={{ textAlign: "center", fontSize: 12.5, color: "var(--muted)" }}>Bei akuter Gefahr (Brand, Lebensgefahr) rufe zuerst den Notruf 112 an.</p></div>
      <div className="home-indicator" />
    </div>
  );
}
