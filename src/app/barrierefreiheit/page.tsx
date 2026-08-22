import type { Metadata } from 'next';
import { Keyboard, MousePointer2, ScanText } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { FeatureGrid, LegalNotice, PageHero, Section } from '@/components/marketing/ui';

export const metadata: Metadata = { title: 'Barrierefreiheit', description: 'Zugänglichkeitsprinzipien der Einfach-Hausen-Oberflächen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Zugänglichkeit" title="Einfach soll auch zugänglich bedeuten." text="Die Website wird mit semantischer Struktur, sichtbaren Fokuszuständen, ausreichenden Touch-Zielen und reduzierbarer Bewegung entwickelt. Wir behaupten hier keine noch nicht geprüfte formale Konformitätsstufe." />
  <Section eyebrow="Gestaltungsprinzipien" title="Zugänglichkeit ist Teil des Designs, nicht ein Zusatz.">
    <FeatureGrid items={[{icon:<Keyboard size={20}/>,title:'Tastatur',text:'Navigation und interaktive Elemente sollen mit sichtbarem Fokus erreichbar und bedienbar sein.'},{icon:<MousePointer2 size={20}/>,title:'Touch-Ziele',text:'Wichtige Aktionen sind auf mobile Nutzung mit ausreichend großen Bedienflächen ausgelegt.'},{icon:<ScanText size={20}/>,title:'Semantik & Lesbarkeit',text:'Klare Überschriftenhierarchie, verständliche Linktexte und ausreichender Kontrast gehören zum Designvertrag.'}]}/>
  </Section>
  <Section eyebrow="Status" title="Formale Prüfung bleibt ein eigener Launch-Schritt." tone="soft">
    <LegalNotice title="Keine ungeprüfte Konformitätsbehauptung"><p>Vor einer formalen Erklärung zur Barrierefreiheit sind die produktiven Oberflächen, Inhalte und Interaktionen mit geeigneten Prüfverfahren zu bewerten. Diese Seite beschreibt deshalb nur die verbindlichen Design- und Entwicklungsziele.</p></LegalNotice>
  </Section>
</MarketingShell>}
