import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
// 404 bleibt 404 (kein Login-Bounce)
await page.goto('http://localhost:3110/gibts-nicht', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('404 url:', page.url(), '| text:', (await page.locator('h1').first().textContent())?.trim());
// private Route bounct weiter (UX-Guard intakt)
await page.goto('http://localhost:3110/auftraege', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
console.log('private url:', page.url());
// public bleibt public
await page.goto('http://localhost:3110/leistungen', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('public url:', page.url());
// login layout
await page.goto('http://localhost:3110/login', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/eh-v11/login2.png' });
await browser.close();
