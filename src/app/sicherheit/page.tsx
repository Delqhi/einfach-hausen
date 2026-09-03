import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { FileCheck2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { AppFrame, ContactScreen } from '@/components/marketing/app-frames';
import { InfoPanel, LinkButton, Numbered, Section, mkt as styles } from '@/components/marketing/ui';
import { Clauses, Gate, IndexList, QuietClose, TermsHero } from '@/components/marketing/archetypes';
import { PRINCIPLES } from '@/components/marketing/content';

// UI-Convergence Welle 2: Diese Seite bestand aus vier identischen
// Feature-Kartenrastern hintereinander. Inhaltlich ist sie stark, optisch
// war sie beliebig. Jetzt liest sie sich wie das Dokument, das sie ist:
// nüchterner Kopf, Regeln als Paragraphen, Zusagen als Prüfliste,
// technische Mechanismen als Index, Partnerprüfung als numerierte Liste.

export const metadata: Metadata = {
  title: 'Sicherheit & Daten',
  description: 'Wie Einfach Hausen deine Daten, Freigaben und Entscheidungen schützt. Überprüfbare Prinzipien statt Siegel ohne Beleg.',
  alternates: { canonical: canonical('/sicherheit') },
};

export default function Page() {
  return (
    <MarketingShell>
      <TermsHero
        eyebrow="Sicherheit & Daten"
        title="Nichts passiert mit deinem Haus oder deinen Daten ohne dich."
        lead="Einfach Hausen trennt private Daten, bewusste Freigaben und technische Sicherheitsgrenzen. Hier stehen überprüfbare Produktprinzipien und vorhandene Schutzmechanismen. Keine externe Zertifizierung, kein Audit-Siegel, keine Garantie, die wir nicht belegen können."
        actions={<><LinkButton href="/register?role=homeowner">Hauskonto kostenlos anlegen</LinkButton><LinkButton href="/datenschutz" secondary>Datenschutzerklärung</LinkButton></>}
        figure={<AppFrame label="Ansprechpartner-Ansicht: Du siehst vorher, wer kommt"><ContactScreen /></AppFrame>}
      />

      <Clauses
        id="regeln"
        items={PRINCIPLES.map((principle) => ({
          title: principle.title,
          body: <p>{principle.text}</p>,
        }))}
      />

      <Gate
        id="entscheidung"
        eyebrow="Deine Entscheidung"
        title="Was nie ohne dich passiert."
        text="Kein Auftrag und keine Freigabe im Hintergrund. Diese drei Punkte sind keine Absichtserklärung, sondern die Art, wie das Produkt gebaut ist."
        items={[
          { label: 'Eine Frage oder Kontaktanfrage wird nicht stillschweigend zu einem kostenpflichtigen Auftrag', note: 'Du bestätigst' },
          { label: 'Haus- und Kontaktdaten gehen nur an den Partner, den du für einen konkreten Vorgang bestätigst', note: 'Zweckgebunden' },
          { label: 'Nachrichten, Zahlungen und nicht freigegebene Dokumente gehören nie automatisch zu einer Hausübergabe', note: 'Bleibt privat' },
        ]}
      />

      <IndexList
        eyebrow="Technische Schutzmechanismen"
        title="Was die Plattform technisch absichert."
        note="Konkrete Kontrollen, keine Formulierungen. Was hier nicht steht, behaupten wir auch nicht."
        items={[
          { icon: <LockKeyhole size={18} aria-hidden="true" />, title: 'Geschützte Sitzungen', text: 'Anmeldung und Sitzungen nutzen serverseitige Session-Kontrollen. Produktions-Cookies sind für geschützte Übertragung und serverseitigen Zugriff ausgelegt.' },
          { icon: <FileCheck2 size={18} aria-hidden="true" />, title: 'Private Dateien', text: 'Dokument- und Medienrouten prüfen Pfadgrenzen und Berechtigungen, bevor Inhalte ausgeliefert werden.' },
          { icon: <ShieldCheck size={18} aria-hidden="true" />, title: 'Signierte Integrationen', text: 'Eingehende Webhooks für Kommunikations- und Zahlungsflüsse werden vor jeder Zustandsänderung auf ihre Signatur geprüft.' },
        ]}
      />

      <Section eyebrow="Partnervertrauen" title="Wie wir Partnerbetriebe prüfen." text="Der Prüfstandard ist ein Produktstandard, kein pauschales Zertifikat. Ob ein konkreter Betrieb aktiv ist, ergibt sich aus seinem realen Verifizierungs- und Vertragsstatus.">
        <Numbered items={[
          { title: 'Unternehmen und Qualifikation', text: 'Unternehmensdaten, erforderliche Qualifikationen beziehungsweise Zulassungen und der vertragliche Partnerstatus.' },
          { title: 'Versicherung und Qualität', text: 'Betriebshaftpflicht, Referenzen beziehungsweise Bewertungen und der laufende Qualitätsstatus.' },
          { title: 'Region, Kapazität und Kommunikation', text: 'Einsatzgebiet, verfügbare Kapazität und Kommunikationsqualität sind Teil des Partner- und Matchingmodells.' },
        ]} />
      </Section>

      <Section tone="soft" eyebrow="Ehrlich gesagt" title="Was wir nicht versprechen." text="Zwei Einschränkungen, die auf keiner Vertrauensseite fehlen sollten und trotzdem fast immer fehlen.">
        <InfoPanel label="Kein Zertifizierungsclaim">
          <p>Aus den technischen Kontrollen folgt keine Behauptung über ISO-, TÜV-, BSI- oder andere externe Zertifizierungen. Ein Siegel veröffentlichen wir nur mit dokumentarischem Nachweis, gültigem Umfang und freigegebener Formulierung.</p>
        </InfoPanel>
        <div className={styles.mt}>
          <InfoPanel label="Garantie und Qualitätssiegel">
            <p>Aktuell versprechen wir keine monetäre Garantie, keine feste Entschädigung, keine garantierte Reaktionszeit und kein externes Qualitätssiegel. Solche Zusagen brauchen vorher dokumentierte Bedingungen, einen realen operativen Prozess und die erforderliche rechtliche Freigabe. Was wir zusagen, steht auf dieser Seite.</p>
          </InfoPanel>
        </div>
      </Section>

      <QuietClose
        title="Kontrolle behalten, von der ersten Frage bis zum erledigten Auftrag."
        text="Starte kostenlos und entscheide bei jedem Schritt selbst, was mit deinen Daten und deinem Haus passiert."
        actions={<><LinkButton href="/register?role=homeowner">Hauskonto anlegen</LinkButton><LinkButton href="/datenschutz" secondary>Datenschutz</LinkButton><LinkButton href="/kontakt" secondary>Kontakt</LinkButton></>}
      />
    </MarketingShell>
  );
}
