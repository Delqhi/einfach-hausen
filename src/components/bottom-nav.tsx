import Link from 'next/link';
import { ClipboardList, Home, House, MessageSquare, UsersRound, UserRound } from 'lucide-react';

const owner = [
  ['/app', Home, 'Hausmeister'],
  ['/app/home', House, 'Mein Haus'],
  ['/app/jobs', ClipboardList, 'Aufträge'],
  ['/app/messages', MessageSquare, 'Kontakte'],
  ['/app/profile', UserRound, 'Profil']
] as const;

const pro = [
  ['/pro', Home, 'Anfragen'],
  ['/pro/orders', ClipboardList, 'Aufträge'],
  ['/pro/messages', MessageSquare, 'Nachrichten'],
  ['/pro/team', UsersRound, 'Team'],
  ['/pro/profile', UserRound, 'Profil']
] as const;

export function BottomNav({ role, active }: { role:'homeowner'|'provider'; active:string }) {
  const items = role === 'provider' ? pro : owner;
  return <nav className="bottom-nav">{items.map(([href,Icon,label]) => <Link key={href} href={href} className={active===href?'active':''}><Icon size={20}/><span>{label}</span></Link>)}</nav>;
}
