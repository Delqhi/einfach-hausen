import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';
import { Logo } from './logo';
import { BottomNav } from './bottom-nav';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function AppShell({ role, active, children, title, subtitle }: { role:'homeowner'|'provider'; active:string; children:React.ReactNode; title?:string; subtitle?:string }) {
  const pro = role === 'provider';
  const user=await getCurrentUser();
  const unread=user&&user.role===role?(db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL').get(user.id) as {c:number}).c:0;
  return <main className={pro?'app-page pro-theme':'app-page'}>
    <div className="phone-shell">
      <header className="topbar">
        {pro ? <div><strong>{title}</strong><small>{subtitle}</small></div> : <Logo/>}
        <div className="top-actions"><Link className="notification-link" href="/notifications" aria-label={unread?`${unread} ungelesene Benachrichtigungen`:'Benachrichtigungen'}><Bell size={20}/>{unread>0&&<span>{unread>99?'99+':unread}</span>}</Link><Link href={pro?'/pro/profile':'/app/profile'} aria-label="Profil und Menü"><Menu size={22}/></Link></div>
      </header>
      <section className="screen">{children}</section>
      <BottomNav role={role} active={active}/>
    </div>
  </main>;
}

export function SectionTitle({ children, href }: {children:React.ReactNode; href?:string}) {
  return <div className="section-title"><strong>{children}</strong>{href && <Link href={href}>Alle anzeigen</Link>}</div>;
}
