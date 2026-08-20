import Link from 'next/link';
import { Bell, ChevronRight, HelpCircle } from 'lucide-react';
import { Logo } from './logo';
import { BottomNav, isNavActive, ownerNav, providerNav } from './bottom-nav';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function AppShell({ role, active, children, title, subtitle }: { role:'homeowner'|'provider'; active:string; children:React.ReactNode; title?:string; subtitle?:string }) {
  const pro = role === 'provider';
  const user=await getCurrentUser();
  const unread=user&&user.role===role?(db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL').get(user.id) as {c:number}).c:0;
  const items=pro?providerNav:ownerNav;
  const profileHref=pro?'/pro/profile':'/app/profile';
  const initials=user?`${user.first_name?.[0]||''}${user.last_name?.[0]||''}`.toUpperCase():'EH';

  return <main className={pro?'app-page app-shell-v2 pro-theme':'app-page app-shell-v2'}>
    <div className="workspace-shell">
      <aside className="desktop-sidebar">
        <div className="sidebar-brand"><Logo inverse={pro}/></div>
        <nav className="sidebar-nav" aria-label="Hauptnavigation">{items.map(([href,Icon,label])=><Link key={href} href={href} className={isNavActive(active,href)?'active':''}><span className="sidebar-icon"><Icon size={19}/></span><span>{label}</span>{isNavActive(active,href)&&<ChevronRight size={15} className="sidebar-chevron"/>}</Link>)}</nav>
        {!pro&&<div className="sidebar-promo"><span>PLUS</span><strong>Dein Haus denkt mit.</strong><p>Wartungen, Erinnerungen und Hausjahresplan automatisch organisieren.</p><Link href="/app/plans">Tarife ansehen <ChevronRight size={14}/></Link></div>}
        {pro&&<div className="sidebar-promo pro-promo"><span>PARTNERNETZWERK</span><strong>0 % Provision</strong><p>Aufträge annehmen, Ansprechpartner zuweisen, Kundenbeziehungen behalten.</p><Link href="/pro/plans">Partner-Tarife <ChevronRight size={14}/></Link></div>}
        <div className="sidebar-footer"><Link href={profileHref} className="sidebar-user"><span className="user-avatar">{initials}</span><span><strong>{user?`${user.first_name} ${user.last_name}`:'Profil'}</strong><small>{pro?'Partnerkonto':'Eigenheim-Konto'}</small></span></Link><span className="sidebar-help"><HelpCircle size={16}/> Hilfe & Support</span></div>
      </aside>

      <div className="workspace-main">
        <header className="topbar topbar-v2">
          <div className="mobile-brand"><Logo inverse={pro}/></div>
          <div className="page-context"><strong>{title || (pro?'Partnerbereich':'Einfach Hausen')}</strong><small>{subtitle || (pro?'Aufträge einfach organisieren':'Dein digitaler Hausmeister')}</small></div>
          <div className="top-actions"><Link className="notification-link" href="/notifications" aria-label={unread?`${unread} ungelesene Benachrichtigungen`:'Benachrichtigungen'}><Bell size={20}/>{unread>0&&<span>{unread>99?'99+':unread}</span>}</Link><Link href={profileHref} className="top-user-avatar" aria-label="Profil">{initials}</Link></div>
        </header>
        <section className="screen screen-v2">{children}</section>
      </div>
      <BottomNav role={role} active={active}/>
    </div>
  </main>;
}

export function SectionTitle({ children, href }: {children:React.ReactNode; href?:string}) {
  return <div className="section-title"><strong>{children}</strong>{href && <Link href={href}>Alle anzeigen</Link>}</div>;
}
