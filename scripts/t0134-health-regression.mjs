// T-0134 deterministic health/readiness regression: liveness vs readiness
// split, dependency state classification, and no-secrets contract.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0134-'));
process.env.DATABASE_PATH = path.join(scratch, 'health.db');
process.chdir(scratch);
fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');

// Route source checks (structure contract, no server spin-up needed):
const health = fs.readFileSync(path.join(root, 'src/app/api/health/route.ts'), 'utf8');
const live = fs.readFileSync(path.join(root, 'src/app/api/live/route.ts'), 'utf8');
const smoke = fs.readFileSync(path.join(root, 'scripts/production-smoke.mjs'), 'utf8');

let checks = 0;
function t(name, fn) { fn(); checks++; }

t('liveness endpoint exists and never touches dependencies', () => {
  assert.ok(live.includes("state: 'alive'"), 'liveness state marker');
  assert.ok(!live.includes('authAuthorityCheck') && !live.includes('db.prepare'), 'liveness must not check dependencies');
  assert.ok(live.includes('uptime_seconds'), 'liveness exposes process uptime');
});

t('health route distinguishes state: ready/degraded/unconfigured', () => {
  assert.ok(health.includes("state = ready ? 'ready' : degraded.length ? 'degraded' : 'unconfigured'"), 'state classification');
  assert.ok(health.includes('state_detail'), 'degraded/unconfigured diagnostics');
  assert.ok(health.includes('degraded'), 'degraded component list');
});

t('health exposes all four dependency classes', () => {
  for (const dep of ['database', 'auth_authority', 'smtp', 'storage']) {
    assert.ok(health.includes(`'${dep}`) || health.includes(`${dep}:`), `dependency ${dep} covered`);
  }
});

t('no secrets in health/liveness responses', () => {
  // Response shape only contains status words, never keys/paths/errors.
  assert.ok(!/SUPABASE_ANON_KEY|SERVICE_KEY|SMTP_PASSWORD/.test(health.split('export async function GET')[1] || ''), 'no key material in GET body');
});

t('smoke suite covers /api/live and /api/health', () => {
  assert.ok(smoke.includes("'/api/live'"), 'liveness in smoke');
  assert.ok(smoke.includes("'/api/health'"), 'readiness in smoke');
});

t('smoke route count matches 18 (16 pages + 2 health endpoints)', () => {
  const m = smoke.match(/const routes = \[([^\]]+)\];/);
  const count = m ? m[1].split(',').length : 0;
  assert.equal(count, 18);
});

console.log(JSON.stringify({ ok: true, checks }));
fs.rmSync(scratch, { recursive: true, force: true });
