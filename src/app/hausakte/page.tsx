import type { Metadata } from 'next';
import { FileText, History, Home, LockKeyhole, UserRound, Wrench } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { BulletList, CtaBand, FeatureGrid, InfoPanel, LinkButton, PageHero, Section, Split, Statement } from '@/components/marketing/ui';
import { HeroTimeline } from '@/components/marketing/hero-visuals';

export const metadata: Metadata = { title: 'Digitale Hausakte', description: 'Technik, Arbeiten, Dokumente, Wartungen und Ansprechpartner langfristig am Haus geordnet.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Digitale Hausakte" title="Dein Haus bekommt ein Gedächtnis." text="Hausdaten, Anlagen, Arbeiten, Dokumente, Wartungen und Ansprechpartner müssen nicht über Jahre in Ordnern, Chats und Köpfen verteilt bleiben." aside={<HeroTimeline />} actions={<LinkButton href="/register?role=homeowner">Kostenlos starten</LinkButton>} />
  <Section eyebrow="Was zusammenkommt" title="Eine Akte, die mit dem Haus wächst." text="Die Hausakte verbindet laufende Vorgänge mit der langfristigen Geschichte der Immobilie.">
    <FeatureGrid items={[{icon:<Home size={20}/>,title:'Haus & Anlagen',text:'Adresse, Haustyp, Baujahr, Flächen sowie relevante Technik und Ausstattung.'},{icon:<History size={20}/>,title:'Historie',text:'Erledigte Arbeiten, Kosten, Garantien, Fotos und wichtige Hinweise bleiben zeitlich nachvollziehbar.'},{icon:<FileText size={20}/>,title:'Dokumente',text:'Rechnungen, Belege und hausbezogene Unterlagen können dem passenden Vorgang zugeordnet bleiben.'},{icon:<Wrench size={20}/>,title:'Wartung & Zukunft',text:'Aus Anlagen und erledigten Arbeiten können Wartungen, Erinnerungen und zukünftige Aufgaben entstehen.'},{icon:<UserRound size={20}/>,title:'Ansprechpartner',text:'Konkrete Menschen und bevorzugte Dienstleister bleiben nach Bereichen mit dem Haus verbunden.'},{icon:<LockKeyhole size={20}/>,title:'Kontrollierte Übergabe',text:'Bei einem Eigentümerwechsel soll nur freigegebene Hausgeschichte weitergegeben werden – nicht private alte Nachrichten oder Zahlungen.'}]}/>
  </Section>
  <Statement kicker="Der Unterschied" tone="soft">Die Hausakte ist kein Ordner. Sie ist das Gedächtnis deines Hauses.</Statement>
  <Section eyebrow="Eigentümerwechsel" title="Die Immobilie bleibt. Private Kommunikation bleibt privat." text="Das Produktmodell trennt hausbezogene Historie von persönlichen Daten des früheren Eigentümers." tone="green">
    <Split><InfoPanel label="Kann weitergegeben werden"><h3>Freigegebene Hausgeschichte</h3><BulletList items={['Hausbezogene Technik und Anlagen','Dokumentierte Arbeiten und Wartungen','Freigegebene Garantien und Unterlagen','Hausbezogene Ansprechpartner, soweit freigegeben']} /></InfoPanel><InfoPanel label="Nicht automatisch übertragen"><h3>Private Inhalte</h3><BulletList items={['Private alte Nachrichten','Persönliche Zahlungsdaten','Nicht freigegebene Unterlagen','Vollständige private Kontohistorie']} /></InfoPanel></Split>
  </Section>
  <CtaBand title="Beginne heute mit der Geschichte deines Hauses." text="Das kostenlose Hauskonto enthält bereits die digitale Hausakte. Erweiterte Wartungs- und Servicefunktionen sind optional." />
</MarketingShell>}
