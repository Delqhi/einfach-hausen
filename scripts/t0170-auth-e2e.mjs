import { execFileSync, spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { chromium } from 'playwright-core';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';

const root = process.cwd();
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0170-auth-'));
const dbPath = path.join(tmpDir, 'test.db');
const results = [];
let prodServer;
let prodLocalServer;
let devServer;
let ownerIdentity;
let providerIdentity;

function check(name, condition, detail = '') {
  const ok = Boolean(condition);
  results.push({ name, ok, detail: detail ? String(detail).slice(0, 300) : '' });
  if (!ok) throw new Error(`${name}${detail ? ` :: ${detail}` : ''}`);
  console.log(`  ok  ${name}`);
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
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.on('error', reject);
  });
}

async function startNext(mode, extraEnv = {}) {
  const port = await freePort();
  const args = mode === 'dev'
    ? [nextBin, 'dev', '-H', '127.0.0.1', '-p', String(port)]
    : [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)];
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
    ...extraEnv,
  };
  const child = spawn(process.execPath, args, { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (d) => { stdout = (stdout + d).slice(-12000); });
  child.stderr.on('data', (d) => { stderr = (stderr + d).slice(-12000); });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 160; i++) {
    if (child.exitCode !== null) throw new Error(`Next ${mode} exited before readiness: ${(stderr || stdout).slice(-1800)}`);
    try {
      const response = await fetch(`${base}/api/health`, { redirect: 'manual' });
      if (response.status < 500) return { child, base, stdout: () => stdout, stderr: () => stderr };
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  child.kill('SIGTERM');
  throw new Error(`Next ${mode} readiness timeout: ${(stderr || stdout).slice(-1800)}`);
}

async function stopNext(server) {
  if (!server?.child || server.child.exitCode !== null) return;
  server.child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => server.child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (server.child.exitCode === null) server.child.kill('SIGKILL');
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

async function createIdentity(label, appRole, metadataRole) {
  const email = `t0170-${label}-${randomUUID()}@example.invalid`;
  const password = `T0170!${randomBytes(24).toString('base64url')}`;
  const response = await adminRequest('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: metadataRole, t0170: true },
    }),
  });
  if (!response.ok) throw new Error(`Supabase admin user creation failed for ${label}: HTTP ${response.status}`);
  const user = await response.json();
  const client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const signed = await client.auth.signInWithPassword({ email, password });
  if (signed.error || !signed.data.session) throw new Error(`Real Supabase sign-in failed for ${label}`);
  const session = signed.data.session;
  let cookies = [];
  const serverClient = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll: () => cookies,
      setAll: (items) => { cookies = items.map((item) => ({ name: item.name, value: item.value })); },
    },
  });
  const set = await serverClient.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
  if (set.error) throw new Error(`SSR cookie session creation failed for ${label}`);
  check(`${label} session produces Supabase SSR auth cookie`, cookies.some((cookie) => cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')));
  return { id: user.id, email, password, appRole, cookies };
}

async function deleteIdentity(identity) {
  if (!identity?.id) return;
  try { await adminRequest(`/auth/v1/admin/users/${encodeURIComponent(identity.id)}`, { method: 'DELETE' }); } catch {}
}

function cookieHeader(cookies) {
  return cookies.map(({ name, value }) => `${name}=${value}`).join('; ');
}

function tamperedCookieHeader(cookies) {
  let changed = false;
  return cookies.map(({ name, value }) => {
    if (!changed && name.startsWith('sb-') && name.includes('-auth-token')) {
      changed = true;
      const replacement = value.endsWith('x') ? 'y' : 'x';
      return `${name}=${value.slice(0, -1)}${replacement}`;
    }
    return `${name}=${value}`;
  }).join('; ');
}

async function req(base, pathname, cookie = '', init = {}) {
  const headers = { ...(init.headers || {}) };
  if (cookie) headers.Cookie = cookie;
  return await fetch(`${base}${pathname}`, { ...init, headers, redirect: 'manual' });
}

function isLoginRedirect(response) {
  const location = response.headers.get('location') || '';
  return [307, 308, 303].includes(response.status) && location.includes('/login');
}

async function deniedTo(response, target, forbiddenContent = null) {
  const location = response.headers.get('location') || '';
  if ([307, 308, 303].includes(response.status) && (location === target || location.startsWith(`${target}?`) || location.endsWith(target))) {
    return { ok: true, detail: `${response.status} ${location}` };
  }
  if (response.status !== 200) return { ok: false, detail: `${response.status} ${location}` };
  const body = await response.text();
  const streamedRedirect = body.includes(`NEXT_REDIRECT;replace;${target};`) && body.includes(`url=${target}`);
  const leaked = forbiddenContent ? forbiddenContent.test(body) : false;
  return { ok: streamedRedirect && !leaked, detail: `HTTP 200 streamedRedirect=${streamedRedirect} protectedContent=${leaked} bytes=${body.length}` };
}

async function allowedWithContent(response, expectedContent) {
  if (response.status !== 200) return { ok: false, detail: `HTTP ${response.status} location=${response.headers.get('location') || ''}` };
  const body = await response.text();
  const redirected = body.includes('NEXT_REDIRECT;');
  const expected = expectedContent.test(body);
  return { ok: !redirected && expected, detail: `HTTP 200 redirected=${redirected} expectedContent=${expected} bytes=${body.length}` };
}

async function failsClosed(response, forbiddenContent) {
  if (response.status >= 400) return { ok: true, detail: `HTTP ${response.status}` };
  const body = await response.text();
  const leaked = forbiddenContent.test(body);
  const serverRejected = body.includes('Local auth is disabled in production') || body.includes('data-dgst=') || body.includes('NEXT_REDIRECT;');
  return { ok: !leaked && serverRejected, detail: `HTTP ${response.status} serverRejected=${serverRejected} protectedContent=${leaked} bytes=${body.length}` };
}

function seedUser(db, email, role, authSubject = null) {
  const result = db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name,auth_subject) VALUES(?,?,?,?,?,?)')
    .run(email, 'not-used-by-supabase', role, role === 'homeowner' ? 'Owner' : 'Provider', 'T0170', authSubject);
  const id = Number(result.lastInsertRowid);
  if (role === 'homeowner') db.prepare('INSERT INTO homeowner_profiles(user_id,postcode,address) VALUES(?,?,?)').run(id, '10115', 'T0170 Test');
  else db.prepare('INSERT INTO provider_profiles(user_id,business_name) VALUES(?,?)').run(id, 'T0170 Provider');
  return id;
}

