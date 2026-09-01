#!/usr/bin/env node
// T-0152/T-0153 visual regression for the authenticated app surfaces
// (homeowner /app/* and partner /pro/*) on mobile 390 + desktop 1320.
// Deterministic fixture DB (scripts/e2e-fixtures.mjs), real Supabase identity
// per run (created + deleted), reduced motion, settled DOM.
// Baselines: tests/visual-baselines/app/. Update: --update-baselines
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const root = process.cwd();
const update = process.argv.includes('--update-baselines');
const budget = Number(process.env.GATE_PIXEL_BUDGET || 0.08);
const supabaseUrl = process.env.SUPABASE_URL || 'https://supabase.delqhi.com';
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!serviceKey) { console.error('SUPABASE_SERVICE_KEY required (identity create/cleanup).'); process.exit(2); }

const ownerRoutes = ['/app', '/app/home', '/app/jobs', '/app/messages', '/app/documents', '/app/partners', '/app/profile'];
// /pro/jobs is intentionally absent: it is a detail-only route (/pro/jobs/[id])
// with no list page and no nav entry; the provider nav links /pro/orders.
// Capturing /pro/jobs bare races the prod middleware login redirect vs the 404
// and poisoned the old baseline with a 404 screenshot (removed 2026-09-01).
const providerRoutes = ['/pro', '/pro/orders', '/pro/messages', '/pro/team', '/pro/profile'];
const viewports = [{ name: 'mobile', width: 390, height: 844 }, { name: 'desktop', width: 1320, height: 900 }];
const baselineDir = path.join(root, 'tests', 'visual-baselines', 'app');
const actualDir = path.join(root, '.sin-gpt-web', 'evidence', 'release-gate', 'app-visual-actual');

function browserExecutable() {
  let bundled = '';
  try { bundled = chromium.executablePath(); } catch {}
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    typeof bundled === 'string' && fs.existsSync(bundled) ? bundled : '',
    '/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chromium executable for app visual regression');
  return found;
}

const freePort = () => new Promise((resolve, reject) => {
  const socket = net.createServer();
  socket.unref();
  socket.on('error', reject);
  socket.listen(0, '127.0.0.1', () => { const address = socket.address(); socket.close(() => resolve(typeof address === 'object' && address ? address.port : 0)); });
});

