import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const r = await page.evaluate(() => {
  const q = s => document.querySelector(s);
  const info = el => el ? { w: Math.round(el.getBoundingClientRect().width), cols: getComputedStyle(el).gridTemplateColumns, display: getComputedStyle(el).display } : null;
  return {
    heroInner: info(q('[class*="heroInner"]')),
    heroCopy: info(q('[class*="heroCopy"]')),
    akteStrip: info(q('[class*="heroAkteStrip"]')),
    intake: info(q('form[class*="intake"]')),
    chipRow: info(q('[class*="chipRow"]')),
  };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
