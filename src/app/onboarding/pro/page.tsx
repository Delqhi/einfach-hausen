"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Stepper from "@/components/Stepper";
import { categories } from "@/lib/categories";
import { BuildingIcon, ShieldSmallIcon, CalendarIcon, PhoneIcon, GlobeIcon, PinSmallIcon, GearIcon, ChevronDown, CatGartenIcon, CatElektroIcon, CatSanitaerIcon, CatDachIcon, CatFensterIcon, CatReinigungIcon, CatInnenIcon, CatMalerIcon, CatPoolIcon, CatMehrIcon, CheckIcon } from "@/components/icons";

const catIcons: Record<string, React.ReactNode> = {
  garten: <CatGartenIcon />,
  elektro: <CatElektroIcon />,
  sanitaer: <CatSanitaerIcon />,
  dach: <CatDachIcon />,
  fenster: <CatFensterIcon />,
  reinigung: <CatReinigungIcon />,
  innen: <CatInnenIcon />,
  maler: <CatMalerIcon />,
  pool: <CatPoolIcon />,
  mehr: <CatMehrIcon />,
};

const rechtformen = ["GmbH", "GbR", "Einzelunternehmen", "UG", "AG", "Freiberufler"];
const mitarbeiter = ["1", "2–7", "8–15", "16–50", "50+"];

