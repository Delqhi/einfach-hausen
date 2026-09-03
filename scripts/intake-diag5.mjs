import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const el = document.querySelector('[class*="heroCopy"]');
  const s = getComputedStyle(el);
  const grid = getComputedStyle(el.parentElement);
  return { display: s.display, minMax: s.minWidth, parentCols: grid.gridTemplateColumns, parentName: el.parentElement.className };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
