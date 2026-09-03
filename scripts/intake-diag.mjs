import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
const before = await page.$eval('form[class*="intake"]', f => Math.round(f.getBoundingClientRect().height));
await page.fill('#request', 'Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnungsdurchführungsverordnung '.repeat(4));
await page.waitForTimeout(300);
const after = await page.$eval('form[class*="intake"]', f => Math.round(f.getBoundingClientRect().height));
// welche Kinder wachsen?
const rows = await page.$$eval('form[class*="intake"] > *', els => els.map(e => ({ cls: e.className.slice(0,30) || e.tagName, h: Math.round(e.getBoundingClientRect().height) })));
console.log('before:', before, 'after:', after, JSON.stringify(rows));
await page.screenshot({ path: '/tmp/qa-intake-long.png', fullPage: false });
await browser.close();
