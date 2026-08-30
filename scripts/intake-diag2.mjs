import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.fill('#request', 'Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnungsdurchführungsverordnung '.repeat(4));
await page.waitForTimeout(300);
const wide = await page.$$eval('form[class*="intake"] *, form[class*="intake"]', els =>
  els.filter(e => e.getBoundingClientRect().width > 400)
     .map(e => ({ tag: e.tagName, cls: String(e.className).slice(0, 40), w: Math.round(e.getBoundingClientRect().width) }))
);
console.log(JSON.stringify(wide, null, 1));
await browser.close();
