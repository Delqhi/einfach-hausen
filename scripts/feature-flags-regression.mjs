// T-0125 deterministic feature-flag service regression.
// Covers: fail-safe defaults, server-authoritative evaluation, environment
// safety, bounded rollout targeting (deterministic buckets), audit trail and
// authorization-boundary structure (flags never bypass auth).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

for (const suffix of ['', '-wal', '-shm']) fs.rmSync('/tmp/eh-flags.db' + suffix, { force: true });
process.env.DATABASE_PATH = '/tmp/eh-flags.db';

const { db } = await import('../src/lib/db.ts');
// feature-flags.ts imports './db' and './security/audit' (Next style); for the
// strip-types runtime we rewrite extensionless relative specifiers on the fly.
const flagsPath = new URL('../src/lib/feature-flags.ts', import.meta.url).pathname;
const auditPath = new URL('../src/lib/security/audit.ts', import.meta.url).pathname;
const srcText = fs.readFileSync(flagsPath, 'utf8');
const auditText = fs.readFileSync(auditPath, 'utf8');
const rewrite = (text) => text.replace(/(from\s*['"])(\.\.?\/[^'"]+)(['"])/g, (_m, a, s, b) => `${a}${s}.ts${b}`);
fs.writeFileSync(flagsPath, rewrite(srcText));
fs.writeFileSync(auditPath, rewrite(auditText));
let mod;
try { mod = await import(new URL('../src/lib/feature-flags.ts', import.meta.url).href); }
finally { fs.writeFileSync(flagsPath, srcText); fs.writeFileSync(auditPath, auditText); }
const { isFeatureEnabled, evaluateFlag, setFeatureEnabled, FLAG_DEFAULTS } = mod;

let checks = 0;
function t(name, fn) { fn(); checks++; }

// 1) unknown key fails safe (false) and is not creatable
t('unknown key evaluates false', () => assert.equal(isFeatureEnabled('nonexistent_flag'), false));
t('unknown key decision source=default', () => assert.equal(evaluateFlag('nonexistent_flag').source, 'default'));
t('unknown key cannot be created', () => assert.throws(() => setFeatureEnabled('nonexistent_flag', true, 'regression')));

// 2) known flag: default when no row
t('known flag without row uses definition default', () => {
  assert.equal(evaluateFlag('ki_chat').source, 'default');
  assert.equal(evaluateFlag('ki_chat').enabled, FLAG_DEFAULTS.ki_chat.default);
});

// 3) set + read roundtrip
t('enabled flag reads true', () => {
  setFeatureEnabled('ki_chat', true, 'regression');
  assert.equal(isFeatureEnabled('ki_chat'), true);
});
t('disable roundtrip', () => {
  setFeatureEnabled('ki_chat', false, 'regression');
  assert.equal(isFeatureEnabled('ki_chat'), false);
});

// 4) audit trail: updated_by persisted + admin_audit_log entry with transition
t('audit trail records transition detail', () => {
  setFeatureEnabled('ki_chat', true, 'regression-audit');
  const row = db.prepare('SELECT updated_by,enabled FROM feature_flags WHERE key=?').get('ki_chat');
  assert.equal(row.updated_by, 'regression-audit');
  assert.equal(row.enabled, 1);
  const audit = db.prepare("SELECT actor,action,target,detail FROM admin_audit_log WHERE target='ki_chat' ORDER BY id DESC LIMIT 1").get();
  assert.equal(audit.actor, 'regression-audit');
  assert.equal(audit.action, 'feature-flag');
  assert.match(audit.detail, /off -> on/);
});

// 5) bounded rollout targeting: deterministic bucket, stable per subject
t('rollout percent gates subjects deterministically', () => {
  setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: 50 });
  const decisionA = evaluateFlag('ki_chat', 'user-a');
  const decisionAagain = evaluateFlag('ki_chat', 'user-a');
  assert.equal(decisionA.source, 'rollout');
  assert.equal(decisionA.enabled, decisionAagain.enabled, 'bucket must be stable per subject');
  // Bucket math: subject bucket must equal sha256-based bucket < percent.
  const bucket = createHash('sha256').update('eh-flag:user-a').digest()[0] % 100;
  assert.equal(decisionA.enabled, bucket < 50);
});
t('rollout 100 enables everyone, 0 disables everyone', () => {
  setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: 100 });
  assert.equal(evaluateFlag('ki_chat', 'any-subject').enabled, true);
  setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: 0 });
  assert.equal(evaluateFlag('ki_chat', 'any-subject').enabled, false);
});
t('partial rollout without subject fails safe to disabled', () => {
  setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: 50 });
  assert.equal(evaluateFlag('ki_chat').enabled, false);
  assert.equal(evaluateFlag('ki_chat', '').enabled, false);
});
t('rollout percent bounds enforced', () => {
  assert.throws(() => setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: 101 }));
  assert.throws(() => setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: -1 }));
  assert.throws(() => setFeatureEnabled('ki_chat', true, 'regression', { rolloutPercent: 50.5 }));
});
t('disabled flag stays disabled regardless of rollout', () => {
  setFeatureEnabled('ki_chat', false, 'regression', { rolloutPercent: 100 });
  assert.equal(evaluateFlag('ki_chat', 'any-subject').enabled, false);
  assert.equal(evaluateFlag('ki_chat', 'any-subject').source, 'database');
});
t('rollout 100 with null percent = fully on', () => {
  setFeatureEnabled('ki_chat', true, 'regression');
  assert.equal(evaluateFlag('ki_chat', 'any').enabled, true);
  assert.equal(evaluateFlag('ki_chat', 'any').source, 'database');
});

// 6) storage failure fails safe
t('storage failure evaluates false', () => {
  const originalPrepare = db.prepare.bind(db);
  db.prepare = () => { throw new Error('disk on fire'); };
  try { assert.equal(isFeatureEnabled('ki_chat'), false); }
  finally { db.prepare = originalPrepare; }
});

// 7) authorization boundary: service exposes no auth semantics
t('service exports no auth-bypass surface', () => {
  assert.deepEqual(Object.keys(mod).sort(), ['FLAG_DEFAULTS', 'evaluateFlag', 'isFeatureEnabled', 'setFeatureEnabled']);
});

// 8) deterministic re-run stability
t('evaluation stable across repeated calls', () => {
  const a = evaluateFlag('ki_chat', 'stable-subject');
  const b = evaluateFlag('ki_chat', 'stable-subject');
  assert.deepEqual(a, b);
});

console.log(JSON.stringify({ ok: true, checks }));
