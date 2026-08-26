import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { AppShell } from '@/components/shell';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { setNotificationReadStateAction, markAllNotificationsReadForCurrentUserAction } from './actions';

const PAGE_SIZE = 25;

export default async function Notifications({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const u = await requireUser();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const unreadTotal = (db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=? AND read_at IS NULL').get(u.id) as { c: number }).c;
  const total = (db.prepare('SELECT COUNT(*) c FROM notifications WHERE user_id=?').get(u.id) as { c: number }).c;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?').all(u.id, PAGE_SIZE, (safePage - 1) * PAGE_SIZE) as any[];
  return <AppShell role={u.role} active={u.role === 'provider' ? '/notifications' : ''} title="Updates" subtitle={unreadTotal ? `${unreadTotal} ungelesen` : 'Alles gelesen'}>
    <div className="notifications-head"><div><h1 className="page-title">Updates</h1><p className="page-subtitle">Angebote, Disposition, Auftragsstatus, Dokumente, Hausplan und Plattform-Updates.</p></div>{unreadTotal > 0 && <form action={markAllNotificationsReadForCurrentUserAction}><button className="btn ghost"><CheckCheck size={15}/>Alle gelesen</button></form>}</div>
    <div className="stack">
      {rows.map(n => {
        const isUnread = !n.read_at;
        return <div className={isUnread ? 'notification-row unread' : 'notification-row'} key={n.id}>
          <Bell/>
          <Link href={n.href || '#'} className="notification-link"><div><strong>{n.title}</strong><p>{n.body}</p><small>{new Date(n.created_at + 'Z').toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</small></div></Link>
          <form action={setNotificationReadStateAction}>
            <input type="hidden" name="id" value={n.id}/>
            {isUnread
              ? <button name="read" value="1" className="btn ghost" aria-label={`Als gelesen markieren: ${n.title}`}>Gelesen</button>
              : <button name="read" value="0" className="btn ghost" aria-label={`Als ungelesen markieren: ${n.title}`}>Ungelesen</button>}
          </form>
        </div>;
      })}
      {rows.length === 0 && <div className={u.role === 'provider' ? 'empty dark-empty' : 'empty'}><Bell/><strong>Noch keine Benachrichtigungen</strong><p>Wichtige Änderungen erscheinen hier automatisch.</p></div>}
      {pageCount > 1 && <nav className="pager" aria-label="Seiten">
        {safePage > 1 && <Link className="btn ghost" href={`/notifications?page=${safePage - 1}`}>Zurück</Link>}
        <span>Seite {safePage} von {pageCount}</span>
        {safePage < pageCount && <Link className="btn ghost" href={`/notifications?page=${safePage + 1}`}>Weiter</Link>}
      </nav>}
    </div>
  </AppShell>;
}
