"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import SideMenu from "@/components/SideMenu";
import ActionSheet from "@/components/ActionSheet";
import { HamburgerIcon, BellRoundedIcon, ChatRoundIcon, NotfallSirenIcon, CalendarCheckThinIcon, PersonSmallIcon, BookThinIcon, RobotIcon, CameraIcon, MicIcon, ArrowRightThin, ArrowRightWhite } from "@/components/icons";

const quickActions = [
  { icon: <ChatRoundIcon variant="dark" />, dark: true, title: "Auftrag", text: "Handwerker beauftragen und Angebote erhalten." },
  { icon: <ChatRoundIcon variant="light" />, dark: false, title: "Beratung", text: "Fachliche Hilfe und Empfehlungen." },
  { icon: <NotfallSirenIcon />, dark: false, alert: true, title: "Notfall", text: "Schnelle Hilfe in dringenden Fällen." },
];

export default function DashboardOwnerPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [kiInput, setKiInput] = useState("");

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div className="page center-page"><p>Lädt…</p></div>;
  const name = (user as any).user_metadata?.full_name || "Eigentümer";

  return (
    <div className="safe-top safe-bottom page own-dash">
      <header className="own-top">
        <button className="own-burger" onClick={() => setMenuOpen(true)}><HamburgerIcon /></button>
        <div className="own-logo">
          <svg width="120" height="88" viewBox="0 0 120 88" fill="none" className="own-logo-svg" aria-hidden="true"><path d="M38 34 L74 12 L96 26 V82 H52" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div className="own-logo-text"><span className="own-logo-line1">einfach</span><span className="own-logo-line2">hausen</span></div>
        </div>
        <button className="own-bell" onClick={() => router.push("/benachrichtigungen")}><BellRoundedIcon /><span className="bell-dot" /></button>
      </header>
      <section className="qa-row">
        {quickActions.map((q) => (
          <button className={`qa-card ${q.alert ? "qa-alert" : ""}`} key={q.title} onClick={() => router.push(q.title === "Notfall" ? "/notfall" : q.title === "Beratung" ? "/ki-chat" : "/anfrage/neu")}>
            <div className={`qa-icon ${q.dark ? "qa-dark" : ""}`}>{q.icon}</div>
            <strong>{q.title}</strong>
            <span>{q.text}</span>
            <div className="qa-arrow"><ArrowRightThin /></div>
          </button>
        ))}
      </section>
      <section className="ki-card">
        <div className="ki-head"><div className="ki-robot"><RobotIcon /></div><div className="ki-title-row"><h2>Frag einfachhausen</h2><span className="ki-badge">KI</span></div><ArrowRightThin /></div>
        <p className="ki-text">Schilder uns dein Problem. Wir bringen dich mit dem richtigen Ansprechpartner in Kontakt oder willst du direkt Angebote vergleichen?</p>
        <div className="ki-input-row"><input value={kiInput} onChange={(e) => setKiInput(e.target.value)} placeholder="Was ist los bei dir?" onKeyDown={(e) => e.key === "Enter" && kiInput.trim() && router.push(`/ki-chat?prompt=${encodeURIComponent(kiInput)}`)} /><button className="ki-send" onClick={() => kiInput.trim() && router.push(`/ki-chat?prompt=${encodeURIComponent(kiInput)}`)}><ArrowRightWhite /></button></div>
        <div className="ki-chips"><button className="ki-chip" onClick={() => router.push("/ki-chat")}><CameraIcon /> Foto</button><button className="ki-chip" onClick={() => router.push("/ki-chat")}><MicIcon /> Sprache</button></div>
      </section>
      <h3 className="own-section-title">Mein Zuhause im Überblick</h3>
      <div className="overview-grid">
        <button className="ov-card" onClick={() => router.push("/auftraege")}><div className="ov-icon"><CalendarCheckThinIcon /></div><div className="ov-text"><strong>Aktuelle Aufträge</strong><span>2 aktiv</span></div><ArrowRightThin /></button>
        <button className="ov-card" onClick={() => router.push("/ansprechpartner")}><div className="ov-icon"><PersonSmallIcon /></div><div className="ov-text"><strong>Ansprechpartner</strong><span>5 gespeichert</span></div><ArrowRightThin /></button>
      </div>
      <button className="ov-card ov-wide" onClick={() => router.push("/historie")}><div className="ov-icon ov-icon-lg"><BookThinIcon /></div><div className="ov-text"><strong>Haus-Historie ansehen</strong><span>Alle Ereignisse, Maßnahmen und Dokumente rund um dein Zuhause.</span></div><ArrowRightThin /></button>
      <button className="fab-plus" onClick={() => setFabOpen(true)}><svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" /></svg></button>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} onLogout={async () => { await signOut(); router.replace("/login"); }} />
      <ActionSheet open={fabOpen} onClose={() => setFabOpen(false)} />
      <div className="home-indicator" />
    </div>
  );
}
