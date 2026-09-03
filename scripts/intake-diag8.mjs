import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const intake = document.querySelector('form[class*="intake"]');
  const grid = document.querySelector('[class*="heroCopy"]').parentElement;
  const cols = () => getComputedStyle(grid).gridTemplateColumns;
  const all = [...intake.querySelectorAll('*')];
  const culprits = [];
  for (const el of all) {
    const prev = el.style.display;
    el.style.display = 'none';
    const c = cols();
    el.style.display = prev;
    if (c !== '596.594px') culprits.push({ tag: el.tagName, cls: String(el.className).slice(0, 40), fixedTo: c });
  }
  return { total: all.length, culprits: culprits.slice(0, 10) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
