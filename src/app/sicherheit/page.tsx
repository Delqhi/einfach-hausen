import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { BadgeCheck, Eye, FileCheck2, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { MotionPresentation } from '@/components/marketing/motion-presentation';
import { AppFrame, ContactScreen } from '@/components/marketing/app-frames';
import { CtaBand, FeatureGrid, InfoPanel, LinkButton, Numbered, PageHero, Section, Statement, mkt as styles } from '@/components/marketing/ui';
import { PRINCIPLES } from '@/components/marketing/content';

export const metadata: Metadata = {
  title: 'Sicherheit & Daten',
  description: 'Wie Einfach Hausen deine Daten, Freigaben und Entscheidungen schützt. Überprüfbare Prinzipien statt Siegel ohne Beleg.', alternates: { canonical: canonical('/sicherheit') },
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Sicherheit & Daten"
        title="Nichts passiert mit deinem Haus oder deinen Daten ohne dich."
        text="Einfach Hausen trennt private Daten, bewusste Freigaben und technische Sicherheitsgrenzen. Hier stehen überprüfbare Produktprinzipien und vorhandene Schutzmechanismen. Keine externe Zertifizierung, kein Audit-Siegel, keine Garantie, die wir nicht belegen können."
        actions={<><LinkButton href="/register?role=homeowner">Hauskonto kostenlos anlegen</LinkButton><LinkButton href="/datenschutz" secondary>Datenschutzerklärung</LinkButton></>}
        aside={<AppFrame label="Ansprechpartner-Ansicht: Du siehst vorher, wer kommt"><ContactScreen /></AppFrame>}
      />
      <MotionPresentation presentationId="sicherheit" title="Freigaben bleiben deine Entscheidung." />

      <Section tone="surface" eyebrow="Vier Regeln" title="Woran du uns messen kannst.">
        <Numbered items={PRINCIPLES} />
      </Section>

      <Statement kicker="Entscheidungshoheit">Kein Auftrag, keine Freigabe <mark>im Hintergrund.</mark></Statement>

      <Section eyebrow="Deine Entscheidung" title="Was nie ohne dich passiert.">
        <FeatureGrid items={[
          { icon: <UserCheck size={20} />, title: 'Keine automatische Beauftragung', text: 'Eine Frage oder Kontaktanfrage wird nicht stillschweigend zu einem kostenpflichtigen Auftrag. Du bestätigst jeden Termin selbst.' },
          { icon: <Eye size={20} />, title: 'Zweckgebundene Freigaben', text: 'Haus- und Kontaktdaten gehen nur an den Partner, den du für einen konkreten Vorgang bestätigst. Nicht pauschal an alle.' },
          { icon: <LockKeyhole size={20} />, title: 'Private Bereiche bleiben getrennt', text: 'Nachrichten, Zahlungen und nicht freigegebene Dokumente gehören nicht automatisch zu einer Hausübergabe oder Partnerfreigabe.' },
        ]} />
      </Section>

      <Section tone="soft" eyebrow="Technische Schutzmechanismen" title="Was die Plattform technisch absichert.">
        <FeatureGrid items={[
          { icon: <LockKeyhole size={20} />, title: 'Geschützte Sitzungen', text: 'Anmeldung und Sitzungen nutzen serverseitige Session-Kontrollen. Produktions-Cookies sind für geschützte Übertragung und serverseitigen Zugriff ausgelegt.' },
          { icon: <FileCheck2 size={20} />, title: 'Private Dateien', text: 'Dokument- und Medienrouten prüfen Pfadgrenzen und Berechtigungen, bevor Inhalte ausgeliefert werden.' },
          { icon: <ShieldCheck size={20} />, title: 'Signierte Integrationen', text: 'Eingehende Webhooks für Kommunikations- und Zahlungsflüsse werden vor jeder Zustandsänderung auf ihre Signatur geprüft.' },
        ]} />
        <div className={styles.mt}>
          <InfoPanel label="Kein Zertifizierungsclaim">
            <p>Aus diesen Kontrollen folgt keine Behauptung über ISO-, TÜV-, BSI- oder andere externe Zertifizierungen. Ein Siegel veröffentlichen wir nur mit dokumentarischem Nachweis, gültigem Umfang und freigegebener Formulierung.</p>
          </InfoPanel>
        </div>
      </Section>

      <Section eyebrow="Partnervertrauen" title="Wie wir Partnerbetriebe prüfen." text="Der Prüfstandard ist ein Produktstandard, kein pauschales Zertifikat. Ob ein konkreter Betrieb aktiv ist, ergibt sich aus seinem realen Verifizierungs- und Vertragsstatus.">
        <FeatureGrid items={[
          { icon: <BadgeCheck size={20} />, title: 'Unternehmen & Qualifikation', text: 'Unternehmensdaten, erforderliche Qualifikationen beziehungsweise Zulassungen und der vertragliche Partnerstatus.' },
          { icon: <ShieldCheck size={20} />, title: 'Versicherung & Qualität', text: 'Betriebshaftpflicht, Referenzen beziehungsweise Bewertungen und der laufende Qualitätsstatus.' },
          { icon: <UserCheck size={20} />, title: 'Region, Kapazität & Kommunikation', text: 'Einsatzgebiet, verfügbare Kapazität und Kommunikationsqualität sind Teil des Partner- und Matchingmodells.' },
        ]} />
      </Section>

      <Section tone="soft" eyebrow="Ehrlich gesagt" title="Was wir nicht versprechen." tight>
        <InfoPanel label="Garantie & Qualitätssiegel">
          <p>Aktuell versprechen wir keine monetäre Garantie, keine feste Entschädigung, keine garantierte Reaktionszeit und kein externes Qualitätssiegel. Solche Zusagen brauchen vorher dokumentierte Bedingungen, einen realen operativen Prozess und die erforderliche rechtliche Freigabe. Was wir zusagen, steht auf dieser Seite.</p>
        </InfoPanel>
        <div className={`${styles.heroActions} ${styles.mt}`}>
          <LinkButton href="/datenschutz" secondary>Datenschutz</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt</LinkButton>
        </div>
      </Section>

      <CtaBand title="Kontrolle behalten, von der ersten Frage bis zum erledigten Auftrag." text="Starte kostenlos und entscheide bei jedem Schritt selbst, was mit deinen Daten und deinem Haus passiert." />
    </MarketingShell>
  );
}
