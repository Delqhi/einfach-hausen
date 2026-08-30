import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
const w = await page.$eval('form[class*="intake"]', f => {
  let e = f, chain = [];
  while (e && chain.length < 8) { chain.push(`${e.tagName}.${String(e.className).slice(0,28)}:${Math.round(e.getBoundingClientRect().width)}`); e = e.parentElement; }
  return chain;
});
console.log(w.join('\n'));
await browser.close();
