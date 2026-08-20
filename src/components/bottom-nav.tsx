import Link from 'next/link';
import { ClipboardList, Home, House, MessageSquare, UsersRound, UserRound } from 'lucide-react';

export const ownerNav = [
  ['/app', Home, 'Hausmeister'],
  ['/app/home', House, 'Mein Haus'],
  ['/app/jobs', ClipboardList, 'Aufträge'],
  ['/app/messages', MessageSquare, 'Kontakte'],
  ['/app/profile', UserRound, 'Profil']
] as const;

export const providerNav = [
  ['/pro', Home, 'Anfragen'],
  ['/pro/orders', ClipboardList, 'Aufträge'],
  ['/pro/messages', MessageSquare, 'Nachrichten'],
  ['/pro/team', UsersRound, 'Team'],
  ['/pro/profile', UserRound, 'Profil']
] as const;

export function isNavActive(active:string, href:string){
  if(href==='/app'||href==='/pro') return active===href;
  return active===href || active.startsWith(`${href}/`);
}

export function BottomNav({ role, active }: { role:'homeowner'|'provider'; active:string }) {
  const items = role === 'provider' ? providerNav : ownerNav;
  return <nav className="bottom-nav" aria-label="Hauptnavigation">{items.map(([href,Icon,label]) => <Link key={href} href={href} className={isNavActive(active,href)?'active':''}><Icon size={20}/><span>{label}</span></Link>)}</nav>;
}
