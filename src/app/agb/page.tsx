import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, InfoPanel, LegalNotice, LinkButton, PageHero, Section } from '@/components/marketing/ui';

export const metadata: Metadata = {
  title: 'AGB',
  description: 'Vertragsmodell, Verbraucherinformationen und AGB-Veröffentlichungsstatus von Einfach Hausen.',
  alternates: { canonical: canonical('/agb') },
};

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Rechtliches"
        title="Allgemeine Geschäftsbedingungen"
        text="Diese Seite macht das Produkt- und Vertragsmodell nachvollziehbar. Die finalen AGB bilden Betreiber, Rollen sowie reale Zahlungs- und Leistungsabläufe verbindlich ab."
      />

      <Section eyebrow="Stand" title="Rechtlicher Veröffentlichungsstatus.">
        <LegalNotice title="Vertrags- und Verbraucherbedingungen in externer Freigabe">
          <p>
            Vertragspartner, Plattformrolle, Vertragsschluss, Entgelte, Abonnements, Kündigung, Widerruf, Haftung, Gewährleistung, Partnerbedingungen und Streitbeilegung werden vor dem finalen Rollout juristisch auditiert.
          </p>
        </LegalNotice>
      </Section>

      <Section eyebrow="Produktwahrheiten" title="Was im Produkt bereits bewusst getrennt ist" tone="green">
        <BulletList items={[
          'Eine normale Frage erzeugt niemals automatisch einen kostenpflichtigen Auftrag.',
          '„Ansprechpartner finden“ und „Auftrag organisieren“ sind zwei getrennte, bewusste Entscheidungen.',
          'Ausführende Partnerbetriebe sind eigenständige Meister- und Fachbetriebe, keine Angestellten.',
          'Das Plattformmodell sieht 0 % Vermittlungsprovision auf das Auftragsvolumen vor.',
          'Ein bezahlter Partnertarif beeinflusst nicht das fachliche Matching für Kunden.',
        ]} />
        <p style={{ marginTop: '16px', color: '#5f6e75', fontSize: '14px', lineHeight: 1.6 }}>
          Diese Produktregeln bilden das Fundament für die finalen Vertragsbedingungen.
        </p>
      </Section>

      <Section eyebrow="Kundenverhältnis" title="Wesentliche Regelungspunkte für Eigentümer.">
        <BulletList items={[
          'Rolle von Einfach Hausen als vermittelnde und organisierende Software-Plattform.',
          'Klarer Zeitpunkt des Vertragsschlusses bei Anfragen, Angeboten und Terminvereinbarungen.',
          'Kostenloses Basiskonto (FREE) sowie optionale Premium-Pakete ohne versteckte Bindungen.',
          'Fristen für Kündigung, Stornierung und gesetzliche Widerrufsrechte.',
          'Haftungs- und Gewährleistungsabgrenzung zwischen Plattform und ausführendem Partnerbetrieb.',
        ]} />
      </Section>

      <Section eyebrow="Partnerverhältnis" title="Verbindliche Standards für Handwerksbetriebe." tone="soft">
        <BulletList items={[
          'Verifizierungsanforderungen: Gewerbeanmeldung, Betriebshaftpflicht und Qualifikationsnachweise.',
          'Regionale Zuteilung, Kapazitätssteuerung und Reaktionszeiten.',
          'Transparente monatliche Partnertarife ohne Provisionsabzüge.',
          'Klare Regelungen bei Gewährleistung, Angebotserstellung und Rechnungsstellung.',
        ]} />
        <InfoPanel label="Operative Verifizierung">
          <p>
            Jeder Betrieb im Netzwerk durchläuft vor der Freigabe eine Dokumenten- und Qualitätsprüfung.
          </p>
        </InfoPanel>
      </Section>

      <Section eyebrow="Rechtliche Navigation" title="Zugehörige Pflichtangaben und Dokumente.">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <LinkButton href="/impressum">Impressum</LinkButton>
          <LinkButton href="/datenschutz" secondary>Datenschutzerklärung</LinkButton>
          <LinkButton href="/kontakt" secondary>Kontakt &amp; Support</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
