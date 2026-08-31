"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { PersonIcon, MailIcon, LockTinyIcon, EyeIcon, EyeOffIcon, GoogleIcon, AppleIcon, ShieldIcon, PinIcon, HeartIcon, HomeOutlineIcon, SearchThinIcon, ClipboardSmallIcon, ShieldSmallIcon, ChatFaceIcon, FlagDeIcon } from "@/components/icons";

const benefits = [
  { icon: <HomeOutlineIcon />, title: "Zuhause verwalten", text: "Alle Informationen, Dokumente und Wartungen im Blick." },
  { icon: <SearchThinIcon />, title: "Dienstleister finden", text: "Zuverlässige Profis aus deiner Region finden und vergleichen." },
  { icon: <ClipboardSmallIcon />, title: "Aufträge organisieren", text: "Anfragen stellen, Angebote erhalten und Aufträge verwalten." },
  { icon: <ShieldSmallIcon />, title: "Werte erhalten", text: "Regelmäßige Wartung und Historie steigern den Wert deiner Immobilie." },
  { icon: <ChatFaceIcon />, title: "Kommunikation", text: "Direkt mit Dienstleistern kommunizieren – alles an einem Ort." },
];

const trust = [
  { icon: <ShieldIcon />, title: "Sicher & vertrauenswürdig", text: "Deine Daten sind bei uns sicher und geschützt." },
  { icon: <PinIcon />, title: "Regional verbunden", text: "Wir arbeiten mit geprüften Dienstleistern in deiner Nähe." },
  { icon: <HeartIcon />, title: "Einfach & verständlich", text: "Intuitive Bedienung für ein sorgenfreies Zuhause." },
];

export default function RegisterOwnerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== password2) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), role: "owner" } },
    });
    if (err) {
      setLoading(false);
      setError(err.message === "User already registered" ? "Ein Konto mit dieser E-Mail existiert bereits." : "Registrierung fehlgeschlagen. Bitte versuche es erneut.");
      return;
    }
    if (data.session) router.replace("/app");
    else router.replace("/check-email");
  }

  return (
    <div className="safe-top safe-bottom page owner-reg-page">
      <div className="oreg-hero">
        <button type="button" className="back-btn-float" onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#1c2129" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="oreg-logo">
          <svg width="44" height="48" viewBox="0 0 72 78" fill="none"><path d="M10 34 L36 12 L62 34 V70 H30" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><rect x="30" y="22" width="3.2" height="3.2" rx="0.8" fill="#105258" /><rect x="36" y="22" width="3.2" height="3.2" rx="0.8" fill="#105258" /></svg>
          <div style={{ display: "flex", alignItems: "baseline", marginLeft: -6 }}><span className="logo-word green-word" style={{ fontSize: 30 }}>einfach</span><span className="logo-word ink-word" style={{ fontSize: 30 }}>hausen</span></div>
        </div>
        <p className="oreg-tagline">Dein Zuhause. <span className="green">Alles geregelt.</span></p>
        <div className="oreg-house"><Image src="/images/haus.jpg" alt="Modernes Einfamilienhaus" width={800} height={600} priority /></div>
        <div className="oreg-headline">
          <h1>Willkommen,<br /><span className="green">Eigentümer!</span></h1>
          <p>Behalte dein Zuhause im Blick,<br />finde zuverlässige Dienstleister<br />und verwalte alles an einem Ort.</p>
        </div>
      </div>
      <div className="oreg-benefits">
        {benefits.map((b, i) => (
          <div className="oreg-benefit" key={b.title}>
            {i > 0 && <div className="benefit-divider" />}
            <div className="oreg-benefit-icon">{b.icon}</div>
            <strong>{b.title}</strong>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
      <section className="oreg-form-section">
        <h2>Los geht&apos;s – in wenigen Schritten</h2>
        <p className="oreg-form-sub">Erstelle dein Eigentümer-Konto und lege direkt los.</p>
        <form onSubmit={handleRegister} className="oreg-form">
          <label className="pill-field"><PersonIcon /><input type="text" required placeholder="Dein Name" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="pill-field"><MailIcon /><input type="email" required inputMode="email" placeholder="E-Mail-Adresse" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="pill-field"><LockTinyIcon /><input type={showPw ? "text" : "password"} required autoComplete="new-password" placeholder="Passwort erstellen" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="eye-btn" onClick={() => setShowPw((v) => !v)}>{showPw ? <EyeOffIcon /> : <EyeIcon />}</button></label>
          <label className="pill-field"><LockTinyIcon /><input type={showPw2 ? "text" : "password"} required autoComplete="new-password" placeholder="Passwort wiederholen" value={password2} onChange={(e) => setPassword2(e.target.value)} /><button type="button" className="eye-btn" onClick={() => setShowPw2((v) => !v)}>{showPw2 ? <EyeOffIcon /> : <EyeIcon />}</button></label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>{loading ? "Konto wird erstellt…" : "Konto erstellen"}</button>
          <div className="divider-or"><span>oder</span></div>
          <button type="button" className="btn-social"><GoogleIcon /> Mit Google anmelden</button>
          <button type="button" className="btn-social"><AppleIcon /> Mit Apple anmelden</button>
        </form>
        <p className="auth-footer">Schon ein Konto? <Link href="/login" className="link-strong">Anmelden</Link></p>
      </section>
      <section className="oreg-trust">
        <div className="oreg-trust-row">
          {trust.map((t) => (
            <div className="oreg-trust-item" key={t.title}><div className="oreg-trust-icon">{t.icon}</div><strong>{t.title}</strong><span>{t.text}</span></div>
          ))}
        </div>
        <div className="oreg-made">
          <div className="oreg-made-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5.5" y="10.5" width="13" height="9.5" rx="2.5" stroke="#105258" strokeWidth="1.5" /><path d="M8.5 10.5V8a3.5 3.5 0 017 0v2.5" stroke="#105258" strokeWidth="1.5" /><path d="M12 14v2.5" stroke="#105258" strokeWidth="1.5" strokeLinecap="round" /></svg></div>
          <div><strong>Sicher. Einfach. Für dich gemacht.</strong><span>Made in Germany <FlagDeIcon /></span></div>
        </div>
      </section>
      <div className="home-indicator" />
    </div>
  );
}