export default function ProOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [firma, setFirma] = useState("");
  const [rechtform, setRechtform] = useState("GmbH");
  const [rfOpen, setRfOpen] = useState(false);
  const [gruendung, setGruendung] = useState("");
  const [mitarbeiterZahl, setMitarbeiterZahl] = useState("2–7");
  const [maOpen, setMaOpen] = useState(false);
  const [telefon, setTelefon] = useState("");
  const [webseite, setWebseite] = useState("");
  const [adresse, setAdresse] = useState("");
  const [beschreibung, setBeschreibung] = useState("");
  const [meister, setMeister] = useState(true);

  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [openSubCat, setOpenSubCat] = useState<string | null>(null);
  const [weitere, setWeitere] = useState<string[]>([]);
  const [weitereInput, setWeitereInput] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      const meta: any = data.user?.user_metadata;
      if (meta?.company_name) setFirma(meta.company_name);
    });
  }, []);

  const subsOfSelected = useMemo(() => categories.filter((c) => selectedCats.includes(c.id)), [selectedCats]);

  function toggleCat(id: string) {
    setSelectedCats((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
    setOpenSubCat(id);
  }

  async function saveStep1() {
    await supabase.auth.updateUser({
      data: {
        company_name: firma,
        legal_form: rechtform,
        founded: gruendung,
        employees: mitarbeiterZahl,
        phone: telefon,
        website: webseite,
        address: adresse,
        description: beschreibung,
        master_company: meister,
      },
    } as any);
    setStep(2);
  }

  async function saveStep2() {
    await supabase.auth.updateUser({
      data: { categories: selectedCats, subcategories: selectedSubs, extra_services: weitere } as any,
    });
    router.push("/onboarding/pro/gebiet");
  }

  return (
    <div className="safe-top safe-bottom page ob-page">
      <div className="ob-header">
        <button className="back-btn" onClick={() => (step === 1 ? router.back() : setStep(1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#1c2129" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="ob-logo">
          <svg width="30" height="34" viewBox="0 0 72 78" fill="none"><path d="M10 34 L36 12 L62 34 V70 H30" stroke="#105258" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /><rect x="30" y="22" width="5" height="5" rx="1" fill="#105258" /><rect x="39" y="22" width="5" height="5" rx="1" fill="#105258" /></svg>
          <span className="logo-word green-word" style={{ fontSize: 22 }}>einfach</span>
          <span className="logo-word ink-word" style={{ fontSize: 22 }}>hausen</span>
        </div>
      </div>
      <Stepper current={step} />
      {step === 1 && (
        <>
          <section className="ob-head"><h1>1. Firmendaten</h1><p>Erzähle uns etwas über dein Unternehmen.</p></section>
          <div className="ob-form">
            <div className="icon-field"><div className="icon-bubble"><BuildingIcon /></div><div className="if-wrap"><span className="if-label">Firmenname</span><input value={firma} onChange={(e) => setFirma(e.target.value)} placeholder="Muster & Sohn GmbH" /></div></div>
            <div className="icon-field"><div className="icon-bubble"><ShieldSmallIcon /></div><div className="if-wrap"><span className="if-label">Rechtsform</span><button type="button" className="if-select" onClick={() => setRfOpen((v) => !v)}>{rechtform} <ChevronDown /></button>{rfOpen && <div className="select-pop">{rechtformen.map((r) => (<div key={r} onClick={() => { setRechtform(r); setRfOpen(false); }}>{r}</div>))}</div>}</div></div>
            <div className="icon-row">
              <div className="icon-field half"><div className="icon-bubble"><CalendarIcon /></div><div className="if-wrap"><span className="if-label">Gründungsjahr</span><input inputMode="numeric" value={gruendung} onChange={(e) => setGruendung(e.target.value)} placeholder="2012" /></div></div>
              <div className="icon-field half no-icon"><div className="if-wrap"><span className="if-label">Mitarbeiterzahl</span><button type="button" className="if-select" onClick={() => setMaOpen((v) => !v)}>{mitarbeiterZahl} <ChevronDown /></button>{maOpen && <div className="select-pop">{mitarbeiter.map((m) => (<div key={m} onClick={() => { setMitarbeiterZahl(m); setMaOpen(false); }}>{m}</div>))}</div>}</div></div>
            </div>
            <div className="icon-field"><div className="icon-bubble"><PhoneIcon /></div><div className="if-wrap"><span className="if-label">Telefonnummer</span><input inputMode="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="+49 123 4567890" /></div></div>
            <div className="icon-field"><div className="icon-bubble"><GlobeIcon /></div><div className="if-wrap"><span className="if-label">Webseite (optional)</span><input value={webseite} onChange={(e) => setWebseite(e.target.value)} placeholder="www.muster-sohn.de" /></div></div>
            <div className="icon-field"><div className="icon-bubble"><PinSmallIcon /></div><div className="if-wrap"><span className="if-label">Firmensitz / Adresse</span><input value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Musterstraße 12, 12345 Musterstadt" /></div></div>
          </div>
          <section className="ob-about">
            <h3>Über dein Unternehmen</h3>
            <div className="textarea-wrap"><span className="if-label">Kurzbeschreibung</span><textarea rows={5} maxLength={500} value={beschreibung} onChange={(e) => setBeschreibung(e.target.value)} placeholder="Wir sind ein zuverlässiger Meisterbetrieb mit langjähriger Erfahrung…" /><span className="char-count">{beschreibung.length} / 500</span></div>
            <div className="toggle-card"><div className="toggle-icon"><GearIcon /></div><div className="toggle-text"><strong>Meisterbetrieb</strong><span>Ist dein Unternehmen ein eingetragener Meisterbetrieb?</span></div><button type="button" className={`switch ${meister ? "on" : ""}`} onClick={() => setMeister((v) => !v)}><span className="knob" /></button></div>
          </section>
          <div className="ob-actions"><button className="btn-primary btn-full" onClick={saveStep1}>Weiter: Leistungen auswählen <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button><button className="save-later">Speichern & später fortfahren</button></div>
        </>
      )}
      {step === 2 && (
        <>
          <section className="ob-head"><h1>2. Leistungen</h1><p>Wähle die Kategorien und Leistungen, die du anbietest.</p></section>
          <div className="cat-panel"><h3>Kategorien</h3><p className="cat-sub">Wähle eine oder mehrere Kategorien aus</p><div className="cat-grid">{categories.map((c) => { const sel = selectedCats.includes(c.id); return (<button type="button" key={c.id} className={`cat-tile ${sel ? "sel" : ""}`} onClick={() => toggleCat(c.id)}><span className="cat-tile-left">{catIcons[c.icon]}<span className="cat-tile-title">{c.title}</span></span><span className={`cat-check ${sel ? "on" : ""}`}>{sel && <CheckIcon color="#fff" size={12} />}</span></button>); })}</div></div>
          <section className="subcat-section"><h3>Unterkategorien</h3><p className="cat-sub">Wähle aus, was du konkret anbietest.</p>
            {subsOfSelected.map((cat) => (
              <div className="subcat-group" key={cat.id}>
                <button type="button" className="subcat-head" onClick={() => setOpenSubCat(openSubCat === cat.id ? null : cat.id)}><span className="subcat-head-left">{catIcons[cat.icon]} {cat.title}</span><ChevronDown /></button>
                {openSubCat === cat.id && <div className="subcat-list">{cat.subs.map((s) => { const sel = selectedSubs.includes(s.id); return (<button type="button" key={s.id} className={`subcat-item ${sel ? "sel" : ""}`} onClick={() => setSelectedSubs((prev) => (prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]))}><span className={`checkbox-square ${sel ? "on" : ""}`}>{sel && <CheckIcon color="#fff" size={11} />}</span><span className="subcat-text"><strong>{s.title}</strong><span>{s.sub}</span></span></button>); })}</div>}
              </div>
            ))}
            <div className="weitere"><span>Weitere Leistungen (optional)</span><div className="weitere-row"><input value={weitereInput} onChange={(e) => setWeitereInput(e.target.value)} placeholder="z. B. Winterdienst, Grünflächenpflege…" /><button type="button" className="plus-btn" onClick={() => { if (weitereInput.trim()) { setWeitere((w) => [...w, weitereInput.trim()]); setWeitereInput(""); } }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1c2129" strokeWidth="1.8" strokeLinecap="round" /></svg></button></div>{weitere.length > 0 && <div className="chips">{weitere.map((w, i) => (<span className="chip" key={i} onClick={() => setWeitere((p) => p.filter((_, j) => j !== i))}>{w} ✕</span>))}</div>}</div>
          </section>
          <div className="ob-actions"><button className="btn-primary btn-full" onClick={saveStep2}>Weiter: Arbeitsgebiet festlegen <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button><button className="save-later">Speichern & später fortfahren</button></div>
        </>
      )}
      <div className="home-indicator" />
    </div>
  );
}
