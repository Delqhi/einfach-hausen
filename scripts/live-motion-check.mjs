import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://einfachhausen.de/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const state = await page.evaluate(() => ({
  lenisActive: document.documentElement.className.includes('lenis'),
  splitLines: document.querySelectorAll('[class*="heroH1"] > div, [class*="heroH1"] [style*="translate"]').length,
  h1: document.querySelector('[class*="heroH1"]')?.textContent?.slice(0, 25),
  scroll: (() => { window.dispatchEvent(new Event('scroll')); return true; })(),
}));
console.log('LIVE:', JSON.stringify(state));
await browser.close();
