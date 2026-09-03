import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { ArrowRight, Building2, CircleAlert, HelpCircle, LogIn, MessageCircle, ShieldCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { Reveal } from '@/components/marketing/motion';
import { CtaBand, FeatureGrid, InfoPanel, LegalNotice, LinkButton, PageHero, Section, Statement, mkt as styles } from '@/components/marketing/ui';
import { MiniContact } from '@/components/marketing/app-frames';

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Der richtige Weg für dein Anliegen: Hausanliegen starten, bestehenden Vorgang öffnen, Partnerfragen, Datenschutz.', alternates: { canonical: canonical('/kontakt') },
};

const ROUTES = [
  { icon: MessageCircle, title: 'Ich habe ein Hausanliegen', text: 'Beschreib in einem Satz, was ansteht. Wir ordnen ein und melden uns mit einem Vorschlag. Kostenlos und unverbindlich.', href: '/register?role=homeowner', label: 'Anliegen starten' },
  { icon: LogIn, title: 'Ich habe schon einen Vorgang', text: 'Dein Ansprechpartner, Termine, Dokumente und Nachrichten liegen im Vorgang. Dort geht es am schnellsten weiter.', href: '/login', label: 'Anmelden' },
  { icon: HelpCircle, title: 'Ich habe eine allgemeine Frage', text: 'Ablauf, Kosten, Hausakte, Partner: die Hilfe beantwortet das Wichtigste, ohne dass ein Auftrag entsteht.', href: '/hilfe', label: 'Zur Hilfe' },
  { icon: Building2, title: 'Ich bin ein Betrieb', text: 'Alles zu Partnernetz, Arbeitsweise und Einstieg steht im Partnerbereich. Aktive Partner nutzen den Partner-Login.', href: '/partner', label: 'Partnerbereich' },
] as const;

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Kontakt"
        title="Sag uns, worum es geht. Dann landest du direkt richtig."
        text="Hausanliegen, laufende Vorgänge und Partnerfragen bleiben dort, wo ihr Kontext schon liegt. So verliert kein Anliegen den Faden und kein Kontakt läuft ins Leere."
        aside={<MiniContact />}
      />

      <Section tone="surface" eyebrow="Wegweiser" title="Vier Wege. Einer passt.">
        <div className={styles.cardGrid} data-cols="2">
          {ROUTES.map(({ icon: Icon, title, text, href, label }, i) => (
            <Reveal key={title} delay={i * 0.06} className={styles.routeCard}>
              <span className={styles.cardIcon}><Icon size={20} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href={href}>{label} <ArrowRight size={15} aria-hidden="true" /></a>
            </Reveal>
          ))}
        </div>
      </Section>

      <Statement kicker="Unser Grundsatz">Kein Anliegen verliert seinen Kontext. <mark>Kein Kontakt läuft ins Leere.</mark></Statement>

      <Section eyebrow="Datenschutz & Sicherheit" title="Sensible Anliegen brauchen einen verifizierten Betreiberkontakt.">
        <InfoPanel label="Rechtskontakt">
          <p>Für Datenschutzanfragen, rechtliche Mitteilungen, Beschwerden oder Sicherheitsmeldungen geben wir keine private, ungeprüfte oder provisorische Adresse als offiziellen Kanal aus. Der freigegebene Betreiberkontakt wird nach Verifizierung zugleich im Impressum und in der Datenschutzerklärung veröffentlicht.</p>
        </InfoPanel>
        <div className={`${styles.heroActions} ${styles.mt}`}>
          <LinkButton href="/datenschutz" secondary>Datenschutz</LinkButton>
          <LinkButton href="/sicherheit" secondary>Sicherheit</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
        </div>
      </Section>

      <Section tone="soft" eyebrow="Öffentliche Kontaktdaten" title="Veröffentlichung erst nach Betreiberfreigabe." tight>
        <LegalNotice title="Offizielle Anschrift und elektronische Kontaktangaben folgen">
          <p>Eine verifizierte, veröffentlichungsfähige Geschäftsanschrift und eine offizielle öffentliche E-Mail-Adresse des Plattformbetreibers werden hier ergänzt, sobald sie dokumentiert freigegeben sind. Eine Telefonnummer nennen wir nur, wenn sie ausdrücklich als offizieller Kanal freigegeben ist.</p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Akute Gefahr" title="Einfach Hausen ersetzt keinen Notruf.">
        <FeatureGrid cols={2} items={[
          { icon: <CircleAlert size={20} />, title: 'Unmittelbare Gefahr', text: 'Bei Gefahr für Menschen, Feuer, Gas, Einbruch oder vergleichbaren Notfällen wähle immer die zuständigen öffentlichen Notruf- und Gefahrenabwehrstellen.' },
          { icon: <ShieldCheck size={20} />, title: 'Dringende Hausprobleme', text: 'Für dringende, aber nicht lebensbedrohliche Probleme wie Wasserschaden oder Heizungsausfall nutze den Notfallbereich in deinem Hauskonto.' },
        ]} />
      </Section>

      <CtaBand title="Beschreib einfach, was bei deinem Haus ansteht." text="Dein Hauskonto ist kostenlos, und ein Anliegen löst niemals automatisch einen Auftrag aus." />
    </MarketingShell>
  );
}
