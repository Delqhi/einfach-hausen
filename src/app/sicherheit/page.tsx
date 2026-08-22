import type { Metadata } from 'next';
import { BadgeCheck, Eye, LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';
import { MarketingShell } from '@/components/marketing/site-shell';
import { CtaBand, FeatureGrid, PageHero, Section } from '@/components/marketing/ui';

export const metadata: Metadata = { title: 'Sicherheit', description: 'Sicherheits- und Vertrauensprinzipien von Einfach Hausen verständlich erklärt.' };
export default function Page(){return <MarketingShell>
  <PageHero eyebrow="Sicherheit" title="Vertrauen entsteht durch klare Entscheidungen und kontrollierte Zugriffe." text="Einfach Hausen soll nur die Informationen und Freigaben verwenden, die für den jeweiligen Vorgang sinnvoll sind. Diese Seite beschreibt Produktprinzipien – keine technische Sicherheitszertifizierung." />
  <Section eyebrow="Produktprinzipien" title="Was Nutzer jederzeit verstehen sollen.">
    <FeatureGrid items={[{icon:<UserCheck size={20}/>,title:'Keine automatische Beauftragung',text:'Eine Frage oder Kontaktanfrage wird nicht stillschweigend zu einem kostenpflichtigen Auftrag.'},{icon:<Eye size={20}/>,title:'Zweckgebundene Freigaben',text:'Eigentümerkontaktdaten und Hausinformationen sollen professionellen Anbietern nicht pauschal offengelegt werden.'},{icon:<LockKeyhole size={20}/>,title:'Private Daten bleiben getrennt',text:'Bei einer Hausübergabe sollen private alte Nachrichten, Zahlungen und nicht freigegebene Dokumente nicht automatisch mitwandern.'}]}/>
  </Section>
  <Section eyebrow="Partnervertrauen" title="Aktive Vermittlung nur im geprüften Netzwerk." text="Das Produktmodell sieht eine Mindestprüfung und einen aktiven Vertrag vor, bevor Unternehmen regulär Anfragen erhalten." tone="green">
    <FeatureGrid items={[{icon:<BadgeCheck size={20}/>,title:'Betrieb & Qualifikation',text:'Unternehmen, notwendige Qualifikationen beziehungsweise Zulassungen und Qualitätsstatus gehören zur Prüfung.'},{icon:<ShieldCheck size={20}/>,title:'Betriebshaftpflicht',text:'Eine Betriebshaftpflicht gehört zur definierten Mindestprüfung des Partnernetzwerks.'},{icon:<UserCheck size={20}/>,title:'Kommunikationsqualität',text:'Eignung besteht nicht nur aus Fachgebiet, sondern auch aus Verfügbarkeit, Kapazität und Servicequalität.'}]}/>
  </Section>
  <CtaBand title="Du behältst die Entscheidungshoheit." text="Das gilt für Aufträge, persönliche Kontakte und die Weitergabe hausbezogener Informationen." />
</MarketingShell>}
