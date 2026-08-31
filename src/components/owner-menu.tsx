"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell as BellIco,
  BookOpen as BookIco,
  CircleCheck as CheckIco,
  CircleHelp as HelpIco,
  Clock as ClockIco,
  Ellipsis as DotsIco,
  FileText as FileIco,
  Hammer as HammerIco,
  Plus as PlusIco,
  Info as InfoIco,
  Users as UsersIco,
} from "lucide-react";
import {
  BookThinIcon,
  CalendarCheckThinIcon,
  CatDachIcon,
  CatElektroIcon,
  CatFensterIcon,
  CatInnenIcon,
  CatReinigungIcon,
  CatSanitaerIcon,
  CloseIcon,
  CrownIcon,
  GearMenuIcon,
  HomeMenuIcon,
  HamburgerIcon,
  LeafIcon,
  LogoutIcon,
  ShieldIcon,
  ArrowRightThin,
  PersonSmallIcon,
} from "@/components/icons";
import { logoutAction } from "@/app/actions";

type SubItem = { label: string; href?: string; icon: React.ReactNode; logout?: boolean };
type Section = { n: string; label: string; icon: React.ReactNode; href: string; open: boolean; subs: SubItem[] };

const cat = (icon: React.ReactNode, label: string): SubItem => ({ label, href: "/app/messages", icon });
const hist = (label: string, icon: React.ReactNode): SubItem => ({ label, href: "/app/home/history", icon });
const ico = (El: React.ComponentType<{ size?: number; strokeWidth?: number }>, size = 15) => <El size={size} strokeWidth={1.7} />;

const SECTIONS: Section[] = [
  {
    n: "1.", label: "Mein Haus", icon: <HomeMenuIcon />, href: "/app", open: false,
    subs: [
      { label: "Übersicht", href: "/app", icon: <HomeMenuIcon /> },
      { label: "Hausdaten", href: "/app/home/passport", icon: ico(FileIco, 16) },
      { label: "Weiteres", href: "/app/more", icon: ico(DotsIco, 16) },
    ],
  },
  {
    n: "2.", label: "Aufträge", icon: <CalendarCheckThinIcon />, href: "/app/jobs", open: false,
    subs: [
      { label: "Aktive Aufträge", href: "/app/jobs", icon: ico(ClockIco, 16) },
      { label: "Abgeschlossene Aufträge", href: "/app/jobs?tab=completed", icon: ico(CheckIco, 16) },
    ],
  },
  {
    n: "3.", label: "Ansprechpartner", icon: ico(UsersIco, 24), href: "/app/partners", open: true,
    subs: [
      { label: "Alle Ansprechpartner", href: "/app/messages", icon: ico(UsersIco, 16) },
      cat(<LeafIcon />, "Garten & Außen"),
      cat(<CatDachIcon />, "Dach & Fassade"),
      cat(<CatElektroIcon />, "Elektro"),
      cat(<CatFensterIcon />, "Fenster & Türen"),
      cat(<CatSanitaerIcon />, "Sanitär & Heizung"),
      cat(<CatReinigungIcon />, "Reinigung & Pflege"),
      cat(<CatInnenIcon />, "Renovierung & Innenausbau"),
      { label: "Ansprechpartner hinzufügen", href: "/app/messages", icon: ico(PlusIco, 16) },
    ],
  },
  {
    n: "4.", label: "Haus-Historie", icon: <BookThinIcon />, href: "/app/home/history", open: true,
    subs: [
      hist("Alle Ereignisse", ico(BookIco, 16)),
      hist("Renovierungen & Reparaturen", ico(HammerIco, 16)),
      hist("Neu Installation oder Zubauen", ico(HomeMenuIcon)),
      hist("Wartungen", ico(GearMenuIcon)),
      { label: "Ereignis hinzufügen", href: "/app/home/history", icon: ico(PlusIco, 16) },
    ],
  },
  {
    n: "5.", label: "Einstellungen", icon: <GearMenuIcon />, href: "/app/profile", open: true,
    subs: [
      { label: "Mein Profil", href: "/app/profile", icon: <PersonSmallIcon /> },
      { label: "Benachrichtigungen", href: "/notifications", icon: ico(BellIco, 16) },
      { label: "Datenschutz", href: "/datenschutz", icon: <ShieldIcon /> },
      { label: "Hilfe & Kontakt", href: "/hilfe", icon: ico(HelpIco, 16) },
      { label: "Über einfachhausen", href: "/ueber-uns", icon: ico(InfoIco, 16) },
      { label: "Abmelden", logout: true, icon: <LogoutIcon /> },
    ],
  },
];

