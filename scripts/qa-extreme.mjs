import { chromium } from 'playwright-core';
const BASE = process.env.QA_BASE || 'http://localhost:3110';
const routes = ['/', '/so-funktionierts', '/leistungen', '/hausakte', '/partner', '/preise', '/hilfe', '/kontakt'];
const LONG = 'Grundstücksverkehrsgenehmigungszuständigkeitsübertragungsverordnungsdurchführungsverordnung ';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let fails = 0;

for (const vp of [{ width: 320, height: 700 }, { width: 390, height: 844 }, { width: 1920, height: 1080 }]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) { console.log(`FAIL overflow ${vp.width}px ${route} (+${overflow}px)`); fails++; }
  }
  await ctx.close();
}

// 200%-Zoom auf Startseite (Text bricht?)
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.evaluate(() => { document.body.style.zoom = '2'; });
await page.waitForTimeout(500);
const zoomOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
if (zoomOverflow > 1) { console.log(`FAIL zoom200 +${zoomOverflow}px`); fails++; }
await ctx.close();

// Langer deutscher String im Intake
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page2 = await ctx2.newPage();
await page2.goto(BASE + '/', { waitUntil: 'networkidle' });
await page2.fill('#request', LONG.repeat(4));
const intake = await page2.$('form[class*="intake"]');
const ib = await intake.boundingBox();
if (ib.width > 390) { console.log(`FAIL intake overflow ${ib.width}`); fails++; }
const heightOk = ib.height < 560;
if (!heightOk) { console.log(`FAIL intake height ${ib.height}`); fails++; }
await ctx2.close();

console.log(fails === 0 ? 'QA-EXTREME PASS (all viewports, zoom, long strings)' : `QA-EXTREME ${fails} failures`);
await browser.close();
process.exit(fails === 0 ? 0 : 1);
