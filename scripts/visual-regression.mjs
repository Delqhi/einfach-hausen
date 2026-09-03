#!/usr/bin/env node
// T-0152/T-0153 visual regression against the release-gate baseline set.
// Reuses the gate's route matrix (public routes + owner/partner app entry) and
// the pixel budget. Update baselines deliberately: npm run test:visual:update.
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
const routes = ['/', '/so-funktionierts', '/leistungen', '/preise', '/partner', '/hilfe', '/kontakt', '/login', '/welcome', '/app', '/pro'];
const baselineDir = path.join(root, 'tests', 'visual-baselines');
const actualDir = path.join(root, '.sin-gpt-web', 'evidence', 'release-gate', 'visual-actual');

function browserExecutable() {
  let bundled = '';
  try { bundled = chromium.executablePath(); } catch {}
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    typeof bundled === 'string' && fs.existsSync(bundled) ? bundled : '',
    '/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome',
    '/home/ubuntu/.cache/ms-playwright/chromium-1223/chrome-linux/chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chromium browser found; set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH');
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
  throw new Error(`Server did not become ready: ${url}`);
}

if (!fs.existsSync(path.join(root, '.next', 'BUILD_ID'))) {
  console.error('No production build found — run `npm run build` first (or use npm run release-gate).');
  process.exit(2);
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const dbPath = path.join(os.tmpdir(), `eh-visual-${randomUUID()}.db`);
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  env: { ...process.env, DATABASE_PATH: dbPath, ADMIN_PASSWORD: `VisualAdmin!${randomUUID()}`, SESSION_COOKIE_NAME: 'visual_session', NEXT_PUBLIC_APP_URL: base, AUTH_MODE: 'supabase', E2E_INSECURE_COOKIES: '1' },
  stdio: 'ignore',
});
let browser;
let failures = [];
try {
  await waitForServer(`${base}/`);
  fs.mkdirSync(baselineDir, { recursive: true });
  fs.mkdirSync(actualDir, { recursive: true });
  browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of routes) {
    const name = route === '/' ? 'home' : route.replaceAll('/', '_').replace(/^_/, '');
    const actualPath = path.join(actualDir, `${name}.png`);
    const baselinePath = path.join(baselineDir, `${name}.png`);
    let reachable = true;
    try {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
      reachable = Boolean(response && response.status() < 500);
    } catch { reachable = false; }
    if (!reachable) { failures.push(`${name}: route not reachable`); continue; }
    await page.waitForTimeout(600);
    await page.screenshot({ path: actualPath, fullPage: false });
    if (!fs.existsSync(baselinePath) || update) {
      fs.copyFileSync(actualPath, baselinePath);
      console.log(`baseline ${fs.existsSync(baselinePath) && update ? 'updated' : 'created'}: ${name}`);
      continue;
    }
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const actual = PNG.sync.read(fs.readFileSync(actualPath));
    if (baseline.width !== actual.width || baseline.height !== actual.height) {
      failures.push(`${name}: size ${baseline.width}x${baseline.height} -> ${actual.width}x${actual.height}`);
      continue;
    }
    const diff = new PNG({ width: baseline.width, height: baseline.height });
    const changed = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, { threshold: 0.1 });
    const ratio = changed / (baseline.width * baseline.height);
    if (ratio > budget) failures.push(`${name}: ${(ratio * 100).toFixed(2)}% pixels (budget ${budget * 100}%)`);
  }
  await context.close();
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
  for (const suffix of ['', '-wal', '-shm']) { try { fs.rmSync(dbPath + suffix, { force: true }); } catch {} }
}
console.log(failures.length ? `FAIL: ${failures.join('; ')}` : `visual regression: all ${routes.length} routes within budget`);
process.exit(failures.length ? 1 : 0);
