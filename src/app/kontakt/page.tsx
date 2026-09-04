import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { Building2, CircleAlert, HelpCircle, LogIn, MessageCircle, ShieldCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, InfoPanel, LinkButton, PageHero, Section, Statement, TextLink, mkt as styles } from '@/components/marketing/ui';
import { MiniContact } from '@/components/marketing/app-frames';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Der richtige Weg für dein Anliegen: Hausanliegen starten, bestehenden Vorgang öffnen, Partnerfragen, Datenschutz.',
  alternates: { canonical: canonical('/kontakt') },
};

const ROUTES = [
  { icon: MessageCircle, title: 'Neues Anliegen starten', text: 'Beschreibe kurz, was ansteht. Wir finden die passenden Partner vor Ort.', href: '/register?role=homeowner', label: 'Anliegen starten' },
  { icon: LogIn, title: 'Bestehender Vorgang', text: 'Ansprechpartner, Angebote, Termine und Dokumente im Hauskonto einsehen.', href: '/login', label: 'Zum Login' },
  { icon: HelpCircle, title: 'Fragen & Antworten', text: 'Kosten, Hausakte und Sicherheit detailliert im Hilfebereich nachlesen.', href: '/hilfe', label: 'Hilfe & FAQ öffnen' },
  { icon: Building2, title: 'Für Handwerksbetriebe', text: 'Informationen für Partnerbetriebe, Konditionen und Partner-Registrierung.', href: '/partner', label: 'Partnerbereich' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Kontakt & Support"
        title="Sag uns, worum es geht. Wir leiten dich direkt an die richtige Stelle."
        text="Hausanliegen, laufende Reparaturen und Partneranfragen bleiben dort gebündelt, wo der Kontext liegt. Kein Anliegen verliert den Faden."
        aside={<MiniContact />}
      />

      <Section tone="surface" eyebrow="Wegweiser" title="Vier direkte Wege zu deinem Anliegen.">
        <div className={styles.cardGrid} data-cols="4">
          {ROUTES.map(({ icon: Icon, title, text, href, label }) => (
            <article key={title} className={styles.card}>
              <span className={styles.cardIcon}><Icon size={20} /></span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
              <span className={styles.cardFoot}><TextLink href={href}>{label}</TextLink></span>
            </article>
          ))}
        </div>
      </Section>

      <Statement kicker="Unser Grundsatz">Kein Anliegen verliert seinen Kontext. <mark>Kein Kontakt läuft ins Leere.</mark></Statement>

      <Section eyebrow="Datenschutz & Sicherheit" title="Offizieller Kontakt für rechtliche und vertrauliche Anliegen.">
        <InfoPanel label="Betreiberkontakt">
          <p>Für Datenschutzanfragen, rechtliche Mitteilungen oder Sicherheitsmeldungen stehen verifizierte Kanäle im Impressum und in der Datenschutzerklärung zur Verfügung. Plattformanfragen werden strukturiert über dein verifiziertes Nutzerkonto abgewickelt.</p>
        </InfoPanel>
        <div className={styles.linkRow}>
          <LinkButton href="/datenschutz" secondary>Datenschutzerklärung</LinkButton>
          <LinkButton href="/sicherheit" secondary>Sicherheitsprinzipien</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
        </div>
      </Section>

      <Section eyebrow="Notfall-Hinweis" title="Einfach Hausen ersetzt keinen behördlichen Notruf.">
        <div className={styles.cardGrid} data-cols="2">
          <div className={styles.panelWarn}>
            <strong className={styles.panelTitleWarn}><CircleAlert size={20} /> Akute Gefahr für Leib &amp; Leben</strong>
            <p className={styles.panelText}>Bei Feuer, Gasgeruch, Einbruch oder akuter Einsturzgefahr wähle immer umgehend die 112 bzw. 110.</p>
          </div>
          <div className={styles.panel}>
            <strong className={styles.panelTitleAccent}><ShieldCheck size={20} /> Dringende Hausschäden</strong>
            <p className={styles.panelText}>Bei Rohrbruch oder Heizungsausfall im Winter steht dir in deinem Hauskonto der direkte Notfall-Modus zur Verfügung.</p>
          </div>
        </div>
      </Section>

      <CtaBand title="Brauchst du Hilfe bei deinem Eigenheim?" text="Kostenlos anmelden und direkt mit dem Hausmeister-Assistenten starten." />
    </MarketingShell>
  );
}
