import Link from 'next/link';
import { ChevronRight,FileText,House,MessageCircle,Settings,ShieldCheck,UserRound,WalletCards,Wrench } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';

const links=[
  ['/app/hausmeister',MessageCircle,'Hausmeisterservice','Fragen klären und den nächsten Schritt organisieren'],
  ['/app/home',House,'Mein Haus','Hausakte, Technik und Historie'],
  ['/app/year',Wrench,'Wartungen & Mein Jahr','Was demnächst ansteht'],
  ['/app/documents',FileText,'Dokumente & Rechnungen','Rechnungen, Nachweise und Belege'],
  ['/app/plans',WalletCards,'Mitgliedschaft & Pakete','Free, Plus, Premium und Jahrespakete'],
  ['/notifications',ShieldCheck,'Benachrichtigungen','Alle wichtigen Updates'],
  ['/app/profile',UserRound,'Profil & Einstellungen','Persönliche Daten, WhatsApp und App'],
] as const;

export default async function More(){await requireUser('homeowner');return <AppShell role="homeowner" active="/app/more" title="Mehr" subtitle="Alles Weitere rund um dein Zuhause"><h1 className="page-title">Mehr</h1><div className="more-menu">{links.map(([href,Icon,title,sub])=><Link href={href} key={href}><span className="more-icon"><Icon/></span><span className="grow"><strong>{title}</strong><small>{sub}</small></span><ChevronRight/></Link>)}</div><div className="more-support"><Settings/><div><strong>Hilfe & Support</strong><p>Wenn ein Vorgang festhängt, kannst du ihn direkt im Auftrag als Servicefall melden.</p></div></div></AppShell>}
