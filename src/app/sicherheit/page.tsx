import type { Metadata } from 'next';
import { BadgeCheck, Eye, FileCheck2, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, FeatureGrid, InfoPanel, LinkButton, PageHero, Section } from '@/components/marketing/ui';
import { HeroShield } from '@/components/marketing/hero-visuals';
import styles from '@/components/marketing/marketing.module.css';

export const metadata: Metadata = {
  title: 'Sicherheit',
  description: 'Sicherheits-, Zugriffs- und Vertrauensprinzipien von Einfach Hausen verständlich erklärt.',
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Sicherheit"
        title="Kontrollierte Zugriffe statt Vertrauensversprechen ohne Beleg."
        text="Einfach Hausen trennt private Daten, bewusste Freigaben und technische Sicherheitsgrenzen. Diese Seite beschreibt überprüfbare Produktprinzipien und vorhandene Schutzmechanismen – keine externe Zertifizierung, kein Audit-Siegel und keine Garantie."
        aside={<HeroShield />}
        actions={<><LinkButton href="/register?role=homeowner">Kostenlos starten</LinkButton><LinkButton href="/datenschutz" secondary>Datenschutz</LinkButton></>}
      />

      <Section eyebrow="Entscheidungshoheit" title="Kein Auftrag und keine Freigabe im Hintergrund.">
        <FeatureGrid items={[
          { icon: <UserCheck size={20} />, title: 'Keine automatische Beauftragung', text: 'Eine Frage oder reine Kontaktanfrage wird nicht stillschweigend zu einem kostenpflichtigen Auftrag.' },
          { icon: <Eye size={20} />, title: 'Zweckgebundene Freigaben', text: 'Haus- und Kontaktdaten werden nicht allein deshalb pauschal offengelegt, weil ein Unternehmen Partner der Plattform ist.' },
          { icon: <LockKeyhole size={20} />, title: 'Private Bereiche bleiben getrennt', text: 'Private Nachrichten, Zahlungen und nicht freigegebene Dokumente gehören nicht automatisch zu einer Hausübergabe oder Partnerfreigabe.' },
        ]} />
      </Section>

      <Section eyebrow="Technische Schutzmechanismen" title="Was die aktuelle Plattform technisch absichert" tone="soft">
        <FeatureGrid items={[
          { icon: <LockKeyhole size={20} />, title: 'Geschützte Sitzungen', text: 'Anmeldung und Sitzungen verwenden serverseitige Session-Kontrollen; Produktions-Cookies sind für geschützte Übertragung und serverseitigen Zugriff ausgelegt.' },
          { icon: <FileCheck2 size={20} />, title: 'Private Dateien', text: 'Private Dokument- und Medienrouten prüfen Pfadgrenzen und Berechtigungen, bevor Inhalte ausgeliefert werden.' },
          { icon: <ShieldCheck size={20} />, title: 'Signierte Integrationen', text: 'Webhook-Eingänge für angebundene Kommunikations- und Zahlungsflüsse sind so ausgelegt, dass Signaturen vor einer Zustandsänderung geprüft werden.' },
        ]} />
        <InfoPanel label="Kein Zertifizierungsclaim">
          <p>
            Aus diesen technischen Kontrollen folgt keine Behauptung über ISO-, TÜV-, BSI- oder sonstige externe Zertifizierungen. Eine solche Aussage oder ein Siegel wird nur mit dokumentarischem Nachweis, gültigem Umfang und freigegebener Formulierung veröffentlicht.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Partnervertrauen" title="Prüfkriterien sind ein Produktstandard, kein pauschales Zertifikat." tone="green">
        <FeatureGrid items={[
          { icon: <BadgeCheck size={20} />, title: 'Unternehmen & Qualifikation', text: 'Der definierte Prüfstandard umfasst Unternehmen, erforderliche Qualifikationen beziehungsweise Zulassungen und den vertraglichen Partnerstatus.' },
          { icon: <ShieldCheck size={20} />, title: 'Versicherung & Qualität', text: 'Betriebshaftpflicht, Referenzen beziehungsweise Bewertungen und Qualitätsstatus gehören zum vorgesehenen Prüfmodell.' },
          { icon: <UserCheck size={20} />, title: 'Region, Kapazität & Kommunikation', text: 'Einsatzgebiet, verfügbare Kapazität und Kommunikationsqualität sind Teil des vorgesehenen Partner- und Matchingmodells.' },
        ]} />
        <InfoPanel label="Wichtig für die öffentliche Aussage">
          <p>
            Ob ein konkreter Betrieb aktiv freigeschaltet ist, muss aus seinem realen Verifizierungs- und Vertragsstatus hervorgehen. Die Beschreibung des Prüfmodells allein beweist keinen individuellen Prüfabschluss.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Garantie & Qualitätssiegel" title="Nicht versprechen, was noch nicht autorisiert ist.">
        <p>
          Aktuell wird hier keine monetäre Garantie, keine feste Entschädigung, keine garantierte Reaktionszeit und kein externes Qualitätssiegel versprochen. Solche Claims brauchen vorher dokumentierte Bedingungen, einen realen operativen Prozess und die erforderliche geschäftliche beziehungsweise rechtliche Freigabe.
        </p>
      </Section>

      <Section eyebrow="Transparenz" title="Datenschutz und Kontakt sind separat dokumentiert." tone="soft">
        <div className={styles.heroActions}>
          <LinkButton href="/datenschutz">Datenschutz</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt</LinkButton>
          <LinkButton href="/impressum" secondary>Impressum</LinkButton>
        </div>
      </Section>

      <CtaBand title="Kontrolle behalten – von der ersten Frage bis zum erledigten Auftrag." text="Starte kostenlos und entscheide bei jedem Schritt selbst, was mit deinen Daten und deinem Haus passiert." />
    </MarketingShell>
  );
}
