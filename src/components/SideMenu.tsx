"use client";

import { useRouter } from "next/navigation";
import { CloseIcon, HomeMenuIcon, CalendarCheckThinIcon, PersonSmallIcon, BookThinIcon, GearMenuIcon, CrownIcon, LogoutIcon, ArrowRightThin } from "@/components/icons";

const items = [
  { icon: <HomeMenuIcon />, label: "Mein Haus", href: "/mein-haus" },
  { icon: <CalendarCheckThinIcon />, label: "Aufträge", href: "/auftraege" },
  { icon: <PersonSmallIcon />, label: "Ansprechpartner", href: "/ansprechpartner" },
  { icon: <BookThinIcon />, label: "Haus-Historie", href: "/historie" },
  { icon: <GearMenuIcon />, label: "Einstellungen", href: "/einstellungen" },
];

export default function SideMenu({ open, onClose, onLogout }: { open: boolean; onClose: () => void; onLogout: () => Promise<void> }) {
  const router = useRouter();
  return (
    <>
      <div className={`menu-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`side-menu ${open ? "open" : ""}`}>
        <div className="sm-head">
          <div className="sm-logo">
            <svg width="70" height="52" viewBox="0 0 120 88" fill="none" aria-hidden="true"><path d="M38 34 L74 12 L96 26 V82 H52" stroke="#14735c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="own-logo-text"><span className="own-logo-line1">einfach</span><span className="own-logo-line2">hausen</span></div>
          </div>
          <button className="sm-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <nav className="sm-nav">
          {items.map((it) => (
            <button key={it.label} className="sm-item" onClick={() => { onClose(); router.push(it.href); }}><span className="sm-icon">{it.icon}</span><span className="sm-label">{it.label}</span><ArrowRightThin /></button>
          ))}
        </nav>
        <div className="sm-divider" />
        <button className="sm-pro-card" onClick={() => router.push("/register-pro")}><span className="sm-pro-icon"><CrownIcon /></span><span className="sm-pro-text"><strong>Dienstleister werden</strong><span>Mehr Aufträge. Mehr Kunden.<br />Jetzt Partner werden!</span></span><ArrowRightThin /></button>
        <button className="sm-logout" onClick={onLogout}><LogoutIcon /> Abmelden</button>
        <div className="sm-footer">Version 1.0.0 &nbsp;•&nbsp; <a href="/datenschutz">Datenschutz</a> &nbsp;•&nbsp; <a href="/impressum">Impressum</a></div>
      </aside>
    </>
  );
}
