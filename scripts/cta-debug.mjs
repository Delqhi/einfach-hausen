import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:3110/leistungen', { waitUntil: 'networkidle' });
const info = await page.evaluate(() => {
  const h = [...document.querySelectorAll('h2')].find(x => x.textContent.includes('Sag einfach'));
  const band = h.closest('section');
  const cs = getComputedStyle(band);
  return { bandClass: band.className, bg: cs.backgroundColor, bgImage: cs.backgroundImage.slice(0, 80), h2Color: getComputedStyle(h).color };
});
console.log(JSON.stringify(info, null, 1));
await browser.close();
