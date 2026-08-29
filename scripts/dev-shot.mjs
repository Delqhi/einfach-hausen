import { chromium } from 'playwright-core';
const pages = process.argv[2] ? process.argv[2].split(',') : ['home=/'];
const base = process.env.SHOT_BASE || 'http://localhost:3110';
const dir = process.env.SHOT_DIR || '/tmp/eh-after';
const mobile = process.env.SHOT_MOBILE === '1';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext(mobile
  ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
for (const [name, path] of pages.map(s => s.split('='))) {
  await page.goto(base + path, { waitUntil: 'networkidle' });
  // fire all scroll reveals like a user, then return to top so GSAP end-states persist
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
  });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${dir}/${name}${mobile ? '-mobile' : ''}.png`, fullPage: true });
  console.log(name, 'ok');
}
await browser.close();
