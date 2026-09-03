import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const r = await page.evaluate(() => {
  const intake = document.querySelector('form[class*="intake"]');
  const inner = intake.parentElement; // Stagger/heroCopy
  const kids = [...intake.children];
  const out = [];
  for (const k of kids) {
    const prev = k.style.display;
    k.style.display = 'none';
    const cols = getComputedStyle(inner).gridTemplateColumns;
    k.style.display = prev;
    out.push({ cls: String(k.className).slice(0, 34), colsWhenHidden: cols });
  }
  // und in intakeRow tiefer
  const row = intake.querySelector('[class*="intakeRow"]');
  const rowKids = [...row.children].map(k => ({ cls: String(k.className).slice(0, 34) || k.tagName, minw: (() => { const s = k.style.display; k.style.display='none'; const c = getComputedStyle(row).minWidth; k.style.display = s; return c; })() }));
  return { kids: out, rowDir: getComputedStyle(row).flexDirection, rowKids };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
