import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0104-src-'));
const dbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0104-db-'));
process.env.DATABASE_PATH = path.join(dbDir, 'regression.db');
process.chdir(dbDir);
fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
for (const rel of ['src/lib/db.ts', 'src/lib/notifications.ts']) {
  const src = fs.readFileSync(path.join(root, rel), 'utf8');
  const stripped = stripTypeScriptTypes(src).replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g, (_m, a, s, b) => `${a}${s}.mjs${b}`);
  const dest = path.join(scratch, rel.replace(/\.ts$/, '.mjs'));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, stripped);
}

let passed = 0;
const failures = [];
function check(name, condition, detail = '') {
  if (condition) { passed++; console.log(`  ok  ${name}`); }
  else { failures.push(`${name}${detail ? ` :: ${detail}` : ''}`); console.error(`FAIL  ${name}${detail ? ` :: ${detail}` : ''}`); }
}

try {
  const { db } = await import(pathToFileURL(path.join(scratch, 'src/lib/db.mjs')).href);
  const n = await import(pathToFileURL(path.join(scratch, 'src/lib/notifications.mjs')).href);

  db.prepare("INSERT INTO users(email,password_hash,role,first_name,last_name) VALUES('t0104@example.test','x','homeowner','T','E')").run();
  const userId = Number(db.prepare("SELECT id FROM users WHERE email='t0104@example.test'").get().id);

  // Domain events are durable and processable.
  const eventId = n.recordDomainEvent('job.quoted', { jobId: 42 });
  const event = db.prepare('SELECT * FROM notification_events WHERE id=?').get(eventId);
  check('domain event persisted with payload', !!event && event.event_type === 'job.quoted' && JSON.parse(event.payload_json).jobId === 42 && !event.processed_at);
  n.markDomainEventProcessed(eventId);
  check('domain event can be marked processed', !!db.prepare('SELECT processed_at FROM notification_events WHERE id=?').get(eventId).processed_at);

  // Outbox enqueue starts pending with normalized priority and links the event.
  const nid = n.enqueueNotification({ userId, title: 'Angebot bereit', body: 'Bitte prüfen', href: '/app/jobs/1', kind: 'quote', priority: 99, eventId });
  const queued = db.prepare('SELECT * FROM notifications WHERE id=?').get(nid);
  check('enqueued notification is pending in_app', queued.status === 'pending' && queued.channel === 'in_app');
  check('priority clamps to 1..9', queued.priority === 9 && queued.event_id === eventId);

  // Dispatch delivers in-app immediately and exactly once.
  let result = n.dispatchDueNotifications();
  check('in-app dispatch sends', result.sent === 1);
  result = n.dispatchDueNotifications();
  check('dispatch is idempotent (nothing double-sent)', result.sent === 0);
  check('sent row exists once', db.prepare("SELECT COUNT(*) c FROM notifications WHERE status='sent' AND id=?").get(nid).c === 1);

  // Read-state transitions stay idempotent.
  check('first mark-read wins', n.markNotificationRead(userId, nid) === true);
  check('second mark-read is a no-op', n.markNotificationRead(userId, nid) === false);
  check('unread toggle works', n.markNotificationUnread(userId, nid) === true);

  // Unknown channel: retry with backoff, then dead-letter.
  const badId = n.enqueueNotification({ userId, title: 'extern', kind: 'info', channel: 'in_app' });
  db.prepare("UPDATE notifications SET channel='email' WHERE id=?").run(badId);
  let r = n.dispatchDueNotifications(Date.now());
  check('failed attempt schedules retry', r.retried === 1);
  const attempt1 = db.prepare('SELECT retry_count,next_retry_at FROM notifications WHERE id=?').get(badId);
  check('retry counter incremented', attempt1.retry_count === 1 && attempt1.next_retry_at > new Date().toISOString());
  r = n.dispatchDueNotifications(Date.now());
  check('not due yet -> untouched', r.retried === 0 && r.dead === 0);
  const dueAt = db.prepare('SELECT next_retry_at FROM notifications WHERE id=?').get(badId).next_retry_at;
  r = n.dispatchDueNotifications(new Date(dueAt).getTime() + 1000);
  check('second failure retries again', r.retried === 1);
  const attempt2 = db.prepare('SELECT retry_count,next_retry_at FROM notifications WHERE id=?').get(badId);
  check('backoff grows exponentially', attempt2.retry_count === 2 && attempt2.next_retry_at > attempt1.next_retry_at);
  const dueAt2 = db.prepare('SELECT next_retry_at FROM notifications WHERE id=?').get(badId).next_retry_at;
  r = n.dispatchDueNotifications(new Date(dueAt2).getTime() + 1000);
  check('third failure dead-letters', r.dead === 1 && db.prepare("SELECT status,retry_count FROM notifications WHERE id=?").get(badId).status === 'dead');
  r = n.dispatchDueNotifications(Date.now());
  check('dead letters are never re-dispatched', r.dead === 0 && r.sent === 0 && r.retried === 0);

  // Legacy createNotification keeps working on top of the unified stack.
  n.createNotification(userId, 'Legacy', 'body', '/app');
  check('legacy insert still delivered', db.prepare("SELECT COUNT(*) c FROM notifications WHERE title='Legacy' AND status='sent'").get().c === 1);
} catch (error) {
  failures.push(`module load failed :: ${error.message}`);
  console.error(error);
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
