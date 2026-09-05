#!/usr/bin/env node
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

const root = process.cwd();
function browserExecutable() {
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chromium browser found');
  return found;
}
const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer(); server.unref(); server.on('error', reject);
  server.listen(0, '127.0.0.1', () => { const address = server.address(); server.close(() => resolve(address.port)); });
});
async function waitForServer(url, timeoutMs = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { const response = await fetch(url); if (response.status < 500) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Server did not become ready: ${url}`);
}
if (!fs.existsSync(path.join(root, '.next', 'BUILD_ID'))) {
  throw new Error('No production build found — run npm run build first');
}
const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const dbPath = path.join(os.tmpdir(), `eh-public-nav-${randomUUID()}.db`);
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  env: { ...process.env, DATABASE_PATH: dbPath, ADMIN_PASSWORD: `NavAdmin!${randomUUID()}`, SESSION_COOKIE_NAME: 'nav_session', NEXT_PUBLIC_APP_URL: base, AUTH_MODE: 'supabase', E2E_INSECURE_COOKIES: '1' },
  stdio: 'ignore',
});
let browser;
try {
  await waitForServer(`${base}/`);
  browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  const desktop = await browser.newContext({ viewport: { width: 1320, height: 900 }, locale: 'de-DE' });
  const page = await desktop.newPage();
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const services = page.locator('nav[aria-label="Hauptnavigation"] details').filter({ has: page.locator('summary', { hasText: 'Leistungen' }) });
  await services.locator('summary').click();
  if (!(await services.getAttribute('open')) && !(await services.evaluate((el) => el.hasAttribute('open')))) throw new Error('desktop Leistungen megamenu did not open');
  const serviceLinks = services.locator('a[href^="/leistungen/"]');
  if (await serviceLinks.count() < 12) throw new Error('desktop megamenu exposes fewer than 12 service routes');
  await serviceLinks.first().focus();
  if (!(await serviceLinks.first().evaluate((el) => document.activeElement === el))) throw new Error('service link cannot receive keyboard focus');
  await page.goto(`${base}/leistungen/garten-aussenbereich`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1, name: /Garten & Außenbereich/ }).waitFor();
  await page.goto(`${base}/beratung`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1, name: /Erst einen Fachmann fragen/ }).waitFor();
  await desktop.close();
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  const phone = await mobile.newPage();
  await phone.goto(`${base}/`, { waitUntil: 'networkidle' });
  await phone.locator('summary[aria-label="Menü öffnen"]').click();
  const mobileServices = phone.locator('details').filter({ has: phone.locator('summary', { hasText: 'Leistungen' }) }).last();
  await mobileServices.locator('summary').click();
  await mobileServices.locator('a[href="/leistungen/heizung"]').waitFor();
  const overflow = await phone.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`mobile navigation overflows horizontally by ${overflow}px`);
  await mobileServices.locator('a[href="/leistungen/heizung"]').click();
  await phone.waitForURL('**/leistungen/heizung');
  await phone.getByRole('heading', { level: 1, name: /Heizung, Klima & Energie/ }).waitFor();
  await mobile.close();
  console.log(JSON.stringify({ ok: true, checks: ['desktop-megamenu', 'keyboard-focus', 'mobile-disclosure', 'service-deeplink', 'product-story-route', 'no-mobile-overflow'] }, null, 2));
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
  for (const suffix of ['', '-wal', '-shm']) { try { fs.rmSync(dbPath + suffix, { force: true }); } catch {} }
}
