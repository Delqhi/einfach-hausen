import Link from 'next/link';
import { CalendarDays, ClipboardList, FileText, Home, House, MessageSquare, UserRound } from 'lucide-react';

const owner = [
  ['/app', Home, 'Start'], ['/app/home', House, 'Mein Haus'], ['/app/jobs', ClipboardList, 'Aufträge'],
  ['/app/documents', FileText, 'Dokumente'], ['/app/profile', UserRound, 'Profil']
] as const;
const pro = [
  ['/pro', MessageSquare, 'Anfragen'], ['/pro/orders', ClipboardList, 'Aufträge'], ['/pro/calendar', CalendarDays, 'Kalender'],
  ['/pro/messages', MessageSquare, 'Nachrichten'], ['/pro/profile', UserRound, 'Profil']
] as const;
export function BottomNav({ role, active }: { role:'homeowner'|'provider'; active:string }) {
  const items = role === 'provider' ? pro : owner;
  return <nav className="bottom-nav">{items.map(([href,Icon,label]) => <Link key={href} href={href} className={active===href?'active':''}><Icon size={20}/><span>{label}</span></Link>)}</nav>;
}
