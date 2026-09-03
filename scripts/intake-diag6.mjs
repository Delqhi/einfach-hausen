import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const copy = document.querySelector('[class*="heroCopy"]');
  const inner = copy.parentElement;
  const kids = [...copy.children];
  const out = [];
  for (const k of kids) {
    const prev = k.style.display;
    k.style.display = 'none';
    const cols = getComputedStyle(inner).gridTemplateColumns;
    k.style.display = prev;
    out.push({ cls: String(k.className).slice(0, 30), colsWhenHidden: cols });
  }
  return out;
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
