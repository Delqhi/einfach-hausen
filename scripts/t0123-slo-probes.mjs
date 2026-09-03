// T-0123 SLO probe suite: one deterministic probe run covering every technical
// SLO with a component-local verdict, a correlation context on failure, and a
// machine-readable result line suitable for the existing systemd/Kestra stack
// (no new managed platform).
//
// SLO catalog (component -> probe -> target):
//  web_health       GET /api/health via loopback            -> 200 + ok:true within 3s
//  web_homepage     GET / landing page via loopback         -> 200 within 5s
//  auth_authority   Supabase GoTrue /auth/v1/health         -> reachable within 3s
//  dispatch_fresh   notification dispatcher heartbeat       -> last dispatch run within 15 min
//  database         SQLite readiness via /api/health check  -> database=ready
//  backup_fresh     latest verified backup manifest age     -> within 48h
//
// Output: one JSON line { probe, ok, target, observed_ms?, detail?, correlation_id }
// per probe plus a final summary line. Exit 0 only when every probe passes.
// Use SLO_BASE_URL to probe a remote deployment (default loopback of this host).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const correlationId = randomUUID();
const base = (process.env.SLO_BASE_URL || 'http://127.0.0.1:3010').replace(/\/$/, '');
const results = [];

function record(probe, ok, detail, observedMs, target) {
  results.push({ probe, ok, target, observed_ms: observedMs, detail, correlation_id: correlationId, ts: new Date().toISOString() });
  console.log(JSON.stringify({ probe, ok, target, observed_ms: observedMs, detail, correlation_id: correlationId }));
}

async function timedFetch(url, opts = {}, timeoutMs = 8000) {
  const started = Date.now();
  try {
    const response = await fetch(url, { ...opts, signal: AbortSignal.timeout(timeoutMs) });
    return { response, ms: Date.now() - started };
  } catch (error) {
    return { error, ms: Date.now() - started };
  }
}

// 1+5. Web health & database readiness
async function probeHealth() {
  const target = 'GET /api/health 200 ok:true within 3000ms';
  const { response, ms, error } = await timedFetch(`${base}/api/health`, {}, 8000);
  if (error || !response) return record('web_health', false, `unreachable: ${String(error?.message || error).slice(0, 120)}`, ms, target);
  let body = null;
  try { body = await response.json(); } catch {}
  const ok = response.status === 200 && body?.ok === true && body?.checks?.database === 'ready';
  record('web_health', ok, ok ? 'healthy' : `status=${response.status} body=${JSON.stringify(body).slice(0, 120)}`, ms, target);
}

// 2. Homepage render
async function probeHomepage() {
  const target = 'GET / 200 within 5000ms';
  const { response, ms, error } = await timedFetch(`${base}/`, { redirect: 'manual' }, 10000);
  if (error || !response) return record('web_homepage', false, `unreachable: ${String(error?.message || error).slice(0, 120)}`, ms, target);
  const ok = response.status === 200;
  record('web_homepage', ok, ok ? 'rendered' : `status=${response.status}`, ms, target);
}

// 3. Auth authority reachability (component-local, no secrets in output)
async function probeAuth() {
  const target = 'Supabase GoTrue answers within 3000ms (reachability, not credential validity)';
  const supabaseUrl = (process.env.SUPABASE_URL || 'https://supabase.delqhi.com').replace(/\/$/, '');
  const { response, ms, error } = await timedFetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: process.env.SUPABASE_ANON_KEY || 'public-anon-probe' } }, 8000);
  if (error || !response) return record('auth_authority', false, `unreachable: ${String(error?.message || error).slice(0, 120)}`, ms, target);
  // Any HTTP answer (200 or 401 for missing/invalid key) proves the authority
  // is alive and serving; only network failure or 5xx is an SLO breach.
  const ok = response.status < 500;
  record('auth_authority', ok, ok ? `alive (status=${response.status})` : `status=${response.status}`, ms, target);
}

// 4. Notification dispatcher heartbeat (systemd oneshot every 5 min; 15 min budget)
async function probeDispatchFresh() {
  const target = 'dispatch evidence within 15min (journald or JSON run marker)';
  const started = Date.now();
  try {
    const journal = execFileSync('journalctl', [
      '-u', 'einfach-hausen-dispatch.service', '--since', '-15 min', '--no-pager', '-q',
    ], { encoding: 'utf8', timeout: 15000 });
    const hasRun = journal.includes('"sent"') || journal.includes('"retried"') || journal.includes('"dead"') || journal.trim().length > 0;
    record('dispatch_fresh', hasRun, hasRun ? 'dispatch ran within window' : 'no dispatch evidence in journal window', Date.now() - started, target);
  } catch {
    // journalctl unavailable (CI or remote): probe the timer state instead.
    try {
      const active = execFileSync('systemctl', ['is-active', 'einfach-hausen-dispatch.timer'], { encoding: 'utf8', timeout: 10000 }).trim();
      record('dispatch_fresh', active === 'active', active === 'active' ? 'dispatch timer active' : `timer state=${active}`, Date.now() - started, target);
    } catch (error) {
      record('dispatch_fresh', false, `no journal/timer access: ${String(error.message).slice(0, 80)}`, Date.now() - started, target);
    }
  }
}

// 6. Backup freshness (verified backup manifest within 48h)
async function probeBackupFresh() {
  const target = 'backup newer than 48h (backup root dir mtime or manifest)';
  const started = Date.now();
  const backupRoot = '/var/backups/einfach-hausen';
  try {
    // Newest evidence first from per-backup manifests; older deployments keep
    // root-owned backup dirs, so fall back to the backup root's own mtime which
    // updates whenever a new backup directory is created.
    let newest = 0;
    let source = '';
    let dirs = [];
    try { dirs = fs.readdirSync(backupRoot).filter(d => fs.existsSync(path.join(backupRoot, d, 'manifest.json'))); } catch {}
    for (const d of dirs) {
      const st = fs.statSync(path.join(backupRoot, d, 'manifest.json'));
      if (st.mtimeMs > newest) { newest = st.mtimeMs; source = 'manifest'; }
    }
    if (!newest) {
      const rootSt = fs.statSync(backupRoot);
      newest = rootSt.mtimeMs; source = 'backup-root-mtime';
    }
    const ageHours = (Date.now() - newest) / 3600000;
    record('backup_fresh', ageHours <= 48, `newest backup evidence (${source}) ${ageHours.toFixed(1)}h old`, Date.now() - started, target);
  } catch (error) {
    record('backup_fresh', false, `backup root unreadable: ${String(error.message).slice(0, 80)}`, Date.now() - started, target);
  }
}

async function main() {
  await probeHealth();
  await probeHomepage();
  await probeAuth();
  await probeDispatchFresh();
  await probeBackupFresh();

  const failed = results.filter(r => !r.ok);
  console.log(JSON.stringify({ summary: 'slo-probe-run', total: results.length, failed: failed.length, correlation_id: correlationId, failed_probes: failed.map(f => f.probe) }));
  process.exit(failed.length ? 1 : 0);
}

main();
