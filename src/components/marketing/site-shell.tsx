import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import localFont from 'next/font/local';
import { ScrollShadow, SmoothScroll } from './motion';
import styles from './marketing.module.css';
// Static imports: content-hashed URLs, immune to optimizer cache staleness.
import logoMark from './assets/logo-mark.png';
import logoFull from './assets/logo-full.png';

// Self-hosted Inter Variable: the public website shares the crisp, neutral
// grotesque look of the app surfaces (DESIGN.md: "System-/Inter-nahe Sans").
// Scoped to the marketing shell so the accepted app screens stay untouched.
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
  ['Für Betriebe', '/partner'],
  ['Preise', '/preise'],
] as const;

const mobileMore = [
  ['Für Eigenheimbesitzer', '/eigenheimbesitzer'],
  ['Über uns', '/ueber-uns'],
  ['Hilfe', '/hilfe'],
  ['Kontakt', '/kontakt'],
  ['Sicherheit', '/sicherheit'],
] as const;

const footerGroups = [
  {
    title: 'Für Eigenheimbesitzer',
    links: [
      ["So funktioniert's", '/so-funktionierts'],
      ['Leistungen', '/leistungen'],
      ['Digitale Hausakte', '/hausakte'],
      ['Preise', '/preise'],
      ['Hilfe', '/hilfe'],
    ],
  },
  {
    title: 'Für Betriebe',
    links: [
      ['Partner werden', '/partner'],
      ['Partner-Modelle', '/preise'],
      ['Qualitätsmodell', '/partner'],
      ['Partner-Login', '/login'],
    ],
  },
  {
    title: 'Einfach Hausen',
    links: [
      ['Für Eigenheimbesitzer', '/eigenheimbesitzer'],
      ['Über uns', '/ueber-uns'],
      ['Kontakt', '/kontakt'],
      ['Sicherheit', '/sicherheit'],
      ['Hilfe & FAQ', '/hilfe'],
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      ['Impressum', '/impressum'],
      ['Datenschutz', '/datenschutz'],
      ['AGB', '/agb'],
      ['Barrierefreiheit', '/barrierefreiheit'],
    ],
  },
] as const;

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.site} ${interVariable.variable}`}>
      <SmoothScroll />
      <a className={styles.skipLink} href="#main-content">Zum Inhalt springen</a>
      <ScrollShadow>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Native navigation is intentional here to keep the public marketing shell hydration-free. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className={styles.logoLink} href="/" aria-label="einfachhausen Startseite">
            <Image src={logoMark} alt="" width={36} height={27} priority className={styles.logoImg} />
            <span className={styles.logoWord}><b>einfach</b><span>hausen</span></span>
          </a>
          <nav className={styles.desktopNav} aria-label="Hauptnavigation">
            {primary.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
          <div className={styles.headerActions}>
            <a className={styles.loginLink} href="/login">Einloggen</a>
            <a className={styles.primaryButton} href="/register?role=homeowner">Kostenlos starten <ArrowRight size={16} /></a>
          </div>
          <details className={styles.mobileMenu}>
            <summary aria-label="Menü öffnen"><Menu className={styles.menuIcon} size={22} /><X className={styles.closeIcon} size={22} /></summary>
            <nav aria-label="Mobile Navigation">
              {[...primary, ...mobileMore].map(([label, href]) => <a key={href} href={href}>{label}</a>)}
              <div className={styles.mobileMenuActions}>
                <a className={styles.secondaryButton} href="/login">Einloggen</a>
                <a className={styles.primaryButton} href="/register?role=homeowner">Kostenlos starten</a>
              </div>
            </nav>
          </details>
        </div>
      </header>
      </ScrollShadow>
      <main id="main-content">{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" aria-label="einfachhausen Startseite"><Image src={logoFull} alt="einfachhausen" width={158} height={110} className={styles.logoImg} /></a>
            <p>Eine Anlaufstelle für alles rund ums Eigenheim: Anliegen einordnen, passende Menschen finden, Aufträge organisieren und Hauswissen behalten.</p>
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
        <div className={styles.trustBadges} aria-label="Vertrauensmerkmale">
          <span className={styles.trustBadge}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg> Geprüfte Vertragspartner</span>
          <span className={styles.trustBadge}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg> DSGVO: Hosting in der EU</span>
          <span className={styles.trustBadge}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 2v2"/><path d="M21 2v2"/><path d="M3 2v2"/><path d="M8 2v2"/><path d="M17 6h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg> Kein Lead-Handel</span>
          <span className={styles.trustBadge}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Kein Auftrag ohne deine Entscheidung</span>
        </div>
        <div className={styles.footerBottom}>
          <p>Einfach Hausen organisiert digital. Ausgeführt wird durch eigenständige, geprüfte Partnerbetriebe.</p>
          <a href="/kontakt">Kontakt</a>
        </div>
      </footer>
    </div>
  );
}
