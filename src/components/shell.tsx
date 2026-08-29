import Link from 'next/link';
import { Bell, HelpCircle } from 'lucide-react';
import { Logo } from './logo';
import { BottomNav } from './bottom-nav';
import { isNavActive, ownerNav, providerNav } from './nav-config';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function AppShell({ role, active, children, title, subtitle }: { role:'homeowner'|'provider'; active:string; children:React.ReactNode; title?:string; subtitle?:string }) {
  const pro = role === 'provider';
  const user=await getCurrentUser();
  const unread=user&&user.role===role?(db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL').get(user.id) as {c:number}).c:0;
  const items=pro?providerNav:ownerNav;
  const profileHref=pro?'/pro/profile':'/app/profile';
  const initials=user?`${user.first_name?.[0]||''}${user.last_name?.[0]||''}`.toUpperCase():'EH';

  return <main className={pro?'app-page app-shell-v3 provider-theme':'app-page app-shell-v3'}>
    <div className="workspace-shell">
      <aside className="desktop-sidebar">
        <div className="sidebar-brand"><Logo/></div>
        <nav className="sidebar-nav" aria-label="Hauptnavigation">{items.map(([href,Icon,label])=><Link key={href} href={href} className={isNavActive(active,href)?'active':''}><span className="sidebar-icon"><Icon size={17}/></span><span>{label}</span></Link>)}</nav>
        <div className="sidebar-footer"><Link href={profileHref} className="sidebar-user"><span className="user-avatar">{initials}</span><span><strong>{user?`${user.first_name} ${user.last_name}`:'Profil'}</strong><small>{pro?'Partnerkonto':'Eigenheim-Konto'}</small></span></Link><span className="sidebar-help"><HelpCircle size={14}/> Hilfe & Support</span></div>
      </aside>

      <div className="workspace-main">
        <header className="topbar-v3">
          <div className="mobile-brand"><Logo/></div>
          <div className="page-context"><strong>{title || (pro?'Partnerbereich':'Einfach Hausen')}</strong><small>{subtitle || (pro?'Aufträge organisieren':'Alles rund um dein Zuhause')}</small></div>
          <div className="top-actions"><Link className="notification-link" href="/notifications" aria-label={unread?`${unread} ungelesene Benachrichtigungen`:'Benachrichtigungen'}><Bell size={18}/>{unread>0&&<span>{unread>99?'99+':unread}</span>}</Link><Link href={profileHref} className="top-user-avatar" aria-label="Profil">{initials}</Link></div>
        </header>
        <section className="screen-v3">{children}</section>
      </div>
      <BottomNav role={role} active={active}/>
    </div>
  </main>;
}

export function SectionTitle({ children, href }: {children:React.ReactNode; href?:string}) {
  return <div className="section-title"><strong>{children}</strong>{href && <Link href={href}>Alle anzeigen</Link>}</div>;
}
