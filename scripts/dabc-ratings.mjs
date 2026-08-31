import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('https://www.doktorabc.com/de', { waitUntil: 'networkidle', timeout: 45000 });
const ratings = await page.evaluate(() => {
  const t = document.body.innerText;
  const lines = t.split('\n').map(l => l.trim()).filter(Boolean);
  // Alle Zahlen/Stats
  const stats = lines.filter(l => /^\d|^\d,|^\+\d|Mio|Millionen|Kunden|Bestellungen|Bewertungen|Vertrauen|Jahre|Kategorien|Prozent|%/i.test(l)).slice(0, 40);
  return stats;
});
console.log(ratings.join('\n'));
await browser.close();
