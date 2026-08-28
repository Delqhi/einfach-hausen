"use client";

import Image from "next/image";
import ActionCard from "@/components/ActionCard";
import { LoginIcon, UserPlusIcon, ShieldIcon, PinIcon, HeartIcon, HeadsetIcon } from "@/components/icons";

const features = [
  { icon: <ShieldIcon />, title: "Sicher & vertraulich", text: "Deine Daten sind bei uns sicher und geschützt." },
  { icon: <PinIcon />, title: "Regional verbunden", text: "Finde Dienstleister aus deiner Nähe." },
  { icon: <HeartIcon />, title: "Einfach & praktisch", text: "Alle Infos und Services für dein Zuhause." },
];

export default function WelcomePage() {
  return (
    <div className="safe-top safe-bottom page">
      <header className="header">
        <div className="logo-wrap">
          <svg width="64" height="70" viewBox="0 0 72 78" fill="none" aria-hidden="true">
            <path d="M10 34 L36 12 L62 34 V70 H30" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="30" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" />
            <rect x="36" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: -8 }}>
            <span className="logo-word green-word">einfach</span>
            <span className="logo-word ink-word">hausen</span>
          </div>
        </div>
        <p className="tagline">
          Dein Zuhause. <span className="green">Alles geregelt.</span>
        </p>
      </header>

      <section className="hero-text">
        <h1>Willkommen bei einfachhausen 👋</h1>
        <p>
          Dein Zuhause verwalten, dokumentieren und
          <br />
          die richtigen Dienstleister finden – alles an einem Ort.
        </p>
      </section>

      <div className="hero-image">
        <Image src="/images/haus.jpg" alt="Modernes Einfamilienhaus" width={1200} height={640} priority />
      </div>

      <main className="cards">
        <ActionCard icon={<LoginIcon />} title="Log in" subtitle={"Melde dich an und greife auf\ndein Konto zu."} href="/login" variant="tint" />
        <ActionCard icon={<UserPlusIcon />} title="Neues Konto" subtitle={"Erstelle ein neues Konto und\nlege direkt los."} href="/role" variant="bordered" />
      </main>

      <section className="features">
        {features.map((f) => (
          <div className="feature" key={f.title}>
            {f.icon}
            <strong>{f.title}</strong>
            <span>{f.text}</span>
          </div>
        ))}
      </section>

      <a href="/hilfe" className="support-card">
        <div>
          <strong>Hilfe benötigt?</strong>
          <span>Unser Support-Team ist für dich da.</span>
        </div>
        <HeadsetIcon />
      </a>

      <div className="home-indicator" />
    </div>
  );
}
