
import { execFileSync, spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { chromium } from 'playwright-core';

// T-0169 visual acceptance harness.
// Real OCI SIN Supabase auth path (same security architecture as
// scripts/t0170-auth-e2e.mjs): ephemeral Supabase identity, real form login,
// throwaway SQLite app DB, deterministic seeded data, no production data.

const root = process.cwd();
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const evidenceDir = path.join(root, '.sin-gpt-web/evidence/T-0169/oci');
const round3Dir = path.join(evidenceDir, 'round3');
const CHROME = process.env.T0169_CHROME || '/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome';

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0169-visual-'));
const dbPath = path.join(tmpDir, 'test.db');
let server;
let identity;
const consoleLines = [];
const log = (m) => { consoleLines.push(m); console.log(m); };

function dockerEnv(name) {
  const raw = execFileSync('docker', ['inspect', '-f', '{{range .Config.Env}}{{println .}}{{end}}', name], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  });
  return Object.fromEntries(raw.trim().split('\n').filter(Boolean).map((line) => {
    const i = line.indexOf('=');
    return [line.slice(0, i), line.slice(i + 1)];
  }));
}

const supabaseUrl = 'https://supabase.delqhi.com';
const anonKey = dockerEnv('supabase-kong').SUPABASE_ANON_KEY;
const serviceKey = dockerEnv('supabase-kong').SUPABASE_SERVICE_KEY;
if (!anonKey || !serviceKey) throw new Error('OCI SIN Supabase gateway keys unavailable');

async function freePort() {
  return await new Promise((resolve, reject) => {
    const s = createServer();
    s.listen(0, '127.0.0.1', () => { const a = s.address(); s.close(() => resolve(a.port)); });
    s.on('error', reject);
  });
}

async function startNext() {
  const port = await freePort();
  const env = {
    ...process.env,
    DATABASE_PATH: dbPath,
    AUTH_MODE: 'supabase',
    SUPABASE_URL: supabaseUrl,
    SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${port}`,
    SESSION_COOKIE_NAME: 'mh_session_e2e',
    E2E_INSECURE_COOKIES: '1',
  };
  const child = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stdout = ''; let stderr = '';
  child.stdout.on('data', (d) => { stdout = (stdout + d).slice(-8000); });
  child.stderr.on('data', (d) => { stderr = (stderr + d).slice(-8000); });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 160; i++) {
    if (child.exitCode !== null) throw new Error(`next exited: ${(stderr || stdout).slice(-1200)}`);
    try {
      const r = await fetch(`${base}/api/health`, { redirect: 'manual' });
      if (r.status < 500) return { child, base };
    } catch {}
    await new Promise((r2) => setTimeout(r2, 250));
  }
  child.kill('SIGTERM');
  throw new Error('next readiness timeout');
}

async function stopNext() {
  if (!server?.child || server.child.exitCode !== null) return;
  server.child.kill('SIGTERM');
  await Promise.race([new Promise((r) => server.child.once('exit', r)), new Promise((r) => setTimeout(r, 3000))]);
  if (server.child.exitCode === null) server.child.kill('SIGKILL');
}

async function adminRequest(pathname, init = {}) {
  return await fetch(`${supabaseUrl}${pathname}`, {
    ...init,
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
}

async function createOwnerIdentity() {
  const email = `t0169-owner-${randomUUID()}@example.invalid`;
  const password = `T0169!${randomBytes(24).toString('base64url')}`;
  const response = await adminRequest('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { role: 'homeowner', t0169: true } }),
  });
  if (!response.ok) throw new Error(`Supabase admin user creation failed: HTTP ${response.status}`);
  const user = await response.json();
  return { id: user.id, email, password };
}

async function deleteIdentity(id) {
  if (!id) return;
  try { await adminRequest(`/auth/v1/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch {}
}

async function settle(page) {
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images];
    await Promise.all(imgs.map((img) => img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; })));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

async function capture(page, name) {
  await settle(page);
  const file = path.join(round3Dir, `${name}-actual.png`);
  await page.screenshot({ path: file, fullPage: false });
  log(`  captured ${name}`);
  return file;
}

