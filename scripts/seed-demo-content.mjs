#!/usr/bin/env node
/**
 * Demo-Content-Seed (befristete Demo-Phase, siehe docs/DEMO_ACCOUNTS.md).
 *
 * Befuellt NUR die verifizierten Demo-Identitaeten
 *   kunde@demo.einfachhausen.de (id 7, homeowner) und
 *   handwerker@demo.einfachhausen.de (id 8, provider)
 * mit koharenten Demo-Daten (Jobs, Quotes, Termine, Wartungen, Kontakt,
 * Nachrichten, Mitteilungen, Review). Demo-reservierte Ids: >= 9000.
 *
 * Fail-closed: jede Vorbedingung wird VOR dem ersten Write geprueft;
 * Kollisionen (fremde Zeilen auf Demo-Ids) brechen ab. INSERT OR IGNORE
 * allein wuerde Kollisionen verschlucken — deshalb Readback-Verifikation
 * jeder Beziehung nach dem Seed. Idempotent und re-run-sicher.
 * Niemals: echte Kunden-/Legacy-Daten anfassen (ids 1-6,9,10, tasks 1-2).
 *
 * Gebrauch: DATABASE_PATH=/var/lib/einfach-hausen/einfach-hausen.db node scripts/seed-demo-content.mjs [--check]
 *   --check: nur Vorbedingungen pruefen, keine Writes.
 */
import Database from 'better-sqlite3';

const checkOnly = process.argv.includes('--check');
const dbPath = process.env.DATABASE_PATH || '/var/lib/einfach-hausen/einfach-hausen.db';
let db;
try {
  db = new Database(dbPath, checkOnly ? { readonly: true } : {});
} catch (e) {
  console.error('ABORT: DB nicht oeffnbar (' + (checkOnly ? 'readonly-check' : 'readwrite') + '): ' + (e && e.message));
  process.exit(2);
}
if (!checkOnly) db.pragma('foreign_keys = ON');

const failures = [];
function assert(cond, label) {
  console.log((cond ? 'PASS ' : 'FAIL ') + label);
  if (!cond) failures.push(label);
}
const one = (sql, ...p) => { try { return db.prepare(sql).get(...p); } catch (e) { failures.push('DB-Zugriff: ' + e.message); return undefined; } };
const all = (sql, ...p) => { try { return db.prepare(sql).all(...p); } catch (e) { failures.push('DB-Zugriff: ' + e.message); return []; } };

// ---------- 1. Vorbedingungen: Demo-Identitaeten ----------
const u7 = one(`SELECT id,email,role FROM users WHERE id=7`);
assert(u7 && u7.email === 'kunde@demo.einfachhausen.de' && u7.role === 'homeowner', 'user 7 = kunde demo homeowner');
const u8 = one(`SELECT id,email,role FROM users WHERE id=8`);
assert(u8 && u8.email === 'handwerker@demo.einfachhausen.de' && u8.role === 'provider', 'user 8 = handwerker demo provider');
const prop5 = one(`SELECT id,address FROM properties WHERE id=5`);
assert(prop5 && /Ahornweg/.test(prop5.address || ''), 'property 5 = Ahornweg Demo-Immobilie');
const own5 = one(`SELECT homeowner_id FROM property_ownerships WHERE property_id=5 AND active=1`);
assert(own5 && own5.homeowner_id === 7, 'property 5 active owner = 7');
const pp8 = one(`SELECT verified FROM provider_profiles WHERE user_id=8`);
assert(pp8 && pp8.verified === 1, 'provider 8 verifiziert');
const pc8 = one(`SELECT status FROM partner_contracts WHERE provider_id=8`);
assert(pc8 && pc8.status === 'active', 'provider 8 Vertrag active');

// ---------- 2. Vorbedingungen: bestehende Demo-Zeilen gehoeren Demo-Usern ----------
for (const id of [9001, 9002, 9003]) {
  const j = one(`SELECT homeowner_id,property_id FROM jobs WHERE id=?`, id);
  assert(j && j.homeowner_id === 7 && j.property_id === 5, `job ${id} demo-owned (7/5)`);
}
const q9001 = one(`SELECT job_id,provider_id,status FROM quotes WHERE id=9001`);
assert(q9001 && q9001.job_id === 9003 && q9001.provider_id === 8, 'quote 9001 demo-owned (9003/8)');
const a1 = one(`SELECT job_id,provider_id,homeowner_id FROM appointments WHERE id=1`);
assert(a1 && a1.job_id === 9001 && a1.provider_id === 8 && a1.homeowner_id === 7, 'appointment 1 demo-owned');
for (const id of [9001, 9002]) {
  const m = one(`SELECT homeowner_id,property_id FROM maintenance_tasks WHERE id=?`, id);
  assert(m && m.homeowner_id === 7 && m.property_id === 5, `maintenance ${id} demo-owned (7/5)`);
}
// Legacy/Fremd-Besitz bleibt unberuehrt (nur Readback, nie Write):
const legacy = one(`SELECT COUNT(*) c FROM maintenance_tasks WHERE id IN (1,2) AND homeowner_id=3`);
assert(legacy && legacy.c === 2, 'legacy tasks 1-2 unangetastet (owner 3)');

