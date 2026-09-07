#!/usr/bin/env node
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';

const root = process.cwd();
const browserCandidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
if (!executablePath) throw new Error('No Chromium browser found');
if (!fs.existsSync(path.join(root, '.next', 'BUILD_ID'))) throw new Error('No production build found — run npm run build first');

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

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 834, height: 1194 },
  { name: 'desktop', width: 1320, height: 900 },
  { name: 'browser', width: 1490, height: 805 },
  { name: 'wide', width: 1945, height: 1057 },
];
const routes = [
  { name: 'login', path: '/login', button: '#btn-submit-login' },
  { name: 'owner-register', path: '/register?role=homeowner', button: '#btn-submit-register' },
  { name: 'provider-register', path: '/register?role=provider', button: '#btn-submit-register' },
];

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const dbPath = path.join(os.tmpdir(), `eh-auth-design-${randomUUID()}.db`);
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  env: { ...process.env, DATABASE_PATH: dbPath, ADMIN_PASSWORD: `AuthDesign!${randomUUID()}`, SESSION_COOKIE_NAME: 'auth_design_session', NEXT_PUBLIC_APP_URL: base, AUTH_MODE: 'supabase', E2E_INSECURE_COOKIES: '1' },
  stdio: 'ignore',
});
let browser;
const results = [];
try {
  await waitForServer(`${base}/login`);
  browser = await chromium.launch({ headless: true, executablePath });
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, locale: 'de-DE' });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(`${base}${route.path}`, { waitUntil: 'networkidle' });
      await page.locator('#login-card-container').waitFor({ state: 'visible', timeout: 10000 });
      const data = await page.evaluate(({ buttonSelector, viewportWidth }) => {
        const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect();
        const card = rect('#login-card-container');
        const grid = rect('.eh-auth-grid');
        const hero = rect('#website-hero-panel');
        const heading = document.querySelector('.eh-auth-form-heading h2');
        const heroHeading = document.querySelector('.eh-auth-trust-panel h1');
        const heroPanel = document.querySelector('.eh-auth-trust-panel');
        const demoDisclosure = document.querySelector('#demo-testzugang-disclosure');
        const assuranceFooter = document.querySelector('#auth-assurance-footer');
        const button = document.querySelector(buttonSelector);
        const roleSwitch = document.querySelector('.eh-auth-topbar-role-switch');
        const networkBadge = document.querySelector('.eh-auth-network-badge');
        return {
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          cardWidth: card?.width || 0,
          gridWidth: grid?.width || 0,
          heroWidth: hero?.width || 0,
          headingSize: heading ? Number.parseFloat(getComputedStyle(heading).fontSize) : 0,
          heroHeadingSize: heroHeading ? Number.parseFloat(getComputedStyle(heroHeading).fontSize) : 0,
          heroBorderWidth: heroPanel ? getComputedStyle(heroPanel).borderTopWidth : 'missing',
          demoDisclosure: Boolean(demoDisclosure),
          assuranceFooter: Boolean(assuranceFooter),
          buttonBg: button ? getComputedStyle(button).backgroundColor : '',
          roleSwitchDisplay: roleSwitch ? getComputedStyle(roleSwitch).display : 'missing',
          networkBadgeDisplay: networkBadge ? getComputedStyle(networkBadge).display : 'missing',
          viewportWidth,
        };
      }, { buttonSelector: route.button, viewportWidth: viewport.width });
      if (data.overflow > 1) throw new Error(`${viewport.name}/${route.name}: horizontal overflow ${data.overflow}px`);
      if (data.headingSize < 27) throw new Error(`${viewport.name}/${route.name}: heading too small ${data.headingSize}px`);
      if (data.buttonBg !== 'rgb(16, 82, 88)') throw new Error(`${viewport.name}/${route.name}: primary action is not canonical petrol (${data.buttonBg})`);
      if (data.roleSwitchDisplay !== 'none') throw new Error(`${viewport.name}/${route.name}: duplicate topbar role switch still visible`);
      if (data.networkBadgeDisplay !== 'none') throw new Error(`${viewport.name}/${route.name}: network micro-badge still visible`);
      if (viewport.width === 390) {
        const crampedTabsVisible = await page.getByText('Vorteile', { exact: true }).isVisible().catch(() => false);
        if (crampedTabsVisible) throw new Error(`${viewport.name}/${route.name}: cramped auth tabs still visible in mobile topbar`);
        const benefitsLink = page.locator('.eh-auth-mobile-benefits-link');
        if (!(await benefitsLink.isVisible().catch(() => false))) throw new Error(`${viewport.name}/${route.name}: calm mobile benefits link missing`);
      }
      if (viewport.width >= 1320 && data.cardWidth < 540) throw new Error(`${viewport.name}/${route.name}: auth card too narrow ${data.cardWidth}px`);
      if (viewport.width >= 1320 && data.headingSize < 36) throw new Error(`${viewport.name}/${route.name}: form heading too small ${data.headingSize}px`);
      if (viewport.width >= 1320 && data.heroHeadingSize < 50) throw new Error(`${viewport.name}/${route.name}: editorial hero heading too small ${data.heroHeadingSize}px`);
      if (viewport.width >= 1320 && data.heroBorderWidth !== '0px') throw new Error(`${viewport.name}/${route.name}: legacy outer hero card still visible (${data.heroBorderWidth})`);
      if (!data.demoDisclosure) throw new Error(`${viewport.name}/${route.name}: demo access is not a disclosure`);
      if (!data.assuranceFooter) throw new Error(`${viewport.name}/${route.name}: consolidated assurance footer missing`);
      if (viewport.width >= 1490 && data.gridWidth < 1400) throw new Error(`${viewport.name}/${route.name}: auth composition too narrow ${data.gridWidth}px`);
      if (viewport.width >= 1490 && data.heroWidth < 760) throw new Error(`${viewport.name}/${route.name}: trust panel too narrow ${data.heroWidth}px`);
      if (viewport.name === 'browser' && route.name === 'provider-register') {
        const badge = page.locator('.eh-auth-trust-photo > div.relative').first();
        const badgeBox = await badge.boundingBox();
        const badgeStyle = await badge.evaluate((el) => {
          const style = getComputedStyle(el);
          return { paddingLeft: Number.parseFloat(style.paddingLeft), paddingRight: Number.parseFloat(style.paddingRight) };
        });
        if (!badgeBox || badgeBox.height < 36) throw new Error(`provider trust badge is too short (${badgeBox?.height || 0}px)`);
        if (badgeBox.width > 280) throw new Error(`provider trust badge stretches across the photo (${badgeBox.width}px)`);
        if (badgeStyle.paddingLeft < 10 || badgeStyle.paddingRight < 10) throw new Error('provider trust badge lost its horizontal padding');
        await page.click('#btn-header-help');
        const helpPanel = page.locator('#auth-help-popover');
        if (!(await helpPanel.isVisible().catch(() => false))) throw new Error('header help does not open an anchored help panel');
        const helpBox = await helpPanel.boundingBox();
        const helpStyle = await helpPanel.evaluate((el) => {
          const style = getComputedStyle(el);
          return { paddingLeft: Number.parseFloat(style.paddingLeft), background: style.backgroundColor };
        });
        if (!helpBox || helpBox.width < 280 || helpBox.height < 110) throw new Error(`header help panel is undersized (${helpBox?.width || 0}x${helpBox?.height || 0})`);
        if (helpStyle.paddingLeft < 16) throw new Error('header help panel lost its internal spacing');
        if (await helpPanel.getByRole('link', { name: 'Hilfebereich öffnen' }).count() !== 1) throw new Error('header help panel lacks a clear help action');
        if (await page.locator('#btn-header-help').getAttribute('aria-expanded') !== 'true') throw new Error('header help trigger does not expose expanded state');
        await page.click('#btn-header-help');
        if (await helpPanel.isVisible().catch(() => false)) throw new Error('header help panel does not close from its trigger');

        await page.getByRole('button', { name: 'Aufnahmekriterien für Meisterbetriebe' }).click();
        const legalModal = page.locator('#legal-modal-container');
        if (!(await legalModal.isVisible().catch(() => false))) throw new Error('partner criteria modal does not open');
        const modalBox = await legalModal.boundingBox();
        const modalStyle = await legalModal.evaluate((el) => {
          const style = getComputedStyle(el);
          return { paddingLeft: Number.parseFloat(style.paddingLeft), borderRadius: Number.parseFloat(style.borderRadius) };
        });
        if (!modalBox || modalBox.width < 620 || modalBox.height < 360) throw new Error(`partner criteria modal is cramped (${modalBox?.width || 0}x${modalBox?.height || 0})`);
        if (modalStyle.paddingLeft < 24) throw new Error('partner criteria modal lost its inner padding');
        if (modalStyle.borderRadius > 28) throw new Error(`partner criteria modal radius is oversized (${modalStyle.borderRadius}px)`);
        if (await legalModal.getAttribute('role') !== 'dialog' || await legalModal.getAttribute('aria-modal') !== 'true') throw new Error('partner criteria modal lacks dialog semantics');
        if (await legalModal.locator('.eh-auth-modal-card').count() !== 3) throw new Error('partner criteria are not presented as three structured cards');
        const confirmBox = await page.locator('#btn-confirm-legal-modal').boundingBox();
        if (!confirmBox || confirmBox.height < 42) throw new Error(`partner criteria close action is undersized (${confirmBox?.height || 0}px)`);
        await page.locator('#btn-confirm-legal-modal').focus();
        await page.keyboard.press('Tab');
        const focusStayedInModal = await page.evaluate(() => {
          const modal = document.querySelector('#legal-modal-container');
          return Boolean(modal && document.activeElement && modal.contains(document.activeElement));
        });
        if (!focusStayedInModal) throw new Error('partner criteria modal does not trap keyboard focus');
        await page.keyboard.press('Escape');
        if (await legalModal.isVisible().catch(() => false)) throw new Error('partner criteria modal does not close with Escape');
      }
      results.push({ viewport: viewport.name, route: route.name, ...data });
    }
    await context.close();
  }
  console.log(JSON.stringify({ ok: true, checks: results.length, results }, null, 2));
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
  for (const suffix of ['', '-wal', '-shm']) { try { fs.rmSync(dbPath + suffix, { force: true }); } catch {} }
}
