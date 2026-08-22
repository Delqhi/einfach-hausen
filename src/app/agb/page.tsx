import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, LegalNotice, PageHero, Section } from '@/components/marketing/ui';

export const metadata: Metadata = { title: 'AGB', description: 'Vertragsinformationen und AGB-Status von Einfach Hausen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Rechtliches" title="Allgemeine Geschäftsbedingungen" text="Die Produktlogik ist definiert. Rechtsverbindliche Vertragsbedingungen dürfen daraus aber nicht ohne juristische und geschäftliche Verifizierung abgeleitet werden." />
  <Section eyebrow="Produktmodell" title="Diese Grundsätze sind fachlich definiert.">
    <BulletList items={['Eine normale Frage löst nicht automatisch einen Auftrag aus.','Ansprechpartner und Auftrag sind getrennte Entscheidungen.','Ausführende Partnerbetriebe bleiben eigenständige Leistungserbringer.','Das definierte Partner-Modell sieht 0 % Auftragsprovision vor.','Bezahlte Partner-Tarife dürfen keine bessere fachliche Matching-Position kaufen.']} />
  </Section>
  <Section eyebrow="Rechtlicher Stand" title="AGB vor Launch verbindlich ausarbeiten." tone="soft">
    <LegalNotice title="Launch-Blocker: rechtsverbindliche AGB fehlen"><p>Vor Veröffentlichung müssen unter anderem Vertragspartner und Rollen, Leistungsumfang, Zustandekommen von Verträgen, Zahlungs- und Abomodell, Kündigung, Haftung, Gewährleistung, Widerrufs-/Verbraucherinformationen, Partnerbedingungen und Streitbeilegung anhand des tatsächlichen Geschäftsmodells rechtlich geprüft und final freigegeben werden.</p></LegalNotice>
  </Section>
</MarketingShell>}
