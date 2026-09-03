import type { Metadata } from 'next';
import { breadcrumbJsonLd, canonical, SITE_URL } from '@/lib/seo';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, Faq, InfoPanel, LinkButton, PageHero, Section, Steps, TextLink } from '@/components/marketing/ui';

export const metadata: Metadata = {
  title: 'Heizung: Wartung, Störung, Sanierung im Überblick',
  description: 'Heizung als Leistung: Wartung, Störung, Optimierung und Tausch — Ablauf, Kostenrahmen und Ansprechpartner. Regional und unverbindlich.',
  alternates: { canonical: canonical('/leistungen/heizung') },
  openGraph: { type: 'website', title: 'Heizung: Wartung, Störung, Sanierung im Überblick', description: 'Ablauf, Kostenrahmen und Ansprechpartner für alles rund um die Heizung.', url: '/leistungen/heizung' },
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Heizung, Klima & Energie',
  serviceType: 'Heizung, Klima & Energie',
  url: canonical('/leistungen/heizung'),
  provider: {
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${SITE_URL}/leistungen#anbieter`,
    name: 'Einfach Hausen',
    url: canonical('/leistungen'),
    areaServed: 'Regionale Pilotgebiete in Deutschland — konkrete Verfügbarkeit hängt vom aktiven Partnernetz vor Ort ab',
  },
};

export default function Page() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: 'Start', path: '/' }, { name: 'Leistungen', path: '/leistungen' }, { name: 'Heizung', path: '/leistungen/heizung' }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <PageHero
        eyebrow="Leistungen · Heizung"
        title="Heizung: Du beschreibst, wir ordnen zu."
        text="Wartung, Störung, ungleiche Wärme, Anlagentausch: Ein Eingang für alles rund um die Heizung. Geprüfte regionale Partner, Kostenrahmen vorab, ein fester Ansprechpartner danach."
        actions={<><LinkButton href="/#anliegen">Heizungsanliegen starten</LinkButton><LinkButton href="/leistungen" secondary>Alle Leistungen</LinkButton></>}
      />
      <Section tone="surface" eyebrow="Womit wir helfen" title="Vier Anliegen, ein Ablauf.">
        <Steps items={[
          { title: 'Wartung und Prüfung', text: 'Regelmässiger Termin vor der Heizperiode, mit Protokoll für die Hausakte. Details stehen im Ratgeber zur Heizungswartung mit Kosten und Entscheidung.' },
          { title: 'Störung und Ausfall', text: 'Geräusche, Fehlermeldung, kalte Heizkörper: beschreiben, priorisieren lassen, Partner mit Kostenrahmen erhalten.' },
          { title: 'Optimierung im Bestand', text: 'Ungleiche Wärme, hohe Verträuche, alte Einstellungen: oft hilft erst die Einordnung, ob hydraulischer Abgleich nötig ist.' },
          { title: 'Austausch und Planung', text: 'Alte Anlage, gesetzliche Fragen, Förderanteile: einordnen lassen, was das Heizungsgesetz für dein Haus bedeutet, dann Optionen vergleichen.' },
        ]} />
      </Section>
      <Section eyebrow="Vertiefen" title="Ratgeber aus dem Cluster.">
        <ul>
          <li><TextLink href="/blog/heizung-wartung-kosten">Ratgeber: Heizungswartung — Ablauf, Kostenrahmen und Entscheidung</TextLink></li>
          <li><TextLink href="/blog/schimmel-vorgehen">Ratgeber: Schimmel ruhig angehen — Heizen und Lüften als Ursache</TextLink></li>
          <li><TextLink href="/blog/bad-sanierung-ablauf">Ratgeber: Bad-Sanierung — Ablauf, Kostenrahmen und Entscheidungen</TextLink></li>
        </ul>
      </Section>
      <Section tone="soft" eyebrow="Begriffe" title="Lexikon zum Nachschlagen.">
        <ul>
          <li><TextLink href="/lexikon/hydraulischer-abgleich">Lexikon: hydraulischer Abgleich — Definition, Kosten, Ablauf</TextLink></li>
          <li><TextLink href="/lexikon/heizungsgesetz">Lexikon: Heizungsgesetz (GEG) — was es regelt</TextLink></li>
          <li><TextLink href="/lexikon/lüftungsanlage">Lexikon: Lüftungsanlage — Arten, Kostenrahmen, Ablauf</TextLink></li>
          <li><TextLink href="/lexikon/schimmelklasse">Lexikon: Schimmelklassen — Einstufung und Vorgehen</TextLink></li>
        </ul>
      </Section>
      <Section eyebrow="Kostenrahmen" title="Ehrlich vorab, verbindlich vor Ort.">
        <BulletList items={[
          'Die Einordnung — Beschreiben, Zuordnen, Vorschlag mit Kostenrahmen — kostet nichts.',
          'Wartungstermine bewegen sich je nach Anlage meist im niedrigen dreistelligen Euro-Bereich; Ersatzteile und Zusatzarbeiten kommen hinzu.',
          'Optimierung und Tausch hängen stark von Anlage und Gebäude ab — der Rahmen kommt vom Partnerbetrieb nach Einordnung.',
        ]} />
        <InfoPanel label="Einordnung">Kostenrahmen sind Orientierung aus Anfrageverläufen, kein Angebot. Verbindlich ist der Rahmen des Partnerbetriebs, bevor du entscheidest.</InfoPanel>
      </Section>
      <Section eyebrow="Häufige Fragen" title="Zur Heizung als Leistung." center>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Faq items={[
            { q: 'Macht Einfach Hausen die Arbeiten selbst?', a: 'Nein. Wir organisieren: Einordnung, passender Partnerbetrieb aus der Region, Kostenrahmen vorab. Ausgeführt wird durch den Betrieb, mit dem du direkt abrechnest.' },
            { q: 'Was passiert bei Heizungsausfall im Winter?', a: 'Kennzeichne die Dringlichkeit beim Beschreiben. Wir priorisieren solche Fälle, können aber keinen 24/7-Notdienst garantieren. Bei Gefahr wähle immer den Notruf.' },
            { q: 'Brauche ich Fachbegriffe für die Anfrage?', a: 'Nein. Beschreib Geräusche, kalte Räume oder Fehlermeldungen in eigenen Worten, gern mit Foto vom Typenschild. Die Einordnung ist unser Job.' },
            { q: 'Wo steht, was schon gemacht wurde?', a: 'Jeder Vorgang landet mit Protokoll und Ansprechpartner in deiner Hausakte. So bleibt Wartung, Abgleich und Tausch an einem Ort.' },
          ]} />
        </div>
      </Section>
      <CtaBand title="Beschreib, was die Heizung macht." text="Kostenlos und unverbindlich. Partner, Kostenrahmen und Ansprechpartner siehst du, bevor du entscheidest." />
    </MarketingShell>
  );
}
