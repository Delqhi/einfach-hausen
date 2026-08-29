import { CalendarDays, ClipboardList, FileText, Home, House, Menu, MessageCircle, MessageSquare, ShieldCheck, UserRound, UsersRound, WalletCards, Wrench } from 'lucide-react';

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

export const ownerMoreNav = [
  ['/app/hausmeister', MessageCircle, 'Hausmeisterservice', 'Fragen klären und den nächsten Schritt organisieren'],
  ['/app/home', House, 'Mein Haus', 'Hausakte, Technik und Historie'],
  ['/app/year', Wrench, 'Wartungen & Mein Jahr', 'Was demnächst ansteht'],
  ['/app/documents', FileText, 'Dokumente & Rechnungen', 'Rechnungen, Nachweise und Belege'],
  ['/app/plans', WalletCards, 'Mitgliedschaft & Pakete', 'Free, Plus, Premium und Jahrespakete'],
  ['/notifications', ShieldCheck, 'Benachrichtigungen', 'Alle wichtigen Updates'],
  ['/app/profile', UserRound, 'Profil & Einstellungen', 'Persönliche Daten, WhatsApp und App'],
] as const;

export function isNavActive(active: string, href: string) {
  if (href === '/app' || href === '/pro') return active === href;
  if (href === '/app/more') return ['/app/more', '/app/home', '/app/year', '/app/documents', '/app/plans', '/app/profile'].some((prefix) => active === prefix || active.startsWith(`${prefix}/`));
  return active === href || active.startsWith(`${href}/`);
}
