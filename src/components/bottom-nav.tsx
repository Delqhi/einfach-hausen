import Link from 'next/link';
import { CalendarDays,ClipboardList,Home,Menu,MessageSquare,UsersRound,UserRound } from 'lucide-react';

export const ownerNav = [
  ['/app', Home, 'Home'],
  ['/app/jobs', ClipboardList, 'Aufträge'],
  ['/app/calendar', CalendarDays, 'Termine'],
  ['/app/messages', UsersRound, 'Ansprechpartner'],
  ['/app/more', Menu, 'Mehr'],
] as const;

export const providerNav = [
  ['/pro', Home, 'Anfragen'],
  ['/pro/orders', ClipboardList, 'Aufträge'],
  ['/pro/messages', MessageSquare, 'Nachrichten'],
  ['/pro/team', UsersRound, 'Team'],
  ['/pro/profile', UserRound, 'Profil'],
] as const;

export function isNavActive(active:string, href:string){
  if(href==='/app'||href==='/pro') return active===href;
  if(href==='/app/more') return ['/app/more','/app/home','/app/year','/app/documents','/app/plans','/app/profile'].some(prefix=>active===prefix||active.startsWith(`${prefix}/`));
  return active===href || active.startsWith(`${href}/`);
}

export function BottomNav({ role, active }: { role:'homeowner'|'provider'; active:string }) {
  const items = role === 'provider' ? providerNav : ownerNav;
  return <nav className="bottom-nav" aria-label="Hauptnavigation">{items.map(([href,Icon,label]) => <Link key={href} href={href} className={isNavActive(active,href)?'active':''}><Icon size={20}/><span>{label}</span></Link>)}</nav>;
}
