import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
// 1. composer focus-within
await page.focus('#request');
await page.waitForTimeout(400);
const intake = await page.$('form[class*="intake"]');
const box = await intake.boundingBox();
await page.screenshot({ path: '/tmp/eh-v8/focus.png', clip: { x: box.x-30, y: box.y-30, width: box.width+60, height: box.height+60 } });
// 2. active nav on subpage
await page.goto('http://localhost:3110/hausakte', { waitUntil: 'networkidle' });
const active = await page.evaluate(() => document.querySelector('header nav a[aria-current="page"]')?.textContent || 'none');
console.log('active nav:', active);
// 3. dark section buttons
const dark = await page.$('[class*="tone_dark"]');
await dark.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
const db = await dark.$('a[class*="primaryButton"]');
const dbb = await db.boundingBox();
await page.screenshot({ path: '/tmp/eh-v8/dark.png', clip: { x: dbb.x-40, y: dbb.y-30, width: 500, height: 90 } });
await browser.close();
