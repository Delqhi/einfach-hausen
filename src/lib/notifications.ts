import { db } from './db';

export function createNotification(userId: number, title: string, body: string, href: string, kind = 'info') {
  return db
    .prepare('INSERT INTO notifications(user_id,kind,title,body,href) VALUES(?,?,?,?,?)')
    .run(userId, kind, title, body.slice(0, 800), href);
}

export function markNotificationRead(userId: number, notificationId: number): boolean {
  const result = db
    .prepare('UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=? AND read_at IS NULL')
    .run(notificationId, userId);
  return result.changes === 1;
}

export function markNotificationUnread(userId: number, notificationId: number): boolean {
  const result = db
    .prepare('UPDATE notifications SET read_at=NULL WHERE id=? AND user_id=? AND read_at IS NOT NULL')
    .run(notificationId, userId);
  return result.changes === 1;
}

export function markAllNotificationsRead(userId: number): number {
  return db
    .prepare('UPDATE notifications SET read_at=CURRENT_TIMESTAMP WHERE user_id=? AND read_at IS NULL')
    .run(userId).changes;
}
