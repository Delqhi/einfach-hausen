import type { Metadata } from 'next';
import { Eye, FileLock2, Hand, UserRound } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { FeatureGrid, LegalNotice, PageHero, Section } from '@/components/marketing/ui';

export const metadata: Metadata = { title: 'Datenschutz', description: 'Datenschutzseite von Einfach Hausen.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Rechtliches" title="Datenschutz" text="Die Plattform ist auf bewusste Freigaben und eine Trennung privater von hausbezogenen Informationen ausgelegt. Eine vollständige rechtsverbindliche Datenschutzerklärung muss vor Launch anhand des realen Betriebs finalisiert werden." />
  <Section eyebrow="Produktprinzipien" title="Datenschutz soll im Produkt verständlich sein.">
    <FeatureGrid items={[{icon:<Hand size={20}/>,title:'Bewusste Freigaben',text:'Kontaktdaten und Hausinformationen sollen nur zweckbezogen an professionelle Anbieter freigegeben werden.'},{icon:<Eye size={20}/>,title:'Keine pauschale Offenlegung',text:'Ein professioneller Anbieter soll nicht automatisch vollständige Hausdokumente, Zahlungen oder private Nachrichten sehen.'},{icon:<UserRound size={20}/>,title:'Eigentümerwechsel mit Grenzen',text:'Hausgeschichte kann kontrolliert übergeben werden; private Inhalte des früheren Eigentümers sollen davon getrennt bleiben.'},{icon:<FileLock2 size={20}/>,title:'Private Dokumente',text:'Die technische Zielarchitektur sieht eine private Dokumentablage und auditierbare Prozesse vor.'}]}/>
  </Section>
  <Section eyebrow="Rechtlicher Stand" title="Vor öffentlichem Launch finalisieren." tone="soft">
    <LegalNotice title="Launch-Blocker: vollständige Datenschutzerklärung fehlt"><p>Für eine belastbare Datenschutzerklärung müssen unter anderem der tatsächliche Verantwortliche samt Kontaktdaten, reale Hosting-/Dienstleister, konkrete Verarbeitungszwecke und Rechtsgrundlagen, Speicherfristen, Empfängerkategorien, Betroffenenrechte sowie tatsächlich eingesetzte Tracking-/Consent-Mechanismen verifiziert werden. Diese Seite behauptet bewusst keine ungeprüfte Rechtsvollständigkeit.</p></LegalNotice>
  </Section>
</MarketingShell>}
