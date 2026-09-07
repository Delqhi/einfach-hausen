"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { BackIcon } from "@/components/icons";
import { VisualAuftraege, VisualGebiet, VisualFertig } from "@/components/onboard-visuals";
import styles from "../onboarding-pro.module.css";

const leistungen = [
  { id: "bad", emoji: "🛁", titel: "Badezimmer", sub: "Fliesen, Sanitär, Umbau" },
  { id: "renovierung", emoji: "🔨", titel: "Renovierung", sub: "Maler, Boden, Türen" },
  { id: "garten", emoji: "🌿", titel: "Garten", sub: "Pflege, Bäume, Teich" },
  { id: "elektro", emoji: "⚡", titel: "Elektro", sub: "Installation, Reparatur" },
  { id: "heizung", emoji: "🔥", titel: "Heizung", sub: "Wartung, Einbau" },
  { id: "dach", emoji: "🏠", titel: "Dach & Fassade", sub: "Dach, Dämmung, Anstrich" },
];

export default function OnboardingProSchrittPage() {
  const params = useParams();
  const schritt = Array.isArray((params as any).schritt) ? (params as any).schritt[0] : (params as any).schritt;
  const router = useRouter();
  const { user } = useAuth();
  const [sel, setSel] = useState<string[]>([]);
  const [plz, setPlz] = useState("");
  const [umkreis, setUmkreis] = useState(25);
  const [busy, setBusy] = useState(false);
  const step = schritt as string;

  async function saveMeta(patch: object) {
    const supabase = await getSupabase();
    await supabase.auth.updateUser({ data: { ...(user as any)?.user_metadata, ...patch } as any });
  }

  async function finish() {
    setBusy(true);
    await saveMeta({ leistungen: sel, plz_liste: plz ? [plz] : [], umkreis_km: umkreis, onboarding_done: true });
    setBusy(false);
    router.replace("/pro");
  }

  const heads: Record<string, { h: string; p: string }> = {
    auftraege: { h: "Was bietest du an?", p: "Wähle deine Leistungen – wir zeigen dir nur passende Anfragen." },
    gebiet: { h: "Wo arbeitest du?", p: "Definiere dein Einzugsgebiet per Postleitzahl." },
    fertig: { h: "Alles bereit! 🎉", p: "Dein Profil ist eingerichtet. Los geht's!" },
  };
  const head = heads[step] ?? heads.auftraege;

  return (
    <div className={`safe-top page ob-page ${styles.bottomPad}`}>
      <header className="ob-header"><button className="back-btn" onClick={() => router.back()}><BackIcon /></button></header>
      {step === "auftraege" && <VisualAuftraege />}
      {step === "gebiet" && <VisualGebiet />}
      {step === "fertig" && <VisualFertig />}
      <div className={`ob-head ${styles.headCenter}`}><h1>{head.h}</h1><p className={styles.leadNarrow}>{head.p}</p></div>
      {step === "auftraege" && (
        <>
          <div className={`subcat-section ${styles.subcatPad}`}>
            <div className="subcat-list">
              {leistungen.map((l) => (
                <button key={l.id} className={`subcat-item ${sel.includes(l.id) ? "sel" : ""}`} onClick={() => setSel((s) => (s.includes(l.id) ? s.filter((x) => x !== l.id) : [...s, l.id]))}>
                  <span className="toggle-icon">{l.emoji}</span>
                  <span className="subcat-text"><strong>{l.titel}</strong><span>{l.sub}</span></span>
                  <span className={`checkbox-square ${sel.includes(l.id) ? "on" : ""}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="ob-actions"><button className="btn-primary btn-full" disabled={sel.length === 0} onClick={async () => { await saveMeta({ leistungen: sel }); router.push("/onboarding/pro/gebiet"); }}>Weiter ({sel.length} ausgewählt)</button></div>
        </>
      )}
      {step === "gebiet" && (
        <>
          <div className="ob-form">
            <div className="if-wrap"><span className="if-label">Postleitzahl (Einsatzgebiet)</span><input inputMode="numeric" maxLength={5} value={plz} onChange={(e) => setPlz(e.target.value)} placeholder="z. B. 22587" /></div>
            <div className={styles.rangeBlock}><div className={styles.rangeHead}><strong className={styles.rangeLabel}>Umkreis: {umkreis} km</strong></div><input className={styles.rangeInput} type="range" min={5} max={100} step={5} value={umkreis} onChange={(e) => setUmkreis(Number(e.target.value))} /></div>
          </div>
          <div className="ob-actions"><button className="btn-primary btn-full" disabled={plz.length !== 5} onClick={async () => { await saveMeta({ plz_liste: [plz], umkreis_km: umkreis }); router.push("/onboarding/pro/fertig"); }}>Weiter</button></div>
        </>
      )}
      {step === "fertig" && (
        <div className="ob-actions"><div className={`success-circle ${styles.successMargin}`}>✓</div><button className="btn-primary btn-full" disabled={busy} onClick={finish}>{busy ? "Speichere…" : "Zum Dashboard"}</button></div>
      )}
      <div className="home-indicator" />
    </div>
  );
}
