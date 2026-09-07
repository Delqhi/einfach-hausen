import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { BadgeCheck, Eye, FileCheck2, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, ContactScreen } from '@/components/marketing/app-frames';
import { Numbered } from '@/components/marketing/ui';
import { EHScope, EHSection, EHPageHero, EHFeatureRows, EHCallout, EHClosing, EHButton, EHActions, EHEyebrow, EHHeading, EHText, EHProse } from '@/design-system';
import { PRINCIPLES } from '@/components/marketing/content';

export const metadata: Metadata = {
  title: 'Sicherheit & Daten',
  description: 'Wie Einfach Hausen deine Daten, Freigaben und Entscheidungen schützt. Überprüfbare Prinzipien statt Siegel ohne Beleg.', alternates: { canonical: canonical('/sicherheit') },
};

export default function Page() {
  return (
    <MarketingShell>
      <EHScope>
      <EHPageHero
        eyebrow="Sicherheit & Daten"
        title="Nichts passiert mit deinem Haus oder deinen Daten ohne dich."
        text="Einfach Hausen trennt private Daten, bewusste Freigaben und technische Sicherheitsgrenzen. Hier stehen überprüfbare Produktprinzipien und vorhandene Schutzmechanismen. Keine externe Zertifizierung, kein Audit-Siegel, keine Garantie, die wir nicht belegen können."
        actions={<><EHButton href="/register?role=homeowner" arrow>Hauskonto kostenlos anlegen</EHButton><EHButton href="/datenschutz" variant="secondary">Datenschutzerklärung</EHButton></>}
        media={<AppFrame label="Ansprechpartner-Ansicht: Du siehst vorher, wer kommt"><ContactScreen /></AppFrame>}
      />

      <EHSection compact>
        <EHEyebrow>Vier Regeln</EHEyebrow>
        <EHHeading>Woran du uns messen kannst.</EHHeading>
        <Numbered items={PRINCIPLES} />
      </EHSection>

      <EHSection compact>
          <EHProse>
            <p><strong>Entscheidungshoheit.</strong> Kein Auftrag, keine Freigabe <mark>im Hintergrund.</mark></p>
          </EHProse>
        </EHSection>

      <EHSection compact>
        <EHEyebrow>Deine Entscheidung</EHEyebrow>
        <EHHeading>Was nie ohne dich passiert.</EHHeading>
        <EHFeatureRows items={[
          { icon: <UserCheck size={20} />, title: 'Keine automatische Beauftragung', text: 'Eine Frage oder Kontaktanfrage wird nicht stillschweigend zu einem kostenpflichtigen Auftrag. Du bestätigst jeden Termin selbst.' },
          { icon: <Eye size={20} />, title: 'Zweckgebundene Freigaben', text: 'Haus- und Kontaktdaten gehen nur an den Partner, den du für einen konkreten Vorgang bestätigst. Nicht pauschal an alle.' },
          { icon: <LockKeyhole size={20} />, title: 'Private Bereiche bleiben getrennt', text: 'Nachrichten, Zahlungen und nicht freigegebene Dokumente gehören nicht automatisch zu einer Hausübergabe oder Partnerfreigabe.' },
        ]} />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Technische Schutzmechanismen</EHEyebrow>
        <EHHeading>Was die Plattform technisch absichert.</EHHeading>
        <EHFeatureRows items={[
          { icon: <LockKeyhole size={20} />, title: 'Geschützte Sitzungen', text: 'Anmeldung und Sitzungen nutzen serverseitige Session-Kontrollen. Produktions-Cookies sind für geschützte Übertragung und serverseitigen Zugriff ausgelegt.' },
          { icon: <FileCheck2 size={20} />, title: 'Private Dateien', text: 'Dokument- und Medienrouten prüfen Pfadgrenzen und Berechtigungen, bevor Inhalte ausgeliefert werden.' },
          { icon: <ShieldCheck size={20} />, title: 'Signierte Integrationen', text: 'Eingehende Webhooks für Kommunikations- und Zahlungsflüsse werden vor jeder Zustandsänderung auf ihre Signatur geprüft.' },
        ]} />
        <EHCallout title="Kein Zertifizierungsclaim">
            <p>Aus diesen Kontrollen folgt keine Behauptung über ISO-, TÜV-, BSI- oder andere externe Zertifizierungen. Ein Siegel veröffentlichen wir nur mit dokumentarischem Nachweis, gültigem Umfang und freigegebener Formulierung.</p>
          </EHCallout>
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Partnervertrauen</EHEyebrow>
        <EHHeading>Wie wir Partnerbetriebe prüfen.</EHHeading>
        <EHText size="lead">Der Prüfstandard ist ein Produktstandard, kein pauschales Zertifikat. Ob ein konkreter Betrieb aktiv ist, ergibt sich aus seinem realen Verifizierungs- und Vertragsstatus.</EHText>
        <EHFeatureRows items={[
          { icon: <BadgeCheck size={20} />, title: 'Unternehmen & Qualifikation', text: 'Unternehmensdaten, erforderliche Qualifikationen beziehungsweise Zulassungen und der vertragliche Partnerstatus.' },
          { icon: <ShieldCheck size={20} />, title: 'Versicherung & Qualität', text: 'Betriebshaftpflicht, Referenzen beziehungsweise Bewertungen und der laufende Qualitätsstatus.' },
          { icon: <UserCheck size={20} />, title: 'Region, Kapazität & Kommunikation', text: 'Einsatzgebiet, verfügbare Kapazität und Kommunikationsqualität sind Teil des Partner- und Matchingmodells.' },
        ]} />
      </EHSection>

      <EHSection compact>
        <EHEyebrow>Ehrlich gesagt</EHEyebrow>
        <EHHeading>Was wir nicht versprechen.</EHHeading>
        <EHCallout title="Garantie & Qualitätssiegel">
          <p>Aktuell versprechen wir keine monetäre Garantie, keine feste Entschädigung, keine garantierte Reaktionszeit und kein externes Qualitätssiegel. Solche Zusagen brauchen vorher dokumentierte Bedingungen, einen realen operativen Prozess und die erforderliche rechtliche Freigabe. Was wir zusagen, steht auf dieser Seite.</p>
        </EHCallout>
        <EHActions>
          <EHButton href="/datenschutz" variant="secondary">Datenschutz</EHButton>
          <EHButton href="/impressum" variant="secondary">Impressum</EHButton>
          <EHButton href="/kontakt" variant="secondary">Kontakt</EHButton>
        </EHActions>
      </EHSection>

      <EHClosing title="Kontrolle behalten, von der ersten Frage bis zum erledigten Auftrag." text="Starte kostenlos und entscheide bei jedem Schritt selbst, was mit deinen Daten und deinem Haus passiert." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
    </EHScope>
    </MarketingShell>
  );
}
