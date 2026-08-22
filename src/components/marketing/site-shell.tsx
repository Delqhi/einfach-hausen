import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import styles from './marketing.module.css';

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
    <div className={styles.site}>
      <a className={styles.skipLink} href="#main-content">Zum Inhalt springen</a>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.logoLink} href="/" aria-label="Einfach Hausen Startseite">
            <Logo />
          </Link>
          <nav className={styles.desktopNav} aria-label="Hauptnavigation">
            {primary.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <div className={styles.headerActions}>
            <Link className={styles.loginLink} href="/login">Einloggen</Link>
            <Link className={styles.primaryButton} href="/register?role=homeowner">Kostenlos starten <ArrowRight size={16} /></Link>
          </div>
          <details className={styles.mobileMenu}>
            <summary aria-label="Menü öffnen"><Menu className={styles.menuIcon} size={22} /><X className={styles.closeIcon} size={22} /></summary>
            <nav aria-label="Mobile Navigation">
              {[...primary, ...mobileMore].map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
              <div className={styles.mobileMenuActions}>
                <Link className={styles.secondaryButton} href="/login">Einloggen</Link>
                <Link className={styles.primaryButton} href="/register?role=homeowner">Kostenlos starten</Link>
              </div>
            </nav>
          </details>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Link href="/" aria-label="Einfach Hausen Startseite"><Logo /></Link>
            <p>Eine Anlaufstelle für alles rund ums Eigenheim: Anliegen einordnen, passende Menschen finden, Aufträge organisieren und Hauswissen behalten.</p>
            <span>© 2026 Einfach Hausen</span>
          </div>
          <div className={styles.footerGrid}>
            {footerGroups.map((group) => (
              <section key={group.title}>
                <h2>{group.title}</h2>
                <nav aria-label={group.title}>
                  {group.links.map(([label, href]) => <Link key={`${group.title}-${href}-${label}`} href={href}>{label}</Link>)}
                </nav>
              </section>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>Einfach Hausen organisiert digital. Ausgeführt wird durch eigenständige, geprüfte Partnerbetriebe.</p>
          <Link href="/kontakt">Kontakt</Link>
        </div>
      </footer>
    </div>
  );
}
