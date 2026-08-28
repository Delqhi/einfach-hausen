"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { StoreIcon, PersonIcon, MailIcon, LockSmallIcon, EyeIcon, GoogleIcon, AppleIcon, ShieldIcon, PinIcon, CheckCircleIcon, SearchIcon, StarIcon, CalendarBigIcon, ChatIcon } from "@/components/icons";

const benefits = [
  { icon: <SearchIcon />, title: "Passende Anfragen", text: "Erhalte Anfragen aus deiner Region." },
  { icon: <StarIcon />, title: "Mehr Aufträge", text: "Gewinne neue Kunden und steigere deinen Umsatz." },
  { icon: <CalendarBigIcon />, title: "Bessere Planung", text: "Behalte Termine und Aufträge immer im Blick." },
  { icon: <ChatIcon />, title: "Direkte Kommunikation", text: "Schreibe direkt mit Kunden – einfach und sicher." },
];

const trust = [
  { icon: <ShieldIcon />, title: "Sicher & vertraulich", text: "Deine Daten sind bei uns geschützt." },
  { icon: <PinIcon />, title: "Regional verbunden", text: "Nur Anfragen aus deiner Umgebung." },
  { icon: <CheckCircleIcon />, title: "Einfach & fair", text: "Transparente Nutzung ohne versteckte Kosten." },
];

export default function RegisterProPage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), company_name: company.trim(), role: "pro" } },
    });
    if (err) {
      setLoading(false);
      setError(err.message === "User already registered" ? "Ein Konto mit dieser E-Mail existiert bereits." : "Registrierung fehlgeschlagen. Bitte versuche es erneut.");
      return;
    }
    if (data.session) router.replace("/onboarding/pro");
    else router.replace("/check-email");
  }

  return (
    <div className="safe-top safe-bottom page pro-page">
      <div className="pro-hero">
        <div className="pro-hero-bg">
          <Image src="/images/haus.jpg" alt="Handwerker vor Fahrzeug" width={900} height={700} priority />
          <div className="pro-hero-fade" />
        </div>
        <button type="button" className="back-btn-float" onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#16333d" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className="pro-logo">
          <svg width="34" height="38" viewBox="0 0 72 78" fill="none"><path d="M10 34 L36 12 L62 34 V70 H30" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><rect x="30" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" /><rect x="36" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" /></svg>
          <div style={{ display: "flex", alignItems: "baseline", marginLeft: -6 }}><span className="logo-word green-word" style={{ fontSize: 26 }}>einfach</span><span className="logo-word ink-word" style={{ fontSize: 26 }}>hausen</span></div>
        </div>
        <p className="pro-tagline">Dein Zuhause. <span className="green">Alles geregelt.</span></p>
        <div className="pro-headline">
          <h1>Willkommen,<br /><span className="green">Dienstleister!</span></h1>
          <p>Erhalte passende Anfragen aus deiner Region und gewinne neue zufriedene Kunden.</p>
        </div>
      </div>
      <div className="benefit-card">
        {benefits.map((b, i) => (
          <div className="benefit" key={b.title}>
            {i > 0 && <div className="benefit-divider" />}
            {b.icon}
            <strong>{b.title}</strong>
            <span>{b.text}</span>
          </div>
        ))}
      </div>
      <section className="pro-form-section">
        <h2>Los geht&apos;s – in wenigen Schritten</h2>
        <p className="pro-form-sub">Erstelle dein Dienstleister-Konto und werde gefunden.</p>
        <form onSubmit={handleRegister} className="pro-form">
          <label className="pill-field"><StoreIcon /><input type="text" required placeholder="Unternehmensname" value={company} onChange={(e) => setCompany(e.target.value)} /></label>
          <label className="pill-field"><PersonIcon /><input type="text" required placeholder="Dein Name" value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="pill-field"><MailIcon /><input type="email" required inputMode="email" placeholder="E-Mail-Adresse" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="pill-field"><LockSmallIcon /><input type={showPw ? "text" : "password"} required placeholder="Passwort erstellen" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" className="eye-btn" onClick={() => setShowPw((v) => !v)}><EyeIcon /></button></label>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>{loading ? "Konto wird erstellt…" : "Konto erstellen"}</button>
          <div className="divider-or"><span>oder</span></div>
          <button type="button" className="btn-social"><GoogleIcon /> Mit Google anmelden</button>
          <button type="button" className="btn-social"><AppleIcon /> Mit Apple anmelden</button>
        </form>
        <p className="auth-footer">Schon ein Konto? <Link href="/login" className="link-strong">Anmelden</Link></p>
      </section>
      <section className="trust-grid">
        {trust.map((t) => (
          <div className="trust-item" key={t.title}>{t.icon}<strong>{t.title}</strong><span>{t.text}</span></div>
        ))}
      </section>
      <div className="wave"><svg viewBox="0 0 430 50" preserveAspectRatio="none" style={{ width: "100%", height: 50, display: "block" }}><path d="M0 35 C 120 0, 300 50, 430 15 L430 50 L0 50 Z" fill="#e7efeb" /></svg></div>
      <div className="home-indicator" />
    </div>
  );
}
