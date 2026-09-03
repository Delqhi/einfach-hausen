import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const lenis = await page.evaluate(() => ({
  lenisClass: document.documentElement.className.includes('lenis'),
  linesSplit: document.querySelectorAll('.heroCopy h1 div, .heroCopy h1 .split-line, [class*="heroH1"] div').length,
  h1text: document.querySelector('.heroCopy h1')?.textContent?.slice(0, 30),
}));
console.log('lenis state:', JSON.stringify(lenis));
// scroll test: lenis smoothing aktiv (scrollY ändert sich sanft)
await page.mouse.wheel(0, 1500);
await page.waitForTimeout(600);
const scrolled = await page.evaluate(() => ({ y: Math.round(window.scrollY), progress: document.querySelector('header')?.style.getPropertyValue('--scroll-progress'), sticky: getComputedStyle(document.querySelector('header')).position }));
console.log('after wheel:', JSON.stringify(scrolled));
await page.screenshot({ path: '/tmp/eh-v13/scroll.png' });
console.log('pageerrors:', errors.length ? errors : 'none');
await browser.close();
