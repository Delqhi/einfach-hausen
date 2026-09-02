"use client";

import { useRouter } from "next/navigation";
import { ArrowRightThin, BriefcaseIcon, ClipboardIcon, HomeOutlineIcon, HomeSmallIcon, LockIcon, PersonSearchIcon, ShieldSmallIcon } from "@/components/icons";
import auth from "@/components/marketing/auth-convergence.module.css";

const ownerBenefits = [
  { icon: <HomeSmallIcon />, title: "Haus organisieren", text: "Dokumente, Verträge und Daten sicher verwalten." },
  { icon: <PersonSearchIcon />, title: "Die richtigen finden", text: "Zuverlässige Dienstleister aus deiner Region entdecken." },
  { icon: <ClipboardIcon />, title: "Aufträge verwalten", text: "Anfragen stellen, Angebote vergleichen und Aufträge einfach verwalten." },
  { icon: <ShieldSmallIcon />, title: "Werte erhalten", text: "Wartungen im Blick behalten und den Wert deiner Immobilie sichern." },
];

export default function RolePage() {
  const router = useRouter();
  return (
    <div className={['role2-page safe-top safe-bottom', auth.authConverged, auth.rolePage].join(' ')}>
      <header className="role2-logo">
        <svg width="34" height="32" viewBox="0 0 72 64" fill="none" aria-hidden="true"><path d="M8 30 L36 8 L64 30 M14 26 V58 H30 M58 58 V26 M30 58 V44 a6 6 0 0112 0 V58" stroke="#105258" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div className="role2-logo-word"><span className="role2-logo-green">einfach</span><span className="role2-logo-ink">hausen</span></div>
      </header>
      <p className="wl-tagline">Dein Zuhause. <span>Alles geregelt.</span></p>

      <h1 className="role2-title">Schön,<br />dass du da bist!</h1>
      <p className="role2-sub">Bitte wähle, in welcher Rolle<br />du einfachhausen nutzen möchtest.</p>

      <section className="role2-owner-card">
        <div className="role2-owner-photo"><img src="/images/role-house.png" alt="Einfamilienhaus mit Terrasse" /></div>
        <div className="role2-owner-copy">
          <h2>Ich bin<br />Eigentümer</h2>
          <p>Behalte dein Zuhause im Blick, finde zuverlässige Dienstleister und verwalte alles an einem Ort.</p>
          <button type="button" className="role2-owner-cta" onClick={() => router.push("/register-owner")}>
            <span className="role2-owner-cta-house"><HomeOutlineIcon /></span>
            Als Eigentümer starten
            <span className="role2-owner-cta-arrow">→</span>
          </button>
        </div>
        <div className="role2-owner-benefits">
          {ownerBenefits.map((b) => (
            <div className="role2-benefit" key={b.title}>{b.icon}<strong>{b.title}</strong><span>{b.text}</span></div>
          ))}
        </div>
      </section>

      <button type="button" className="role2-pro-row" onClick={() => router.push("/register-pro")}>
        <span className="role2-pro-icon"><BriefcaseIcon /></span>
        <span className="wl-card-text"><strong>Ich bin Dienstleister</strong><span>Erhalte Anfragen, gewinne neue Kunden und verwalte deine Aufträge effizient.</span></span>
        <span className="role2-pro-arrow"><ArrowRightThin /></span>
      </button>

      <footer className="role2-trust">
        <span className="role2-trust-icon"><LockIcon /></span>
        <span className="wl-card-text"><strong>Sicher. Einfach. Für dich gemacht.</strong><span>Deine Daten sind bei uns sicher und geschützt.</span></span>
      </footer>
      <svg className="role2-wave" viewBox="0 0 390 42" preserveAspectRatio="none" aria-hidden="true"><path d="M0 30 C 65 8 130 8 195 22 C 260 36 325 40 390 18 L 390 42 L 0 42 Z" fill="#e7f0ec" /></svg>
      <div className="home-indicator" />
    </div>
  );
}
