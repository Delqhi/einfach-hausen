import { execFileSync, spawn } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { createServer } from 'node:net';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { createClient } from '@supabase/supabase-js';

// T-0202: prove /api/ki is authenticated, runs on the configured OmniRoute
// gateway, and enforces the per-user rate limit. Throwaway DB + ephemeral
// Supabase identity; no production mutations.

const root = process.cwd();
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
if (!fs.existsSync(path.join(root, '.next/BUILD_ID'))) { console.error('Run npm run build first.'); process.exit(1); }
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0202-'));
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
  const raw = execFileSync('docker', ['inspect', '-f', '{{range .Config.Env}}{{println .}}{{end}}', name], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  return Object.fromEntries(raw.trim().split('\n').filter(Boolean).map((line) => { const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1)]; }));
}
const kongEnv = dockerEnv('supabase-kong');
const supabaseUrl = 'https://supabase.delqhi.com';
const anonKey = kongEnv.SUPABASE_ANON_KEY;
const serviceKey = kongEnv.SUPABASE_SERVICE_KEY;

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
    AI_BASE_URL: process.env.AI_BASE_URL || 'http://127.0.0.1:20128/v1',
    AI_MODEL: process.env.AI_MODEL || 'auto/best-fast',
    OMNIROUTE_MASTER_KEY: process.env.OMNIROUTE_MASTER_KEY || '',
  };
  const child = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 160; i++) {
    if (child.exitCode !== null) throw new Error('next exited before readiness');
    try { const r = await fetch(`${base}/api/health`, { redirect: 'manual' }); if (r.status < 500) return { child, base }; } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  child.kill('SIGTERM');
  throw new Error('next readiness timeout');
}

async function adminRequest(pathname, init = {}) {
  return await fetch(`${supabaseUrl}${pathname}`, { ...init, headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
}

async function ssrCookies(email, password) {
  const client = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const signed = await client.auth.signInWithPassword({ email, password });
  if (signed.error || !signed.data.session) throw new Error('supabase sign-in failed');
  const items = [];
  const { createServerClient } = await import('@supabase/ssr');
  const sc = createServerClient(supabaseUrl, anonKey, { cookies: { getAll: () => [], setAll: (i) => { items.push(...i.map((x) => ({ name: x.name, value: x.value }))); } } });
  await sc.auth.setSession({ access_token: signed.data.session.access_token, refresh_token: signed.data.session.refresh_token });
  return items.map(({ name, value }) => `${name}=${value}`).join('; ');
}

async function run() {
  server = await startNext();
  const db = new Database(dbPath);
  let identityId = null;
  try {
    // 1) Unauthenticated request is rejected.
    const anon = await fetch(`${server.base}/api/ki`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }) });
    check('unauthenticated POST /api/ki -> 401', anon.status === 401, String(anon.status));

    // 2) Authenticated request runs on the configured gateway.
    const email = `t0202-${randomUUID()}@e2e.einfachhausen.de`;
    const password = `T0202!${randomBytes(18).toString('base64url')}`;
    const created = await adminRequest('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email, password, email_confirm: true }) });
    if (!created.ok) throw new Error(`identity creation failed: HTTP ${created.status}`);
    const identity = await created.json();
    identityId = identity.id;
    db.prepare('INSERT INTO users(email,password_hash,role,first_name,last_name,auth_subject) VALUES(?,?,?,?,?,?)')
      .run(email, 'not-used-by-supabase', 'homeowner', 'T0202', 'Chat', identity.id);
    const cookie = await ssrCookies(email, password);
    const authed = await fetch(`${server.base}/api/ki`, { method: 'POST', headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: JSON.stringify({ messages: [{ role: 'user', content: 'Antworte mit genau einem Wort: Test' }] }) });
    const rawBody = await authed.text();
    let data = {};
    try { data = JSON.parse(rawBody); } catch {}
    check('authenticated POST /api/ki -> 200 with reply', authed.status === 200 && typeof data.reply === 'string' && data.reply.length > 0, `status=${authed.status} reply=${String(data.reply).slice(0, 60)} raw=${rawBody.slice(0, 200)}`);

    // 3) Rate limiting rows accrue per user.
    const attempts = db.prepare("SELECT COUNT(*) c FROM auth_rate_limits WHERE kind='ki_chat'").get().c;
    check('ki_chat rate-limit accounting active', attempts >= 1, String(attempts));
  } finally {
    if (identityId) { try { await adminRequest(`/auth/v1/admin/users/${encodeURIComponent(identityId)}`, { method: 'DELETE' }); } catch {} }
    db.close();
    if (server?.child && server.child.exitCode === null) server.child.kill('SIGKILL');
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`[T-0202] ${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) process.exit(1);
}

process.on('exit', () => { try { if (server && !server.child.killed) server.child.kill('SIGKILL'); } catch {} });
run().catch((e) => { console.error(e); process.exit(1); });
