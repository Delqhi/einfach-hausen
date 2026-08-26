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

// --- Durable outbox (EH T-0104) -------------------------------------------
// Domain events are recorded first; notifications materialize from them with
// an explicit delivery lifecycle: pending -> sent, with retry + dead-letter
// for channels that fail. In-app is delivered by the row insert itself.

export const MAX_NOTIFICATION_RETRIES = 3;
export const NOTIFICATION_RETRY_BASE_SECONDS = 30;

export function recordDomainEvent(eventType: string, payload: Record<string, unknown> = {}): number {
  const info = db
    .prepare('INSERT INTO notification_events(event_type,payload_json) VALUES(?,?)')
    .run(eventType.slice(0, 100), JSON.stringify(payload).slice(0, 4000));
  return Number(info.lastInsertRowid);
}

export function markDomainEventProcessed(eventId: number): void {
  db.prepare('UPDATE notification_events SET processed_at=CURRENT_TIMESTAMP WHERE id=? AND processed_at IS NULL').run(eventId);
}

export type EnqueueNotificationInput = {
  userId: number;
  title: string;
  body?: string;
  href?: string;
  kind?: string;
  channel?: 'in_app';
  priority?: number;
  eventId?: number;
};

export function enqueueNotification(input: EnqueueNotificationInput): number {
  const priority = Math.max(1, Math.min(9, Math.round(input.priority ?? 5)));
  const eventId = input.eventId ?? recordDomainEvent(`notification.${input.kind || 'info'}`, { userId: input.userId, title: input.title });
  const info = db
    .prepare("INSERT INTO notifications(user_id,kind,title,body,href,channel,priority,status,event_id) VALUES(?,?,?,?,?,?,?,'pending',?)")
    .run(
      input.userId,
      (input.kind || 'info').slice(0, 40),
      input.title.slice(0, 200),
      (input.body || '').slice(0, 800),
      input.href || '',
      input.channel || 'in_app',
      priority,
      eventId,
    );
  return Number(info.lastInsertRowid);
}

// Deliver every due pending notification. In-app messages are delivered by
// flipping to sent (the inbox reads the table directly); unknown channels
// fail so the retry/backoff/dead-letter path stays honest.
export function dispatchDueNotifications(nowMs: number = Date.now()): { sent: number; retried: number; dead: number } {
  const due = db
    .prepare("SELECT id,channel,retry_count FROM notifications WHERE status='pending' AND (next_retry_at IS NULL OR next_retry_at<=?) ORDER BY priority ASC, created_at ASC LIMIT 200")
    .all(new Date(nowMs).toISOString()) as Array<{ id: number; channel: string; retry_count: number }>;
  let sent = 0;
  let retried = 0;
  let dead = 0;
  for (const row of due) {
    if (row.channel === 'in_app') {
      db.prepare("UPDATE notifications SET status='sent' WHERE id=? AND status='pending'").run(row.id);
      sent++;
    } else {
      const attempts = row.retry_count + 1;
      if (attempts >= MAX_NOTIFICATION_RETRIES) {
        db.prepare("UPDATE notifications SET status='dead',retry_count=?,next_retry_at=NULL WHERE id=?").run(attempts, row.id);
        dead++;
      } else {
        const backoffSeconds = NOTIFICATION_RETRY_BASE_SECONDS * 2 ** (attempts - 1);
        const nextRetry = new Date(nowMs + backoffSeconds * 1000).toISOString();
        db.prepare("UPDATE notifications SET retry_count=?,next_retry_at=? WHERE id=? AND status='pending'").run(attempts, nextRetry, row.id);
        retried++;
      }
    }
  }
  return { sent, retried, dead };
}
