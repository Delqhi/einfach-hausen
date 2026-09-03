"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { categories } from "@/lib/categories";
import Stepper from "@/components/Stepper";
import { CameraIcon, MicIcon, ArrowRightWhite, CheckIcon, PinSmallIcon, BackIcon } from "@/components/icons";

export default function NeueAnfragePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  const [titel, setTitel] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");
  const [termin, setTermin] = useState("");
  const [budget, setBudget] = useState("");
  const [dringend, setDringend] = useState(false);
  const [sent, setSent] = useState(false);
  // Redirect timer must not outlive this page: if the component unmounts
  // (Fast Refresh, user navigates back) before it fires, the late
  // router.replace starts a transition that React immediately aborts with
  // "AbortError: Transition was skipped" (unhandled rejection in dev).
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); }, []);
  const selCat = categories.find((c) => c.id === cat);
  async function submit() {
    const supabase = await getSupabase();
    const { data } = await supabase.auth.getUser();
    await supabase.from("anfragen").insert({ user_id: (data as any).user?.id, kategorie: cat, unterkategorie: sub, titel, beschreibung, fotos, plz, ort, wunschtermin: termin || null, budget: budget || null, dringend, status: "offen" } as any);
    setSent(true);
    redirectTimer.current = setTimeout(() => router.replace("/app/jobs"), 1400);
  }
  if (sent) {
    return (
      <div className="page center-page safe-top safe-bottom">
        <div className="success-circle">✅</div>
        <h1>Anfrage gesendet!</h1>
        <p style={{ color: "var(--muted)" }}>Dienstleister in deiner Umgebung werden benachrichtigt.</p>
        <div className="home-indicator" />
      </div>
    );
  }
  return (
    <div className="safe-top safe-bottom page ob-page">
      <header className="ob-header"><button className="back-btn" onClick={() => (step === 1 ? router.back() : setStep(step - 1))}><BackIcon /></button></header>
      <Stepper current={step} />
      {step === 1 && (
        <>
          <section className="ob-head"><h1>Worum geht es?</h1><p>Wähle die passende Kategorie für dein Anliegen.</p></section>
          <div className="cat-panel" style={{ marginTop: 20 }}><div className="cat-grid">{categories.slice(0, 9).map((c) => (<button key={c.id} className={`cat-tile ${cat === c.id ? "sel" : ""}`} onClick={() => { setCat(c.id); setSub(null); }}><span className="cat-tile-title">{c.title}</span><span className={`cat-check ${cat === c.id ? "on" : ""}`}>{cat === c.id && <CheckIcon size={12} />}</span></button>))}</div></div>
          {selCat && (<div className="subcat-section"><h3>Was genau soll gemacht werden?</h3><div className="subcat-list" style={{ marginTop: 12 }}>{selCat.subs.map((s) => (<button key={s.id} className={`subcat-item ${sub === s.id ? "sel" : ""}`} onClick={() => setSub(s.id)}><span className={`checkbox-square ${sub === s.id ? "on" : ""}`}>{sub === s.id && <CheckIcon size={11} />}</span><span className="subcat-text"><strong>{s.title}</strong><span>{s.sub}</span></span></button>))}</div></div>)}
          <div className="ob-actions"><button className="btn-primary btn-full" disabled={!cat || !sub} onClick={() => setStep(2)}>Weiter</button></div>
        </>
      )}
      {step === 2 && (
        <>
          <section className="ob-head"><h1>Beschreibe dein Vorhaben</h1><p>Je mehr Details, desto passende Angebote.</p></section>
          <div className="ob-form"><div className="if-wrap anf-titel"><span className="if-label">Titel</span><input value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="z. B. Badezimmer renovieren" /></div><div className="textarea-wrap"><span className="if-label">Beschreibung</span><textarea rows={6} maxLength={1000} value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="Was soll gemacht werden? Raumgröße, Materialwünsche, Besonderheiten…" /><span className="char-count">{beschreibung.length} / 1000</span></div><div className="ki-chips"><button type="button" className="ki-chip" onClick={() => setFotos((f) => [...f, `Foto ${f.length + 1}`])}><CameraIcon /> Foto hinzufügen</button><button type="button" className="ki-chip"><MicIcon /> Sprache</button></div>{fotos.length > 0 && <div className="chips">{fotos.map((f, i) => (<span className="chip" key={i} onClick={() => setFotos((p) => p.filter((_, j) => j !== i))}>{f} ✕</span>))}</div>}</div>
          <div className="ob-actions"><button className="btn-primary btn-full" disabled={!titel} onClick={() => setStep(3)}>Weiter</button></div>
        </>
      )}
      {step === 3 && (
        <>
          <section className="ob-head"><h1>Wo & wann?</h1><p>Wo soll der Auftrag ausgeführt werden?</p></section>
          <div className="ob-form"><div className="icon-field"><div className="icon-bubble"><PinSmallIcon /></div><div className="if-wrap"><span className="if-label">PLZ & Ort</span><div className="anf-plz-row"><input inputMode="numeric" maxLength={5} value={plz} onChange={(e) => setPlz(e.target.value)} placeholder="85609" /><input value={ort} onChange={(e) => setOrt(e.target.value)} placeholder="Aschheim" /></div></div></div><div className="if-wrap"><span className="if-label">Wunschtermin (optional)</span><input type="date" value={termin} onChange={(e) => setTermin(e.target.value)} /></div><div className="if-wrap"><span className="if-label">Budget (optional)</span><input inputMode="decimal" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="z. B. 2.000 – 5.000 €" /></div><div className="toggle-card"><div className="toggle-icon">⚡</div><div className="toggle-text"><strong>Dringend</strong><span>Soll der Auftrag schnellstmöglich starten?</span></div><button type="button" className={`switch ${dringend ? "on" : ""}`} onClick={() => setDringend((v) => !v)}><span className="knob" /></button></div></div>
          <div className="ob-actions"><button className="btn-primary btn-full" disabled={!plz || !ort} onClick={() => setStep(4)}>Weiter: Zusammenfassung</button></div>
        </>
      )}
      {step === 4 && (
        <>
          <section className="ob-head"><h1>Zusammenfassung</h1><p>Prüfe deine Angaben und sende die Anfrage.</p></section>
          <div className="summary-card"><div className="sum-row"><span>Kategorie</span><strong>{selCat?.title} – {selCat?.subs.find((s) => s.id === sub)?.title}</strong></div><div className="sum-row"><span>Titel</span><strong>{titel}</strong></div><div className="sum-row"><span>Beschreibung</span><strong>{beschreibung || "—"}</strong></div><div className="sum-row"><span>Ort</span><strong>{plz} {ort}</strong></div>{termin && <div className="sum-row"><span>Wunschtermin</span><strong>{termin}</strong></div>}{budget && <div className="sum-row"><span>Budget</span><strong>{budget}</strong></div>}<div className="sum-row"><span>Dringend</span><strong>{dringend ? "Ja ⚡" : "Nein"}</strong></div></div>
          <div className="ob-actions"><button className="btn-primary btn-full" onClick={submit}>Anfrage senden <ArrowRightWhite /></button></div>
        </>
      )}
      <div className="home-indicator" />
    </div>
  );
}
