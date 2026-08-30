import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const state = await page.evaluate(() => ({
  lenisOff: !document.documentElement.className.includes('lenis'),
  h1visible: getComputedStyle(document.querySelector('[class*="heroH1"]')).opacity === '1',
  h1children: document.querySelector('[class*="heroH1"]').children.length,
}));
console.log('reduced-motion state:', JSON.stringify(state));
await browser.close();
