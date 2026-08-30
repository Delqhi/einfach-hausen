import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/so-funktionierts', { waitUntil: 'networkidle' });
const mock = page.locator('a[class*="heroMockLink"], a[class*="productPreview"]').first();
const href = await mock.getAttribute('href');
console.log('mock href:', href);
await mock.hover();
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/eh-v7/hover.png', clip: { x: 640, y: 80, width: 800, height: 620 } });
// click → should navigate to register
await mock.click();
await page.waitForTimeout(1200);
console.log('after click:', page.url());
await browser.close();
