import Link from 'next/link';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import { Logo } from './logo';
import { BottomNav, isNavActive, ownerNav, providerNav } from './bottom-nav';
import { OwnerMobileMenu } from './owner-menu';
import { BellRoundedIcon } from './icons';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

function CenterLogo({ href }: { href: string }) {
  return (
    <Link className="ehn-center-logo" href={href} aria-label="einfachhausen – Startseite">
      <svg className="ehn-center-logo-house" width="86" height="58" viewBox="0 0 120 88" fill="none" aria-hidden="true"><path d="M38 34 L74 12 L96 26 V82 H52" stroke="#105258" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="ehn-center-logo-text"><span className="own-logo-line1">einfach</span><span className="own-logo-line2">hausen</span></span>
    </Link>
  );
}

export async function AppShell({ role, active, children, title, subtitle }: { role:'homeowner'|'provider'; active:string; children:React.ReactNode; title?:string; subtitle?:string }) {
  const pro = role === 'provider';
  const user=await getCurrentUser();
  const unread=user&&user.role===role?(db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL').get(user.id) as {c:number}).c:0;
  const items=pro?providerNav:ownerNav;
  const profileHref=pro?'/pro/profile':'/app/profile';
  const initials=user?`${user.first_name?.[0]||''}${user.last_name?.[0]||''}`.toUpperCase():'EH';

  const mobileMenu = pro ? (
    <details className="mobile-menu">
      <summary aria-label="Hauptmenü öffnen"><Menu size={20}/><span>Menü</span></summary>
      <nav className="mobile-menu-panel" aria-label="Hauptnavigation">{items.map(([href,Icon,label])=><Link key={href} href={href} className={isNavActive(active,href)?'active':''}><Icon size={18}/><span>{label}</span></Link>)}</nav>
    </details>
  ) : (
    <OwnerMobileMenu active={active} />
  );

  return <main className={pro?'app-page app-shell-v3 pro-theme':'app-page app-shell-v3 ehn-owner'}>
    <div className="workspace-shell">
      <aside className="desktop-sidebar">
        {/* Desktop shows the workspace navigation expanded by default; the
        summary stays clickable so users can collapse it. Mobile hides this
        aside entirely (bottom nav + mobile menu own that breakpoint). */}
        <details className="app-menu" open>
          <summary className="app-menu-summary" aria-label="Menü öffnen oder schließen">
            <span className="app-menu-mark"><Menu size={19} strokeWidth={1.9}/></span>
            <span className="app-menu-summary-label">Menü</span>
          </summary>
          <div className="app-menu-content">
            <div className="sidebar-brand"><Logo inverse={pro}/></div>
            <nav className="sidebar-nav" aria-label="Hauptnavigation">{items.map(([href,Icon,label])=><Link key={href} href={href} className={isNavActive(active,href)?'active':''}><span className="sidebar-icon"><Icon size={17}/></span><span>{label}</span></Link>)}</nav>
            <div className="sidebar-footer"><Link href={profileHref} className="sidebar-user"><span className="user-avatar">{initials}</span><span><strong>{user?`${user.first_name} ${user.last_name}`:'Profil'}</strong><small>{pro?'Partnerkonto':'Eigenheim-Konto'}</small></span></Link><span className="sidebar-help"><HelpCircle size={14}/> Hilfe & Support</span></div>
          </div>
        </details>
      </aside>

      <div className="workspace-main">
        <header className={pro?'topbar-v3':'topbar-v3 ehn-owner-top'}>
          {mobileMenu}
          <div className="mobile-brand"><Logo inverse={pro}/></div>
          {!pro&&<CenterLogo href="/app"/>}
          <div className="page-context"><strong>{title || (pro?'Partnerbereich':'Einfach Hausen')}</strong><small>{subtitle || (pro?'Aufträge organisieren':'Alles rund um dein Zuhause')}</small></div>
          <div className="top-actions">
            <Link className="notification-link" href="/notifications" aria-label={unread?`${unread} ungelesene Benachrichtigungen`:'Benachrichtigungen'}>
              {pro?<Bell size={18}/>:<BellRoundedIcon/>}
              {unread>0&&(pro?<span>{unread>99?'99+':unread}</span>:<span className="ehn-bell-dot" aria-hidden="true"/>)}
            </Link>
            <Link href={profileHref} className="top-user-avatar" aria-label="Profil">{initials}</Link>
          </div>
        </header>
        <section className={`screen-v3${!pro && active === "/app" ? " ehn-dash-screen" : ""}`}>{children}</section>
      </div>
      <BottomNav role={role} active={active}/>
    </div>
  </main>;
}

export function SectionTitle({ children, href }: {children:React.ReactNode; href?:string}) {
  return <div className="section-title"><strong>{children}</strong>{href && <Link href={href}>Alle anzeigen</Link>}</div>;
}