export function OwnerMobileMenu({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const router = useRouter();

  function toggleSection(key: string) {
    setOpenSections((current) => ({ ...current, [key]: !(current[key] ?? SECTIONS.find((s) => s.n === key)?.open) }));
  }

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <details
      className="mobile-menu ehn-menu"
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
    >
      <summary aria-label="Hauptmenü öffnen"><HamburgerIcon /><span>Menü</span></summary>
      <div className="menu-overlay open" onClick={() => setOpen(false)} aria-hidden="true" />
      <aside className="side-menu ehn-drawer" aria-label="Hauptnavigation">
        <div className="sm-head">
          <div className="sm-logo">
            <svg width="70" height="52" viewBox="0 0 120 88" fill="none" aria-hidden="true"><path d="M38 34 L74 12 L96 26 V82 H52" stroke="#105258" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="own-logo-text"><span className="own-logo-line1">einfach</span><span className="own-logo-line2">hausen</span></div>
          </div>
          <button className="sm-close" onClick={() => setOpen(false)} aria-label="Menü schließen"><CloseIcon /></button>
        </div>

        <nav className="sm-nav ehn-acc">
          {SECTIONS.map((s) => (
            <div key={s.n} className={`ehn-acc-sec${(openSections[s.n] ?? s.open) ? " ehn-acc-open" : ""}`}>
              <button type="button" className="sm-item ehn-acc-head" aria-expanded={Boolean(openSections[s.n])} onClick={() => toggleSection(s.n)}>
                <span className="sm-icon">{s.icon}</span>
                <span className="sm-label">{s.n} {s.label}</span>
                <span className="ehn-acc-chevron" aria-hidden="true"><ArrowRightThin /></span>
              </button>
              {Boolean(openSections[s.n] ?? s.open) && <div className="ehn-acc-body">
                {s.subs.map((sub) =>
                  sub.logout ? (
                    <form key={sub.label} action={logoutAction} className="ehn-acc-row">
                      <button type="submit" className="ehn-acc-link"><span className="ehn-acc-ico">{sub.icon}</span><span>{sub.label}</span></button>
                    </form>
                  ) : (
                    <button key={sub.label} type="button" className={`ehn-acc-link${active === sub.href ? " ehn-acc-active" : ""}`} onClick={() => go(sub.href!)}>
                      <span className="ehn-acc-ico">{sub.icon}</span><span>{sub.label}</span>
                    </button>
                  ),
                )}
              </div>}
            </div>
          ))}
        </nav>

        <div className="sm-divider" />
        <button type="button" className="sm-pro-card" onClick={() => go("/register-pro")}>
          <span className="sm-pro-icon"><CrownIcon /></span>
          <span className="sm-pro-text"><strong>Dienstleister werden</strong><span>Mehr Aufträge. Mehr Kunden.<br />Jetzt Partner werden!</span></span>
          <ArrowRightThin />
        </button>
        <form action={logoutAction}>
          <button type="submit" className="sm-logout"><LogoutIcon /> Abmelden</button>
        </form>
        <div className="sm-footer">Version 1.0.0 &nbsp;•&nbsp; <Link href="/datenschutz">Datenschutz</Link> &nbsp;•&nbsp; <Link href="/impressum">Impressum</Link></div>
      </aside>
    </details>
  );
}
