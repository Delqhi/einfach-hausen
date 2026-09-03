"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import Stepper from "@/components/Stepper";

export default function GebietPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"radius" | "plz">("radius");
  const [plzZentrum, setPlzZentrum] = useState("");
  const [radius, setRadius] = useState(30);
  const [plzListe, setPlzListe] = useState<string[]>([]);
  const [plzInput, setPlzInput] = useState("");
  const [done, setDone] = useState(false);

  async function finish() {
    const supabase = await getSupabase();
    await supabase.auth.updateUser({ data: { area_mode: mode, area_center: plzZentrum, area_radius_km: mode === "radius" ? radius : null, area_plz: mode === "plz" ? plzListe : null, onboarding_complete: true } as any });
    setDone(true);
    setTimeout(() => router.replace("/pro"), 1200);
  }

  if (done) {
    return (
      <div className="page center-page safe-top safe-bottom">
        <div className="success-circle">🎉</div>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Geschafft!</h1>
        <p style={{ color: "var(--muted)" }}>Dein Dienstleister-Profil ist fertig.</p>
        <div className="home-indicator" />
      </div>
    );
  }

  return (
    <div className="safe-top safe-bottom page ob-page">
      <div className="ob-head" style={{ paddingTop: 20 }}>
        <h1>3. Arbeitsgebiet</h1>
        <p>Lege fest, wo du Aufträge annehmen möchtest.</p>
      </div>
      <Stepper current={3} />
      <div className="ob-form" style={{ paddingTop: 24 }}>
        <button type="button" className={`mode-card ${mode === "radius" ? "sel" : ""}`} onClick={() => setMode("radius")}><span className="mode-title">Umkreis</span><span className="mode-sub">Alle Aufträge in einem Radius um deine PLZ</span></button>
        <button type="button" className={`mode-card ${mode === "plz" ? "sel" : ""}`} onClick={() => setMode("plz")}><span className="mode-title">PLZ-Gebiete</span><span className="mode-sub">Bestimmte Postleitzahlen auswählen</span></button>
        {mode === "radius" ? (
          <div className="radius-box">
            <label className="field"><span>Postleitzahl des Zentrums</span><input inputMode="numeric" maxLength={5} value={plzZentrum} onChange={(e) => setPlzZentrum(e.target.value)} placeholder="85609" /></label>
            <label className="field"><span>Radius: {radius} km</span><input type="range" min={5} max={100} step={5} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="slider" /></label>
          </div>
        ) : (
          <div className="radius-box">
            <label className="field"><span>PLZ hinzufügen</span><div className="weitere-row"><input inputMode="numeric" maxLength={5} value={plzInput} onChange={(e) => setPlzInput(e.target.value)} placeholder="81667" /><button type="button" className="plus-btn" onClick={() => { if (plzInput.length === 5 && !plzListe.includes(plzInput)) { setPlzListe((p) => [...p, plzInput]); setPlzInput(""); } }}>+</button></div></label>
            <div className="chips">{plzListe.map((p) => (<span className="chip" key={p} onClick={() => setPlzListe((l) => l.filter((x) => x !== p))}>{p} ✕</span>))}</div>
          </div>
        )}
      </div>
      <div className="ob-actions"><button className="btn-primary btn-full" onClick={finish}>Weiter: Abschluss</button></div>
      <div className="home-indicator" />
    </div>
  );
}
