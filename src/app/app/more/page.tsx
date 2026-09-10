import { FileText,House,MessageCircle,ShieldCheck,UserRound,WalletCards,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { EHAppHeader, EHServiceDirectory, EHCallout } from '@/design-system';

const links=[
  ['/app/hausmeister',MessageCircle,'Hausmeisterservice','Fragen klären und den nächsten Schritt organisieren'],
  ['/app/home',House,'Mein Haus','Hausakte, Technik und Historie'],
  ['/app/year',Wrench,'Wartungen & Mein Jahr','Was demnächst ansteht'],
  ['/app/documents',FileText,'Dokumente & Rechnungen','Rechnungen, Nachweise und Belege'],
  ['/app/plans',WalletCards,'Mitgliedschaft & Pakete','Free, Plus, Premium und Jahrespakete'],
  ['/notifications',ShieldCheck,'Benachrichtigungen','Alle wichtigen Updates'],
  ['/app/profile',UserRound,'Profil & Einstellungen','Persönliche Daten, WhatsApp und App'],
] as const;

export default async function More(){await requireUser('homeowner');return <AppShell role="homeowner" active="/app/more" title="Mehr" subtitle="Alles Weitere rund um dein Zuhause">
    <EHAppHeader eyebrow="Navigation" title="Mehr" text="Alles Weitere rund um dein Zuhause." />
    <EHServiceDirectory groups={[
      {title:"Dein Haus organisieren",items:links.slice(0,4).map(([href,Icon,title,text])=>({href,title,text,icon:<Icon/>}))},
      {title:"Dein Konto",items:links.slice(4).map(([href,Icon,title,text])=>({href,title,text,icon:<Icon/>}))},
    ]}/>
    <EHCallout title="Hilfe & Support"><p>Wenn ein Vorgang festhängt, kannst du ihn direkt im Auftrag als Servicefall melden.</p></EHCallout>
  </AppShell>}
