import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { IntakeForm } from '@/components/home/intake-form';
import { ScrollShadow, SmoothScroll } from './motion';
import './tokens.css';
import styles from './mkt.module.css';
import logoMark from './assets/logo-mark.png';
import logoFull from './assets/logo-full.png';

// Self-hosted Inter Variable (DESIGN.md: "System-/Inter-nahe Sans"), scoped to
// the marketing shell so the accepted app screens stay untouched.
const interVariable = localFont({
  src: '../../fonts/InterVariable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-marketing',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

const primary = [
  ["So funktioniert's", '/so-funktionierts'],
  ['Leistungen', '/leistungen'],
  ['Hausakte', '/hausakte'],
  ['Preise', '/preise'],
  ['Hilfe', '/hilfe'],
] as const;

const mobileMore = [
  ['Für Eigenheimbesitzer', '/eigenheimbesitzer'],
  ['Pilotphase', '/pilotphase'],
  ['Für Betriebe', '/partner'],
  ['Über uns', '/ueber-uns'],
  ['Kontakt', '/kontakt'],
] as const;

const footerGroups = [
  {
    title: 'Produkt',
    links: [
      ["So funktioniert's", '/so-funktionierts'],
      ['Leistungen', '/leistungen'],
      ['Digitale Hausakte', '/hausakte'],
      ['Dein Ansprechpartner', '/so-funktionierts#ansprechpartner'],
      ['Preise', '/preise'],
    ],
  },
  {
    title: 'Für Eigentümer',
    links: [
      ['Für Eigenheimbesitzer', '/eigenheimbesitzer'],
      ['Pilotphase', '/pilotphase'],
      ['Sicherheit & Daten', '/sicherheit'],
      ['Hilfe & FAQ', '/hilfe'],
      ['Anmelden', '/login'],
    ],
  },
  {
    title: 'Für Betriebe',
    links: [
      ['Partner werden', '/partner'],
      ['Partner-App', '/partner#partner-app'],
      ['Qualitätsmodell', '/partner#qualitaet'],
      ['Partner-Modelle', '/preise'],
      ['Partner-Login', '/login'],
    ],
  },
  {
    title: 'Einfach Hausen',
    links: [
      ['Über uns', '/ueber-uns'],
      ['Kontakt', '/kontakt'],
      ['Impressum', '/impressum'],
      ['Datenschutz', '/datenschutz'],
      ['AGB', '/agb'],
      ['Barrierefreiheit', '/barrierefreiheit'],
    ],
  },
] as const;

export function MarketingShell({ children, footerIntake = true }: { children: React.ReactNode; footerIntake?: boolean }) {
  return (
    <div className={`mkt ${styles.site} ${interVariable.variable}`}>
      <SmoothScroll />
      <a className={styles.skipLink} href="#main-content">Zum Inhalt springen</a>
      <ScrollShadow>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            {/* Native navigation keeps the public shell hydration-free. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className={styles.logoLink} href="/" aria-label="einfachhausen Startseite">
              <Image src={logoMark} alt="" width={34} height={26} priority className={styles.logoImg} />
              <span className={styles.logoWord}><b>einfach</b><span>hausen</span></span>
            </a>
            <nav className={styles.desktopNav} aria-label="Hauptnavigation">
              {primary.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
            </nav>
            <div className={styles.headerActions}>
              <a className={`${styles.btnGhost} ${styles.btnSm}`} href="/login">Anmelden</a>
              <a className={`${styles.btnPrimary} ${styles.btnSm}`} href="/register?role=homeowner">Kostenlos starten <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
            <details className={styles.mobileMenu}>
              <summary aria-label="Menü öffnen"><Menu className={styles.menuIcon} size={22} /><X className={styles.closeIcon} size={22} /></summary>
              <nav aria-label="Mobile Navigation">
                {[...primary, ...mobileMore].map(([label, href]) => <a key={href} href={href}>{label}</a>)}
                <a href="/impressum">Impressum</a>
                <a href="/datenschutz">Datenschutz</a>
                <a href="/agb">AGB</a>
                <div className={styles.mobileMenuActions}>
                  <a className={styles.btnGhost} href="/login">Anmelden</a>
                  <a className={styles.btnPrimary} href="/register?role=homeowner">Kostenlos starten</a>
                </div>
              </nav>
            </details>
          </div>
        </header>
      </ScrollShadow>
      <main id="main-content">{children}</main>
      <footer className={`${styles.footer} ${styles.onDark}`}>
        {footerIntake && (
          <div className={styles.footerIntake}>
            <div className={styles.footerIntakeInner}>
              <h2>Noch nicht gestartet? Sag uns einfach, was ansteht.</h2>
              <IntakeForm variant="band" />
            </div>
          </div>
        )}
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" aria-label="einfachhausen Startseite"><Image src={logoFull} alt="einfachhausen" width={140} height={97} className={styles.logoImg} style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }} /></a>
            <p className={styles.footerClaim}>Regional. Menschlich. Organisiert.</p>
            <p>Dein persönlicher Hausmanager: Anliegen beschreiben, geprüfte Partner aus deiner Region übernehmen, alles bleibt in deiner Hausakte.</p>
            <span>© 2026 Einfach Hausen</span>
          </div>
          <div className={styles.footerGrid}>
            {footerGroups.map((group) => (
              <section key={group.title}>
                <h2>{group.title}</h2>
                <nav aria-label={group.title}>
                  {group.links.map(([label, href]) => <a key={`${group.title}-${href}-${label}`} href={href}>{label}</a>)}
                </nav>
              </section>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>Einfach Hausen organisiert digital. Ausgeführt wird durch eigenständige, geprüfte Partnerbetriebe. Kein Auftrag ohne deine Entscheidung.</p>
          <a href="/kontakt">Kontakt</a>
        </div>
      </footer>
    </div>
  );
}