async function waitForServer(url, timeoutMs = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { const response = await fetch(url, { redirect: 'manual' }); if (response.status < 500) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Server not ready: ${url}`);
}

async function createIdentity(email, password) {
  const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, email_confirm: true, user_metadata: { app_visual: true } }),
  });
  const data = await response.json();
  if (!data.id) throw new Error(`identity create failed: ${JSON.stringify(data).slice(0, 200)}`);
  return data.id;
}

async function deleteIdentity(id) {
  await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
}

if (!fs.existsSync(path.join(root, '.next', 'BUILD_ID'))) {
  console.error('No production build — run npm run build (release-gate builds it).');
  process.exit(2);
}

// Deterministic fixture DB with homeowner/provider/property/job data.
fs.rmSync('/tmp/eh-app-visual.db', { force: true });
fs.rmSync('/tmp/eh-app-visual.db-wal', { force: true });
fs.rmSync('/tmp/eh-app-visual.db-shm', { force: true });
const { createE2EFixture } = await import('./e2e-fixtures.mjs');
const { db } = await import('../src/lib/db.ts');
const savedDatabasePath = process.env.DATABASE_PATH;
process.env.DATABASE_PATH = '/tmp/eh-app-visual.db';
// src/lib/db.ts reads DATABASE_PATH at import; import after setting env:
const fixture = createE2EFixture(db, { namespace: 'appvisual' });
const owner = db.prepare('SELECT id,email FROM users WHERE id=?').get(fixture.homeownerId);
const provider = db.prepare('SELECT id,email FROM users WHERE id=?').get(fixture.providerId);
process.env.DATABASE_PATH = savedDatabasePath;

const password = `AppVisual!${randomUUID().replaceAll('-', '').slice(0, 16)}`;
const ownerId = await createIdentity(owner.email, password);
const providerId = await createIdentity(provider.email, password);
db.prepare('UPDATE users SET auth_subject=? WHERE id=?').run(ownerId, owner.id);
db.prepare('UPDATE users SET auth_subject=? WHERE id=?').run(providerId, provider.id);

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  env: { ...process.env, DATABASE_PATH: '/tmp/eh-app-visual.db', ADMIN_PASSWORD: `AppVisAdmin!${randomUUID()}`, SESSION_COOKIE_NAME: 'appvis_session', NEXT_PUBLIC_APP_URL: base, AUTH_MODE: 'supabase', E2E_INSECURE_COOKIES: '1', SUPABASE_URL: supabaseUrl, SUPABASE_ANON_KEY: anonKey, SUPABASE_SERVICE_ROLE_KEY: serviceKey },
  stdio: 'ignore',
});
let browser;
const failures = [];
const summary = [];
try {
  await waitForServer(`${base}/`);
  fs.mkdirSync(baselineDir, { recursive: true });
  fs.mkdirSync(actualDir, { recursive: true });
  browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });

  async function capture(role, email, routes) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await Promise.all([page.waitForURL(new RegExp(role === 'owner' ? '/app' : '/pro'), { timeout: 60000 }).catch(() => {}), page.click('button[type="submit"]')]);
    await page.waitForTimeout(4000);

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const route of routes) {
        const name = `${role}_${route.replaceAll('/', '_').replace(/^_/, '')}__${viewport.name}`;
        const actualPath = path.join(actualDir, `${name}.png`);
        const baselinePath = path.join(baselineDir, `${name}.png`);
        try {
          await page.goto(`${base}${route}`, { waitUntil: 'load', timeout: 60000 });
        } catch (error) {
          if (!/interrupted by another navigation|NS_BINDING_ABORTED|Timeout/.test(String(error))) { failures.push(`${name}: goto ${String(error).slice(0, 100)}`); continue; }
          try { await page.goto(`${base}${route}`, { waitUntil: 'load', timeout: 60000 }); } catch (retryError) { failures.push(`${name}: goto retry ${String(retryError).slice(0, 100)}`); continue; }
        }
        await page.waitForTimeout(1200);
        await page.screenshot({ path: actualPath, fullPage: false });
        if (!fs.existsSync(baselinePath) || update) {
          fs.copyFileSync(actualPath, baselinePath);
          console.log(`baseline ${update ? 'updated' : 'created'}: ${name}`);
          continue;
        }
        const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
        const actual = PNG.sync.read(fs.readFileSync(actualPath));
        if (baseline.width !== actual.width || baseline.height !== actual.height) { failures.push(`${name}: size drift`); continue; }
        const diff = new PNG({ width: baseline.width, height: baseline.height });
        const changed = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, { threshold: 0.1 });
        const ratio = changed / (baseline.width * baseline.height);
        if (ratio > budget) failures.push(`${name}: ${(ratio * 100).toFixed(2)}% (budget ${budget * 100}%)`);
      }
    }
    await context.close();
    summary.push(`${role}: ${routes.length * viewports.length} captures`);
  }

  await capture('owner', owner.email, ownerRoutes);
  await capture('provider', provider.email, providerRoutes);
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
  await deleteIdentity(ownerId).catch(() => {});
  await deleteIdentity(providerId).catch(() => {});
  for (const suffix of ['', '-wal', '-shm']) { try { fs.rmSync('/tmp/eh-app-visual.db' + suffix, { force: true }); } catch {} }
}
console.log(summary.join(' | '));
if (failures.length) { console.log(`FAILURES (${failures.length}):`); for (const failure of failures.slice(0, 12)) console.log(`  ${failure}`); process.exit(1); }
console.log('APP VISUAL PASS');