// ---------- 3. Kollisions-Guards: keine fremden Zeilen auf Demo-Ids ----------
const foreignJobs = all(`SELECT id,homeowner_id FROM jobs WHERE id>=9000 AND id NOT IN (9001,9002,9003,9004,9005)`);
assert(foreignJobs.length === 0, 'keine fremden jobs auf Demo-Ids' + (foreignJobs.length ? ' ' + JSON.stringify(foreignJobs) : ''));
for (const jid of [9004, 9005]) {
  const j = one(`SELECT homeowner_id,property_id,status FROM jobs WHERE id=?`, jid);
  if (j) assert(j.homeowner_id === 7 && j.property_id === 5, `job ${jid} (falls vorhanden) demo-owned`);
}
const foreignQuotes = all(`SELECT id,job_id,provider_id FROM quotes WHERE id>=9000 AND id NOT IN (9001,9002,9003)`);
assert(foreignQuotes.length === 0, 'keine fremden quotes auf Demo-Ids');
for (const qid of [9002, 9003]) {
  const q = one(`SELECT job_id,provider_id FROM quotes WHERE id=?`, qid);
  if (q) assert(q.provider_id === 8 && [9004, 9005].includes(q.job_id), `quote ${qid} (falls vorhanden) demo-owned`);
}
for (const aid of [9001, 9002]) {
  const a = one(`SELECT job_id,provider_id,homeowner_id FROM appointments WHERE id=?`, aid);
  if (a) assert(a.provider_id === 8 && a.homeowner_id === 7, `appointment ${aid} (falls vorhanden) demo-owned`);
}
const foreignAppts = all(`SELECT id,job_id FROM appointments WHERE id>=9000 AND id NOT IN (9001,9002)`);
assert(foreignAppts.length === 0, 'keine fremden appointments auf Demo-Ids');
for (const mid of [9003, 9004]) {
  const m = one(`SELECT homeowner_id,property_id FROM maintenance_tasks WHERE id=?`, mid);
  if (m) assert(m.homeowner_id === 7 && m.property_id === 5, `maintenance ${mid} (falls vorhanden) demo-owned`);
}
const foreignMaint = all(`SELECT id,homeowner_id FROM maintenance_tasks WHERE id>=9000 AND id NOT IN (9001,9002,9003,9004)`);
assert(foreignMaint.length === 0, 'keine fremden maintenance auf Demo-Ids');

if (failures.length) {
  console.error(`\nABORT: ${failures.length} Vorbedingung(en) verletzt — keine Writes.`);
  process.exit(1);
}
if (checkOnly) {
  console.log('\nCHECK-ONLY OK: alle Vorbedingungen erfuellt, keine Writes.');
  process.exit(0);
}

