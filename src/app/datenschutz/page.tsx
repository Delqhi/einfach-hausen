import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { PageHero, Section, LegalNotice, LinkButton } from '@/components/marketing/ui';

export const metadata: Metadata = { 
  title: 'Datenschutzerklärung', 
  description: 'Datenschutzerklärung von Einfach Hausen: Welche Daten verarbeitet werden, wie sie geschützt sind und deine Rechte.', 
  alternates: { canonical: canonical('/datenschutz') } 
};

const SECTIONS = [
  {
    title: '1. Verantwortliche Stelle',
    content: 'Verantwortlich für die Datenverarbeitung auf dieser Plattform ist der Betreiber von Einfach Hausen. Anfragen zum Datenschutz richtest du direkt über das Kundenportal oder an datenschutz@einfachhausen.de.'
  },
  {
    title: '2. Zweck und Umfang der Datenverarbeitung',
    content: 'Wir verarbeiten personenbezogene Daten (z. B. Name, E-Mail-Adresse, Postleitzahl, Objektdaten, Anfragetexte und Schadensfotos) ausschließlich zur Bereitstellung der Plattformfunktionen, der digitalen Hausakte und zur Vermittlung regionaler Fachbetriebe (Art. 6 Abs. 1 lit. b DSGVO).'
  },
  {
    title: '3. Infrastruktur und Serverstandort',
    content: 'Die gesamte Plattform-Infrastruktur wird auf abgesicherten Servern innerhalb der Europäischen Union betrieben. Personenbezogene Daten verlassen den EU-Rechtsraum nicht ohne ausdrückliche Rechtsgrundlage.'
  },
  {
    title: '4. KI-Hausmeister und Assistenzfunktionen',
    content: 'Der integrierte Assistent unterstützt bei der präzisen Formulierung von Anfragen und der Gewerke-Zuordnung. Bitte übermittle in Freitextfeldern keine hochsensiblen Daten. Daten werden nicht für Drittanbieter-Trainingszwecke zweckentfremdet.'
  },
  {
    title: '5. Rechte betroffener Personen',
    content: 'Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Datenübertragbarkeit deiner gespeicherten Hausdaten (DSGVO Art. 15–21). Die Hausakte kann jederzeit vollständig exportiert werden.'
  },
  {
    title: '6. Speicherdauer und Löschung',
    content: 'Daten werden gelöscht, sobald sie für den Erhebungszweck nicht mehr erforderlich sind oder du dein Konto löschst – vorbehaltlich gesetzlicher Aufbewahrungspflichten (z. B. für Rechnungsbelege).'
  }
];

export default function Page() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Datenschutz"
        title="Deine Hausdaten gehören dir. Punkt."
        text="Wir behandeln Angaben zu deinem Zuhause, Rechnungen und Dokumenten mit höchster Vertraulichkeit. Keine Weitergabe ohne deine bewusste Freigabe."
      />

      <Section eyebrow="Transparenz" title="Datenschutzhinweise nach DSGVO.">
        <div style={{ display: 'grid', gap: '28px', maxWidth: '800px', margin: '0 auto' }}>
          {SECTIONS.map((sec) => (
            <div key={sec.title} style={{ padding: '24px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e4e2dc' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#10222a', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
                {sec.title}
              </h3>
              <p style={{ fontSize: '15px', color: '#4b5b60', lineHeight: 1.65, margin: 0 }}>
                {sec.content}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="soft" eyebrow="Rechtliche Navigation" title="Weitere Angaben">
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <LinkButton href="/impressum">Impressum</LinkButton>
          <LinkButton href="/sicherheit" secondary>Sicherheitsstandards</LinkButton>
          <LinkButton href="/agb" secondary>AGB</LinkButton>
        </div>
      </Section>
    </MarketingShell>
  );
}
