import { execFileSync, spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { chromium } from 'playwright-core';

// T-0200: prove the production register -> Supabase identity -> SSR session ->
// authenticated /app chain plus the legacy email-match binding, against a
// throwaway application database and ephemeral Supabase identities.

const root = process.cwd();
// Health storage check requires the uploads dir; production bootstraps it via deploy/update-on-oci.sh.
fs.mkdirSync(path.join(root, 'public', 'uploads'), { recursive: true });
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
if (!fs.existsSync(path.join(root, '.next/BUILD_ID'))) {
  console.error('No production build found. Run `npm run build` first (with the Supabase build env).');
  process.exit(1);
}
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0200-'));
const dbPath = path.join(tmpDir, 'test.db');
const results = [];
let server;

function check(name, condition, detail = '') {
  const ok = Boolean(condition);
  results.push({ name, ok });
  console.log(`${ok ? '  ok  ' : '  FAIL'} ${name}${detail ? ` :: ${detail}` : ''}`);
  if (!ok) throw new Error(`${name}${detail ? ` :: ${detail}` : ''}`);
}

function dockerEnv(name) {
  const raw = execFileSync('docker', ['inspect', '-f', '{{range .Config.Env}}{{println .}}{{end}}', name], {
    encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  });
  return Object.fromEntries(raw.trim().split('\n').filter(Boolean).map((line) => {
    const i = line.indexOf('=');
    return [line.slice(0, i), line.slice(i + 1)];
  }));
}

const kongEnv = dockerEnv('supabase-kong');
const supabaseUrl = 'https://supabase.delqhi.com';
const anonKey = kongEnv.SUPABASE_ANON_KEY;
const serviceKey = kongEnv.SUPABASE_SERVICE_KEY;
if (!anonKey || !serviceKey) throw new Error('OCI SIN Supabase gateway keys are unavailable');

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
    SUPABASE_SERVICE_ROLE_KEY: serviceKey,
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    NEXT_PUBLIC_APP_URL: `http://127.0.0.1:${port}`,
    SESSION_COOKIE_NAME: 'mh_session_e2e',
    E2E_INSECURE_COOKIES: '1',
  };
  const child = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  child.stdout.on('data', (d) => { logs = (logs + d).slice(-12000); });
  child.stderr.on('data', (d) => { logs = (logs + d).slice(-12000); });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 160; i++) {
    if (child.exitCode !== null) throw new Error(`Next exited before readiness: ${logs.slice(-1800)}`);
    try {
      const r = await fetch(`${base}/api/health`, { redirect: 'manual' });
      if (r.status < 500) return { child, base };
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  child.kill('SIGTERM');
  throw new Error(`Next readiness timeout: ${logs.slice(-1800)}`);
}

async function adminRequest(pathname, init = {}) {
  return await fetch(`${supabaseUrl}${pathname}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function createIdentity(email, password) {
  const response = await adminRequest('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { t0200: true } }),
  });
  if (!response.ok) throw new Error(`Supabase admin user creation failed: HTTP ${response.status}`);
  return (await response.json());
}

async function deleteIdentity(id) {
  if (!id) return;
  try { await adminRequest(`/auth/v1/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' }); } catch {}
}

function browserExecutable() {
  const candidates = ['/usr/bin/chromium-browser', '/usr/bin/chromium', '/usr/bin/google-chrome',
    '/snap/bin/chromium', '/usr/bin/google-chrome-stable'].filter((c) => fs.existsSync(c));
  const found = candidates[0];
  if (!found) throw new Error('No Chromium-family browser found for Playwright');
  return found;
}

async function registerViaUi(page, base, email, password) {
  await page.goto(`${base}/register`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[name="firstName"]', 'T0200');
  await page.fill('input[name="lastName"]', 'Owner');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="postcode"]', '10115');
  await page.fill('input[name="address"]', 'T0200 Testweg 1');
  await Promise.all([
    page.waitForURL(/\/app\/onboarding/, { timeout: 60000 }),
    page.click('button[type="submit"]'),
  ]);
  return page.url();
}

async function loginViaUi(page, base, email, password) {
  await page.goto(`${base}/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('input[placeholder="du@example.de"]', email);
  await page.fill('input[type="password"]', password);
  await Promise.all([
    page.waitForURL(/\/app/, { timeout: 60000 }),
    page.click('button:has-text("Anmelden")'),
  ]);
  return page.url();
}

async function run() {
  console.log('[T-0200] source-contract checks');
  const authSource = fs.readFileSync(path.join(root, 'src/lib/auth.ts'), 'utf8');
  check('auth.ts establishes server-side Supabase session', authSource.includes('establishSupabaseSession'));
  const actionsSource = fs.readFileSync(path.join(root, 'src/app/actions.ts'), 'utf8');
  check('registerAction creates Supabase identity (admin.createUser)', actionsSource.includes('admin.createUser'));
  check('registerAction inserts auth_subject binding', /INSERT INTO users\(email,password_hash,role,first_name,last_name,phone,auth_subject\)/.test(actionsSource));

  server = await startNext();
  console.log(`[T-0200] next start at ${server.base} (throwaway DB ${dbPath})`);

  const db = new Database(dbPath, { readonly: false });
  const browser = await chromium.launch({ executablePath: browserExecutable(), args: ['--no-sandbox'] });
  const identities = [];

  try {
    // 1) Register through the real UI form.
    const stamp = randomUUID();
    const email1 = `t0200-owner-${stamp}@e2e.einfachhausen.de`;
    const password1 = `T0200!${randomBytes(18).toString('base64url')}`;
    const ctx1 = await browser.newContext();
    ctx1.setDefaultTimeout(60000);
    const page1 = await ctx1.newPage();
    const url1 = await registerViaUi(page1, server.base, email1, password1);
    check('register lands authenticated on /app/onboarding', url1.includes('/app/onboarding'), url1);

    const row1 = db.prepare('SELECT id,email,role,auth_subject FROM users WHERE email=?').get(email1);
    check('app row exists with role homeowner', row1?.role === 'homeowner');
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    check('app row bound to a verified Supabase subject (auth_subject uuid)', uuid.test(row1?.auth_subject || ''), row1?.auth_subject);
    identities.push(row1?.auth_subject);

    // 2) Fresh context: client-side login through the production login page.
    const ctx2 = await browser.newContext();
    ctx2.setDefaultTimeout(60000);
    const page2 = await ctx2.newPage();
    const url2 = await loginViaUi(page2, server.base, email1, password1);
    check('client-side Supabase login reaches /app', url2.includes('/app'), url2);

    // 3) Legacy binding: seeded app row (auth_subject NULL) + matching Supabase identity.
    const email3 = `t0200-legacy-${stamp}@e2e.einfachhausen.de`;
    const password3 = `T0200!${randomBytes(18).toString('base64url')}`;
    const supabaseUser = await createIdentity(email3, password3);
    identities.push(supabaseUser.id);
    db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name,auth_subject) VALUES(?,?,?,?,?,NULL)')
      .run(email3, 'not-used-by-supabase', 'homeowner', 'Legacy', 'Bind');
    const ctx3 = await browser.newContext();
    ctx3.setDefaultTimeout(60000);
    const page3 = await ctx3.newPage();
    const url3 = await loginViaUi(page3, server.base, email3, password3);
    check('legacy email-match login reaches /app', url3.includes('/app'), url3);
    await page3.waitForLoadState('networkidle').catch(() => {});
    const settledUrl = page3.url();
    const row3 = db.prepare('SELECT id,email,role,auth_subject FROM users WHERE email=?').get(email3);
    check('legacy app row bound to Supabase subject after login', row3?.auth_subject === supabaseUser.id,
      `row=${JSON.stringify(row3)} supabase=${supabaseUser.id} settledUrl=${settledUrl}`);
  } finally {
    try { await browser.close(); } catch {}
    for (const id of identities) await deleteIdentity(id);
    db.close();
    if (server?.child && server.child.exitCode === null) server.child.kill('SIGKILL');
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`[T-0200] ${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) process.exit(1);
}

process.on('exit', () => { try { if (server && !server.child.killed) server.child.kill('SIGKILL'); } catch {} });
run().catch((error) => { console.error(error); process.exit(1); });
