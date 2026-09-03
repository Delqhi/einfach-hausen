import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://www.doktorabc.com/de?af=brand22', { waitUntil: 'networkidle', timeout: 45000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/doktorabc/hero.png' });
// Voll-Screenshot
await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y <= h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0,0); });
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/doktorabc/full.png', fullPage: true });
console.log('desktop ok, height:', await page.evaluate(() => document.body.scrollHeight));
// Mobile
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
await mpage.goto('https://www.doktorabc.com/de?af=brand22', { waitUntil: 'networkidle', timeout: 45000 });
await mpage.waitForTimeout(3000);
await mpage.screenshot({ path: '/tmp/doktorabc/mobile-full.png', fullPage: true });
console.log('mobile ok');
await browser.close();
