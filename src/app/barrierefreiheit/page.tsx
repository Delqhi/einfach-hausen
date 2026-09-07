import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { Keyboard, MousePointer2, ScanText } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { LegalNotice } from '@/components/marketing/ui';
import { EHScope, EHSection, EHPageHero, EHFeatureRows, EHClosing, EHButton, EHEyebrow, EHHeading } from '@/design-system';

export const metadata: Metadata = { title: 'Barrierefreiheit', description: 'Zugänglichkeitsprinzipien der Einfach-Hausen-Oberflächen.' , alternates: { canonical: canonical('/barrierefreiheit') } };
export default function Page(){return <MarketingShell>
  <EHScope>
  <EHPageHero eyebrow="Zugänglichkeit" title="Einfach soll auch zugänglich bedeuten." text="Die Website wird mit semantischer Struktur, sichtbaren Fokuszuständen, ausreichenden Touch-Zielen und reduzierbarer Bewegung entwickelt. Wir behaupten hier keine noch nicht geprüfte formale Konformitätsstufe." />
  <EHSection compact>
  <EHEyebrow>Gestaltungsprinzipien</EHEyebrow>
  <EHHeading>Zugänglichkeit ist Teil des Designs, nicht ein Zusatz.</EHHeading>
    <EHFeatureRows items={[{icon:<Keyboard size={20}/>,title:'Tastatur',text:'Navigation und interaktive Elemente sollen mit sichtbarem Fokus erreichbar und bedienbar sein.'},{icon:<MousePointer2 size={20}/>,title:'Touch-Ziele',text:'Wichtige Aktionen sind auf mobile Nutzung mit ausreichend großen Bedienflächen ausgelegt.'},{icon:<ScanText size={20}/>,title:'Semantik & Lesbarkeit',text:'Klare Überschriftenhierarchie, verständliche Linktexte und ausreichender Kontrast gehören zum Designvertrag.'}]}/>
  </EHSection>
  <EHSection compact>
  <EHEyebrow>Status</EHEyebrow>
  <EHHeading>Formale Prüfung bleibt ein eigener Launch-Schritt.</EHHeading>
    <LegalNotice title="Keine ungeprüfte Konformitätsbehauptung"><p>Vor einer formalen Erklärung zur Barrierefreiheit sind die produktiven Oberflächen, Inhalte und Interaktionen mit geeigneten Prüfverfahren zu bewerten. Diese Seite beschreibt deshalb nur die verbindlichen Design- und Entwicklungsziele.</p></LegalNotice>
  </EHSection>
  <EHClosing title="Einfach anfangen – mit einem Produkt, das dich nicht überfordert." text="Hauskonto kostenlos anlegen und in Ruhe ausprobieren. Rückfragen beantwortet die Hilfe." href="/register?role=homeowner" label="Hauskonto kostenlos anlegen" secondary={<EHButton href="/#anliegen" variant="secondary">Anliegen starten</EHButton>} />
</EHScope>
</MarketingShell>}
