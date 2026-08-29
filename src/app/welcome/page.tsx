"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRightThin, HeadsetIcon, HeartIcon, LoginIcon, PinIcon, ShieldIcon, UserPlusIcon } from "@/components/icons";
import { useAuth } from "@/components/AuthContext";

const benefits = [
  { icon: <ShieldIcon />, title: "Sicher & vertraulich", text: "Deine Daten sind bei uns sicher und geschützt." },
  { icon: <PinIcon />, title: "Regional verbunden", text: "Finde Dienstleister aus deiner Nähe." },
  { icon: <HeartIcon />, title: "Einfach & praktisch", text: "Alle Infos und Services für dein Zuhause." },
];

export default function WelcomePage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) {
      // Canonical role resolution happens server-side from the application
      // identity. Providers entering /app are redirected to /pro by requireUser.
      router.replace("/app");
    }
  }, [session, loading, router]);

  return (
    <div className="wl-page safe-top safe-bottom">
      <header className="wl-logo">
        <svg width="52" height="46" viewBox="0 0 72 64" fill="none" aria-hidden="true"><path d="M8 30 L36 8 L64 30 M14 26 V58 H30 M58 58 V26 M30 58 V44 a6 6 0 0112 0 V58" stroke="#00565b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div className="wl-logo-text"><span className="wl-1">einfach</span><span className="wl-2">hausen</span></div>
        <p className="wl-tagline">Dein Zuhause. <span>Alles geregelt.</span></p>
      </header>

      <h1 className="wl-title">Willkommen bei einfachhausen 👋</h1>
      <p className="wl-sub">Dein Zuhause verwalten, dokumentieren und die richtigen Dienstleister finden – alles an einem Ort.</p>

      <img className="wl-hero" src="/images/welcome-house.png" alt="Modernes Einfamilienhaus am Abend" />

      <div className="wl-cards">
        <Link className="wl-card wl-card-mint" href="/login">
          <span className="wl-card-icon"><LoginIcon /></span>
          <span className="wl-card-text"><strong>Log in</strong><span>Melde dich an und greife auf dein Konto zu.</span></span>
          <span className="wl-card-arrow"><ArrowRightThin /></span>
        </Link>
        <Link className="wl-card" href="/role">
          <span className="wl-card-icon"><UserPlusIcon /></span>
          <span className="wl-card-text"><strong>Neues Konto</strong><span>Erstelle ein neues Konto und lege direkt los.</span></span>
          <span className="wl-card-arrow"><ArrowRightThin /></span>
        </Link>
      </div>

      <div className="wl-benefits">
        {benefits.map((b) => (
          <div className="wl-benefit" key={b.title}>
            {b.icon}
            <strong>{b.title}</strong>
            <span>{b.text}</span>
          </div>
        ))}
      </div>

      <Link className="wl-support" href="/kontakt">
        <span className="wl-card-text"><strong>Hilfe benötigt?</strong><span>Unser Support-Team ist für dich da.</span></span>
        <span className="wl-support-icon"><HeadsetIcon /></span>
      </Link>
      <div className="home-indicator" />
    </div>
  );
}
