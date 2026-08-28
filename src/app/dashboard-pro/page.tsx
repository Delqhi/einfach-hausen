"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { MenuIcon, BellIcon, LeafIcon, ClipboardSmallIcon, CalendarCheckIcon, ChatBubbleIcon, TreeIcon, LeafSmallIcon, FireIcon, Chevron, PinSmallIcon, EuroDocIcon } from "@/components/icons";

const stats = [
  { icon: <LeafIcon />, value: "7", label: "Neue\nAnfragen" },
  { icon: <ClipboardSmallIcon />, value: "4", label: "Aktive\nAufträge" },
  { icon: <CalendarCheckIcon />, value: "3", label: "Nächste\nTermine" },
  { icon: <ChatBubbleIcon />, value: "2", label: "Offene\nNachrichten" },
];

const anfragen = [
  { icon: <TreeIcon />, badge: "Auftrag", badgeClass: "badge-green", title: "Gartenpflege", text: "Rasen mähen, Hecke schneiden,\nUnkraut entfernen", plz: "85609 Aschheim • 8 km", time: "vor 25 Min.", price: "ca. 120 €" },
  { icon: <LeafSmallIcon />, badge: "Beratung", badgeClass: "badge-green", title: "Garten umgestalten", text: "Neugestaltung Vorgarten, Beete,\nBepflanzung", plz: "81545 München • 12 km", time: "vor 1 Std.", price: null },
  { icon: <FireIcon />, badge: "Notfallservice", badgeClass: "badge-red", title: "Hecke schneiden", text: "Hecke ist zu hoch, dringender\nRückschnitt gewünscht", plz: "85521 Ottobrunn • 5 km", time: "vor 2 Std.", price: null },
];

export default function DashboardProPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [loading, user, router]);
  if (loading || !user) return <div className="page center-page"><p>Lädt…</p></div>;
  const firma = (user as any).user_metadata?.company_name || "Gartenbau Muster GmbH";
  const name = (user as any).user_metadata?.full_name || "Max Mustermann";
  const vorname = name.split(" ")[0];
  const stunde = new Date().getHours();
  const gruss = stunde < 11 ? "Guten Morgen" : stunde < 18 ? "Hallo" : "Guten Abend";
  return (
    <div className="safe-top safe-bottom page dash-page">
      <header className="dash-top"><button className="top-btn"><MenuIcon /></button><div className="dash-logo"><svg width="30" height="34" viewBox="0 0 72 78" fill="none"><path d="M10 34 L36 12 L62 34 V70 H30" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><rect x="30" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" /><rect x="36" y="22" width="3.2" height="3.2" rx="0.8" fill="#14735c" /></svg><div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginLeft: -4 }}><span className="logo-word green-word" style={{ fontSize: 22, lineHeight: 1 }}>einfach</span><span className="logo-word ink-word" style={{ fontSize: 22, lineHeight: 1 }}>hausen</span></div></div><button className="top-btn bell" onClick={() => setNotifOpen((v) => !v)}><BellIcon /><span className="bell-dot" /></button></header>
      <div className="top-line" />
      <section className="greet"><div><h1>{gruss}, {vorname}!</h1><p className="greet-name">{name}</p><p className="greet-firma">{firma}</p><p className="greet-gebiet"><PinSmallIcon /> Einsatzgebiet: 30 km um München</p></div><div className="avatar-wrap"><img src="/images/haus.jpg" alt="Profilbild" className="avatar" /><span className="online-dot" /></div></section>
      <section className="stat-card">{stats.map((s, i) => (<div className="stat" key={s.label}>{i > 0 && <div className="stat-divider" />}<div className="stat-icon">{s.icon}</div><strong>{s.value}</strong><span>{s.label}</span></div>))}</section>
      <div className="section-head"><h2>Anfragen in deiner Nähe</h2><button className="see-all">Alle anzeigen <Chevron /></button></div>
      <div className="req-card">{anfragen.map((a, i) => (<div className="req-item" key={a.title}>{i > 0 && <div className="req-divider" />}<div className="req-icon">{a.icon}</div><div className="req-body"><div className="req-title-row"><span className={`badge ${a.badgeClass}`}>{a.badge}</span><strong className="req-title">{a.title}</strong></div><p className="req-text">{a.text}</p><p className="req-plz"><PinSmallIcon /> {a.plz}</p></div><div className="req-right"><span className="req-time">{a.time}</span>{a.price && <span className="req-price">{a.price}</span>}</div><Chevron /></div>))}<div className="req-divider" /><button className="req-all">Alle Anfragen anzeigen <Chevron /></button></div>
      <div className="quote-card"><div className="quote-icon"><EuroDocIcon /></div><div className="quote-text"><strong>Kostenvoranschlag senden</strong><span>Bei vielen Anfragen sind bereits genug Angaben vorhanden.</span></div><button className="quote-btn">Jetzt erstellen</button></div>
      <div className="section-head"><h2>Nächste Termine</h2><button className="see-all">Alle anzeigen</button></div>
      <div className="term-card"><div className="term-date"><strong>26</strong><span>AUG</span></div><div className="term-body"><strong>Gartenpflege</strong><span>Privatgarten</span><span className="term-addr">Bahnhostraße 12, 85521 Ottobrunn</span></div><div className="term-right"><span className="term-today">Heute</span><span className="term-time">09:00 Uhr</span></div><Chevron /></div>
      <nav className="tabbar"><button className="tab active"><svg width="26" height="26" viewBox="0 0 24 24" fill="#14735c"><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6h-4v6H5a1 1 0 01-1-1v-9z" /></svg><span>Start</span></button><button className="tab"><svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#6b7d82" strokeWidth="1.6" /><path d="M16 16l4.5 4.5" stroke="#6b7d82" strokeWidth="1.6" strokeLinecap="round" /></svg><span>Anfragen</span></button><button className="tab"><ClipboardSmallIcon /><span>Aufträge</span></button><button className="tab tab-badge"><ChatBubbleIcon /><span className="tab-count">2</span><span>Nachrichten</span></button><button className="tab"><svg width="26" height="26" viewBox="0 0 24 24" fill="#6b7d82"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg><span>Mehr</span></button></nav>
      <div className="home-indicator" />
    </div>
  );
}
