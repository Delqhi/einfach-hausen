import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { markNotificationsReadAction } from '@/app/actions';

export default async function Notifications(){
  const u=await requireUser();
  const rows=db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 100').all(u.id) as any[];
  const unread=rows.filter(r=>!r.read_at).length;
  return <AppShell role={u.role} active="" title="Benachrichtigungen" subtitle={unread?`${unread} ungelesen`:'Alles gelesen'}>
    <div className="notifications-head"><div><h1 className="page-title">Benachrichtigungen</h1><p className="page-subtitle">Angebote, Aufträge, Nachrichten, Dokumente und Plattform-Updates.</p></div>{unread>0&&<form action={markNotificationsReadAction}><button className="btn ghost"><CheckCheck size={15}/>Alle gelesen</button></form>}</div>
    <div className="stack">{rows.map(n=><Link href={n.href||'#'} className={n.read_at?'notification-row':'notification-row unread'} key={n.id}><Bell/><div><strong>{n.title}</strong><p>{n.body}</p><small>{new Date(n.created_at+'Z').toLocaleString('de-DE',{dateStyle:'short',timeStyle:'short'})}</small></div></Link>)}{rows.length===0&&<div className={u.role==='provider'?'empty dark-empty':'empty'}><Bell/><strong>Noch keine Benachrichtigungen</strong><p>Wichtige Änderungen erscheinen hier automatisch.</p></div>}</div>
  </AppShell>;
}