// ---------- 4. Seed (idempotent) ----------
const seed = db.transaction(() => {
  db.prepare(`INSERT OR IGNORE INTO jobs(id,homeowner_id,property_id,title,description,category,postcode,status,request_kind,accepted_quote_id)
    VALUES(9004,7,5,'Heizkoerper entlueften','Alle Heizkoerper pruefen und entlueften.','Heizung','86150','in_progress','service',9002),
          (9005,7,5,'Thermostate tauschen','Alte Thermostate gegen programmierbare tauschen.','Heizung','86150','completed','service',9003)`).run();
  db.prepare(`INSERT OR IGNORE INTO quotes(id,job_id,provider_id,amount,message,status)
    VALUES(9002,9004,8,21500,'Festpreis inkl. Anfahrt.','accepted'),
          (9003,9005,8,18900,'Komplett inkl. Material.','accepted')`).run();
  db.prepare(`INSERT OR IGNORE INTO job_dispatches(job_id,provider_id,status) VALUES(9004,8,'accepted'),(9005,8,'accepted')`).run();
  db.prepare(`INSERT OR IGNORE INTO job_assignments(job_id,provider_id,contact_user_id,assigned_by_user_id)
    VALUES(9004,8,8,8),(9005,8,8,8)`).run();
  db.prepare(`INSERT OR IGNORE INTO appointments(id,job_id,provider_id,homeowner_id,contact_user_id,start_at,status)
    VALUES(9001,9004,8,7,8,datetime('now','+3 day'),'confirmed'),
          (9002,9003,8,7,8,datetime('now','+2 day'),'confirmed')`).run();
  db.prepare(`INSERT OR IGNORE INTO maintenance_tasks(id,homeowner_id,property_id,title,category,due_date,status)
    VALUES(9003,7,5,'Waermepumpe entlueften','Heizung',date('now','+21 day'),'open'),
          (9004,7,5,'Dachrinne Herbstcheck','Dach',date('now','+40 day'),'open')`).run();
  db.prepare(`INSERT OR IGNORE INTO homeowner_contacts(homeowner_id,provider_id,contact_user_id,category,last_job_id)
    VALUES(7,8,8,'Heizung & Sanit\u00e4r',9003)`).run();
  db.prepare(`INSERT INTO contact_messages(homeowner_id,provider_id,contact_user_id,sender_id,body)
    SELECT 7,8,8,8,'Guten Tag! Ihr Angebot ueber 180 \u20ac liegt vor \u2014 gern komme ich zur Besichtigung vorbei.'
    WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE homeowner_id=7 AND contact_user_id=8)`).run();
  db.prepare(`INSERT INTO contact_messages(homeowner_id,provider_id,contact_user_id,sender_id,body)
    SELECT 7,8,8,7,'Sehr gern, passt Ihnen Donnerstag? Die Heizung macht morgens Geraeusche.'
    WHERE (SELECT COUNT(*) FROM contact_messages WHERE homeowner_id=7 AND contact_user_id=8) < 2`).run();
  db.prepare(`INSERT INTO notifications(user_id,kind,title,body,href)
    SELECT 7,'quote','Neues Angebot eingetroffen','Demo-Betrieb hat 180 \u20ac fuer Badarmatur angeboten.','/app/jobs/9003'
    WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id=7 AND href='/app/jobs/9003')`).run();
  db.prepare(`INSERT INTO notifications(user_id,kind,title,body,href)
    SELECT 7,'appointment','Termin bestaetigt','Besichtigung in 2 Tagen.','/app/calendar'
    WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id=7 AND href='/app/calendar')`).run();
  db.prepare(`INSERT INTO notifications(user_id,kind,title,body,href)
    SELECT 8,'assignment','Neuer Auftrag zugewiesen','Heizkoerper entlueften (9004).','/pro/jobs/9004'
    WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id=8 AND href='/pro/jobs/9004')`).run();
  db.prepare(`INSERT OR IGNORE INTO reviews(job_id,homeowner_id,provider_id,rating,comment,verified)
    VALUES(9005,7,8,5,'Zuverlaessig und sauber gearbeitet.',1)`).run();
});
seed();

// ---------- 5. Readback-Verifikation ----------
const rb = [];
function rbCheck(cond, label) { console.log((cond ? 'PASS ' : 'FAIL ') + label); if (!cond) rb.push(label); }
const j9004 = one(`SELECT status,accepted_quote_id FROM jobs WHERE id=9004`);
rbCheck(j9004 && j9004.status === 'in_progress' && j9004.accepted_quote_id === 9002, 'readback job 9004 in_progress+quote');
const j9005 = one(`SELECT status,accepted_quote_id FROM jobs WHERE id=9005`);
rbCheck(j9005 && j9005.status === 'completed' && j9005.accepted_quote_id === 9003, 'readback job 9005 completed+quote');
rbCheck(one(`SELECT COUNT(*) c FROM quotes WHERE id IN (9002,9003) AND status='accepted'`).c === 2, 'readback quotes 9002/9003 accepted');
rbCheck(one(`SELECT COUNT(*) c FROM appointments WHERE id IN (9001,9002) AND status='confirmed' AND start_at > datetime('now')`).c === 2, 'readback appointments zukuenftig+confirmed');
rbCheck(one(`SELECT COUNT(*) c FROM maintenance_tasks WHERE id IN (9003,9004) AND status='open' AND due_date > date('now')`).c === 2, 'readback maintenance zukuenftig+open');
rbCheck(!!one(`SELECT 1 FROM homeowner_contacts WHERE homeowner_id=7 AND provider_id=8 AND contact_user_id=8`), 'readback kontakt 7/8/8');
rbCheck(one(`SELECT COUNT(*) c FROM contact_messages WHERE homeowner_id=7 AND contact_user_id=8`).c >= 2, 'readback thread >=2 nachrichten');
rbCheck(one(`SELECT COUNT(*) c FROM notifications WHERE user_id=7`).c >= 2, 'readback notifications owner >=2');
rbCheck(one(`SELECT COUNT(*) c FROM notifications WHERE user_id=8`).c >= 1, 'readback notifications provider >=1');
rbCheck(!!one(`SELECT 1 FROM reviews WHERE job_id=9005 AND rating=5`), 'readback review 9005');
rbCheck(one(`SELECT COUNT(*) c FROM jobs`).c >= 4, 'readback jobs gesamt konsistent (kein delete)');
rbCheck(one(`SELECT COUNT(*) c FROM users`).c >= 10, 'readback users gesamt konsistent (kein delete)');
if (rb.length) {
  console.error(`\nSEED UNVOLLSTAENDIG: ${rb.length} Readback-Check(s) verletzt.`);
  process.exit(1);
}
console.log('\nSEED OK: alle Vorbedingungen + Readbacks gruen.');