async function run() {
  console.log('[T-0170] OCI SIN Supabase health');
  for (const relative of ['src/app/login/page.tsx', 'src/app/profil/page.tsx', 'src/app/welcome/page.tsx', 'src/components/AuthContext.tsx']) {
    const source = fs.readFileSync(path.join(root, relative), 'utf8');
    check(`${relative} does not derive app role from user_metadata`, !/user_metadata\?\.role|user_metadata\.role/.test(source));
  }
  const authHealth = await fetch(`${supabaseUrl}/auth/v1/health`, { headers: { apikey: anonKey } });
  check('real OCI Supabase Auth health', authHealth.status === 200, `HTTP ${authHealth.status}`);
  const storageHealth = await fetch(`${supabaseUrl}/storage/v1/status`);
  check('real OCI Supabase Storage health', storageHealth.status === 200, `HTTP ${storageHealth.status}`);
  const dbReady = execFileSync('docker', ['exec', 'supabase-db', 'pg_isready'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  check('real OCI Supabase Postgres reachable', /accepting connections/i.test(dbReady));
  const poolerState = JSON.parse(execFileSync('docker', ['inspect', '-f', '{{json .State}}', 'supabase-pooler'], { encoding: 'utf8' }));
  check('real OCI Supavisor/pooler running', poolerState.Status === 'running' && (!poolerState.Health || poolerState.Health.Status === 'healthy'));

  console.log('\n[T-0170] Creating exactly one Owner and one Provider test identity');
  ownerIdentity = await createIdentity('owner', 'homeowner', 'provider');
  providerIdentity = await createIdentity('provider', 'provider', 'homeowner');
  const ownerCookie = cookieHeader(ownerIdentity.cookies);
  const providerCookie = cookieHeader(providerIdentity.cookies);

  prodServer = await startNext('production');

  console.log('\n[T-0170] Mandatory behavioral cases');
  let response = await req(prodServer.base, '/app');
  check('1 unauthenticated /app denied/login', isLoginRedirect(response), `${response.status} ${response.headers.get('location')}`);
  response = await req(prodServer.base, '/pro');
  check('2 unauthenticated /pro denied/login', isLoginRedirect(response), `${response.status} ${response.headers.get('location')}`);

  // Unknown Provider identity first: this request also initializes the throwaway application DB.
  response = await req(prodServer.base, '/pro', providerCookie);
  let denial = await deniedTo(response, '/login', /Aktiver Vertragspartner|Neue Anfragen|Meine zugewiesenen Aufträge|Guten Tag/);
  check('7/15 unknown real Supabase identity fails closed before app mapping', denial.ok, denial.detail);

  const db = new Database(dbPath);
  const ownerId = seedUser(db, ownerIdentity.email, 'homeowner', '00000000-0000-4000-8000-000000000170');

  // A verified email that points at an already-bound account must never steal the mapping.
  response = await req(prodServer.base, '/app', ownerCookie);
  denial = await deniedTo(response, '/login', /Was ist bei deinem Haus gerade wichtig|Deine Hausakte|Hallo,/);
  check('14 email/pre-bound collision cannot bind wrong app identity', denial.ok, denial.detail);
  check('14 collision leaves existing auth_subject unchanged', db.prepare('SELECT auth_subject FROM users WHERE id=?').get(ownerId).auth_subject === '00000000-0000-4000-8000-000000000170');
  db.prepare('UPDATE users SET auth_subject=NULL WHERE id=?').run(ownerId);

  response = await req(prodServer.base, '/app', ownerCookie);
  let allowed = await allowedWithContent(response, /Was ist bei deinem Haus gerade wichtig|Deine Hausakte|Hallo,/);
  check('3 real Supabase homeowner -> /app allowed', allowed.ok, allowed.detail);
  check('15 first verified request binds auth_subject', db.prepare('SELECT auth_subject FROM users WHERE id=?').get(ownerId).auth_subject === ownerIdentity.id);

  // user_metadata says provider, while application authority says homeowner.
  response = await req(prodServer.base, '/pro', ownerCookie);
  denial = await deniedTo(response, '/app', /Aktiver Vertragspartner|Neue Anfragen|Meine zugewiesenen Aufträge|Guten Tag/);
  check('5 homeowner -> /pro forbidden', denial.ok, denial.detail);
  check('13 user_metadata.role manipulation gives no provider privilege', denial.ok, denial.detail);

  // Stable subject mapping must survive email changes after the one-time migration bridge.
  const ownerOriginalEmail = ownerIdentity.email;
  db.prepare('UPDATE users SET email=? WHERE id=?').run(`mapped-${randomUUID()}@example.invalid`, ownerId);
  response = await req(prodServer.base, '/app', ownerCookie);
  allowed = await allowedWithContent(response, /Was ist bei deinem Haus gerade wichtig|Deine Hausakte|Hallo,/);
  check('15 mapped auth_subject remains authoritative on follow-up', allowed.ok, allowed.detail);
  db.prepare('UPDATE users SET email=? WHERE id=?').run(ownerOriginalEmail, ownerId);

  const providerId = seedUser(db, providerIdentity.email, 'provider');
  response = await req(prodServer.base, '/pro', providerCookie);
  allowed = await allowedWithContent(response, /Keinem Unternehmen zugeordnet|Partnervertrag noch nicht aktiv|Unternehmensprüfung ausstehend|Aktiver Vertragspartner|Neue Anfragen/);
  check('4 real Supabase provider -> /pro allowed', allowed.ok, allowed.detail);
  check('15 provider auth_subject bound stably', db.prepare('SELECT auth_subject FROM users WHERE id=?').get(providerId).auth_subject === providerIdentity.id);
  response = await req(prodServer.base, '/app', providerCookie);
  denial = await deniedTo(response, '/pro', /Was ist bei deinem Haus gerade wichtig|Deine Hausakte|Hallo,/);
  check('6 provider -> /app forbidden', denial.ok, denial.detail);
  check('13 provider user_metadata.role manipulation gives no homeowner privilege', denial.ok, denial.detail);

  response = await req(prodServer.base, '/app', tamperedCookieHeader(ownerIdentity.cookies));
  denial = await deniedTo(response, '/login', /Was ist bei deinem Haus gerade wichtig|Deine Hausakte|Hallo,/);
  check('7 invalid Supabase session denied', denial.ok, denial.detail);

  const localToken = randomBytes(32).toString('hex');
  db.prepare('INSERT OR REPLACE INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)')
    .run(localToken, ownerId, new Date(Date.now() + 3600_000).toISOString(), new Date().toISOString());
  response = await req(prodServer.base, '/app', `mh_session=${localToken}`);
  check('8 mh_session alone in Supabase mode denied', isLoginRedirect(response), `${response.status} ${response.headers.get('location')}`);

  // Extract the real progressive-enhancement Server Action identifier from the
  // authenticated form, then replay that exact action without any session.
  const profileHtmlResponse = await req(prodServer.base, '/app/profile', ownerCookie);
  const profileHtml = await profileHtmlResponse.text();
  const actionId = profileHtml.match(/name="(\$ACTION_ID_[^"]+)"/)?.[1];
  check('server action test resolves real saveProfileAction id', Boolean(actionId));
  const beforeName = db.prepare('SELECT first_name FROM users WHERE id=?').get(ownerId).first_name;
  const actionBody = new URLSearchParams({ firstName: 'UNAUTHORIZED_MUTATION', lastName: 'T0170', postcode: '10115', address: 'x' });
  actionBody.set(actionId, '');
  response = await req(prodServer.base, '/app/profile', '', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: actionBody.toString(),
  });
  const afterName = db.prepare('SELECT first_name FROM users WHERE id=?').get(ownerId).first_name;
  check('12 unauthenticated protected Server Action cannot mutate', response.status !== 200 && beforeName === afterName, `HTTP ${response.status}`);

  // Real Server Action logout through the rendered UI. This is intentionally the red TDD case on the old implementation.
  const executablePath = [
    '/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome',
    '/home/ubuntu/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ].find((candidate) => fs.existsSync(candidate));
  if (!executablePath) throw new Error('No Chromium binary available for T-0170 logout acceptance');
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext();
    await context.addCookies(ownerIdentity.cookies.map(({ name, value }) => ({ name, value, url: prodServer.base })));
    const page = await context.newPage();
    const profileResponse = await page.goto(`${prodServer.base}/app/profile`, { waitUntil: 'domcontentloaded' });
    check('logout precondition: authenticated profile loads', profileResponse?.status() === 200, `HTTP ${profileResponse?.status()}`);
    await page.getByRole('button', { name: 'Ausloggen' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.goto(`${prodServer.base}/app`, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(/\/login(?:\?|$)/, { timeout: 4000 }).catch(() => {});
    check('11 logout invalidates subsequent protected access', page.url().includes('/login'), page.url());
    await context.close();
  } finally {
    await browser.close();
  }

  db.close();
  await stopNext(prodServer);
  prodServer = undefined;

  // Production local auth must fail closed even if both a real Supabase cookie and a local session cookie are presented.
  prodLocalServer = await startNext('production', { AUTH_MODE: 'local' });
  response = await req(prodLocalServer.base, '/app', `${ownerCookie}; mh_session=${localToken}`);
  const localProdFailure = await failsClosed(response, /Was ist bei deinem Haus gerade wichtig|Deine Hausakte|Hallo,/);
  check('10 production + local auth fails closed', localProdFailure.ok, localProdFailure.detail);
  await stopNext(prodLocalServer);
  prodLocalServer = undefined;

  // The same throwaway local session is allowed only under explicit development mode.
  devServer = await startNext('dev', { AUTH_MODE: 'local', NODE_ENV: 'development' });
  response = await req(devServer.base, '/app', `mh_session=${localToken}`);
  check('9 local auth works only in development', response.status === 200, `HTTP ${response.status}`);
  await stopNext(devServer);
  devServer = undefined;

  const required = [
    '1 unauthenticated /app denied/login', '2 unauthenticated /pro denied/login',
    '3 real Supabase homeowner -> /app allowed', '4 real Supabase provider -> /pro allowed',
    '5 homeowner -> /pro forbidden', '6 provider -> /app forbidden', '7 invalid Supabase session denied',
    '8 mh_session alone in Supabase mode denied', '9 local auth works only in development',
    '10 production + local auth fails closed', '11 logout invalidates subsequent protected access',
    '12 unauthenticated protected Server Action cannot mutate',
    '13 user_metadata.role manipulation gives no provider privilege',
    '14 email/pre-bound collision cannot bind wrong app identity',
    '15 mapped auth_subject remains authoritative on follow-up',
  ];
  for (const name of required) check(`acceptance contains: ${name}`, results.some((result) => result.name === name && result.ok));
  console.log(`\nPASS T-0170 real OCI SIN Supabase behavioral acceptance (${required.length}/${required.length} mandatory cases)`);
}

try {
  await run();
} finally {
  await stopNext(prodServer);
  await stopNext(prodLocalServer);
  await stopNext(devServer);
  await deleteIdentity(ownerIdentity);
  await deleteIdentity(providerIdentity);
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
}
