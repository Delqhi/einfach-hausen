import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://www.doktorabc.com/de', { waitUntil: 'networkidle', timeout: 45000 });
// direkt zum Footer scrollen
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/doktorabc/footer-live.png' });
// Nav-Dropdown öffnen (Alle Behandlungen)
await page.click('text=Alle Behandlungen');
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/doktorabc/nav-dropdown.png' });
await browser.close();