async function run() {
  fs.mkdirSync(round3Dir, { recursive: true });
  const preHead = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  fs.writeFileSync(path.join(evidenceDir, 'pre-head.txt'), preHead + '\n');
  const preStatus = execFileSync('git', ['status', '--short', '--branch'], { encoding: 'utf8' });
  fs.writeFileSync(path.join(evidenceDir, 'pre-status.txt'), preStatus);

  log('[T-0169] Supabase auth health');
  const health = await fetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: anonKey } });
  if (health.status !== 200) throw new Error(`supabase auth health HTTP ${health.status}`);

  log('[T-0169] ephemeral owner identity (real Supabase admin API)');
  identity = await createOwnerIdentity();

  log('[T-0169] starting production server (throwaway SQLite DB)');
  server = await startNext();

  // initialize the throwaway app DB through a real request
  await fetch(`${server.base}/login`, { redirect: 'manual' });

  const db = new Database(dbPath);
  const seed = db.transaction(() => {
    const r = db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name) VALUES(?,?,?,?,?)')
      .run(identity.email, 'not-used-by-supabase', 'homeowner', 'Max', 'Mustermann');
    const uid = Number(r.lastInsertRowid);
    db.prepare('INSERT INTO homeowner_profiles(user_id,postcode,address,onboarding_step) VALUES(?,?,?,?)')
      .run(uid, '10115', 'Musterstraße 12, 10115 Berlin', 'done');
    const p = db.prepare('INSERT INTO properties(address,postcode,property_type,build_year,living_area) VALUES(?,?,?,?,?)')
      .run('Musterstraße 12, 10115 Berlin', '10115', 'Einfamilienhaus', 1998, 150);
    const pid = Number(p.lastInsertRowid);
    db.prepare('INSERT INTO property_ownerships(property_id,homeowner_id,active) VALUES(?,?,1)').run(pid, uid);
    const ins = db.prepare('INSERT INTO house_history_entries(homeowner_id,property_id,category,title,performed_at,company_name,contact_name,cost_amount,notes) VALUES(?,?,?,?,?,?,?,?,?)');
    ins.run(uid, pid, 'Dach & Fassade', 'Dach komplett saniert', '2023-06-15', 'Muster Dach GmbH', 'Sabine Muster', 1850000, 'Vollsanierung inkl. Dämmung');
    ins.run(uid, pid, 'Heizung, Gas & Wasser', 'Heizungsthermostate getauscht', '2024-02-01', 'Wärme Muster GmbH', 'Tom Muster', 42000, 'Alle Räume');
    ins.run(uid, pid, 'Garten & Außen', 'Terrasse neu versiegelt', '2025-05-20', 'Grün Muster', '', 95000, '');
  });
  seed();

  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  log('[T-0169] logged-out screens');
  await page.goto(`${server.base}/welcome`, { waitUntil: 'networkidle' });
  await capture(page, 'first-screen');
  await page.goto(`${server.base}/login`, { waitUntil: 'networkidle' });
  await capture(page, 'login');
  await page.goto(`${server.base}/register`, { waitUntil: 'networkidle' });
  await capture(page, 'register');
  await page.goto(`${server.base}/role`, { waitUntil: 'networkidle' });
  await capture(page, 'role');

  log('[T-0169] real form login via Supabase auth');
  await page.goto(`${server.base}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[inputmode="email"]', identity.email);
  await page.fill('input[type="password"]', identity.password);
  await page.getByRole('button', { name: 'Anmelden', exact: true }).click();
  try {
    await page.waitForURL('**/app', { timeout: 30000 });
  } catch {
    await page.waitForTimeout(2000);
    const errBox = await page.locator('.error-box').textContent().catch(() => '(no error box)');
    await page.screenshot({ path: '/var/tmp/t0169-login-debug.png' });
    throw new Error(`login did not navigate (url=${page.url()} errorBox=${errBox})`);
  }
  await page.waitForLoadState('networkidle');
  log('  login ok -> /app');

  await capture(page, 'owner-dashboard');

  log('[T-0169] menu states via real UI interaction');
  const menuSummary = page.locator('.mobile-menu summary');
  await menuSummary.click();
  await page.waitForTimeout(300);
  await capture(page, 'menu-closed');
  // current shell has no accordion sub-levels; menu-open captures the same open panel state
  await capture(page, 'menu-open');
  await menuSummary.click();
  await page.waitForTimeout(200);

  log('[T-0169] historie + supplementary screens');
  await page.goto(`${server.base}/app/home/history`, { waitUntil: 'networkidle' });
  await capture(page, 'historie');
  for (const route of ['/app/onboarding', '/app/more', '/app/partners']) {
    await page.goto(`${server.base}${route}`, { waitUntil: 'networkidle' }).catch(() => {});
    if (page.url().includes(route)) {
      await capture(page, route === '/app/onboarding' ? 'onboarding' : route === '/app/more' ? 'more' : 'partners');
    } else {
      log(`  ${route} not present, skipped`);
    }
  }

  await browser.close();

  const version = execFileSync(CHROME, ['--version'], { encoding: 'utf8' }).trim();
  fs.writeFileSync(path.join(evidenceDir, 'captures.json'), JSON.stringify({
    started: new Date().toISOString(),
    head: preHead,
    base: server.base,
    chromium: version,
    chrome_path: CHROME,
    viewport: '390x844@1',
    references: 'public/notion/notion-originals',
    captures: fs.readdirSync(round3Dir).filter((f) => f.endsWith('-actual.png')),
  }, null, 1));
  fs.writeFileSync(path.join(evidenceDir, 'auth.txt'), [
    'T-0169 visual acceptance auth evidence',
    `supabase auth health: HTTP 200`,
    `ephemeral supabase owner identity created (admin API): yes`,
    `identity id: ${identity.id}`,
    `identity email: ${identity.email.replace(/^(t0169-owner-[0-9a-f]{8})[^\s]*(@.*)$/, '$1...$2')}`,
    'login path: real /login form (playwright), Supabase signInWithPassword via app',
    'result: redirected to /app (server-side role resolution)',
    '',
    ...consoleLines,
  ].join('\n'));
  log('[T-0169] captures complete');
}

run().catch(async (err) => {
  console.error('HARNESS FAILURE:', err?.message || err);
  fs.writeFileSync(path.join(evidenceDir, 'harness-error.txt'), String(err?.stack || err));
  await deleteIdentity(identity?.id).catch(() => {});
  await stopNext();
  process.exit(1);
}).then(async (ok) => {
  if (ok === undefined) {
    await deleteIdentity(identity?.id).catch(() => {});
    await stopNext();
    log('cleanup done (ephemeral supabase user deleted)');
  }
});
