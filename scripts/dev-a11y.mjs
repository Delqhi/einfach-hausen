import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });

const report = {};
// 1. landmarks + h1
report.h1 = await page.locator('h1').count();
report.landmarks = await page.evaluate(() => ({
  header: !!document.querySelector('header'), main: !!document.querySelector('main'), footer: !!document.querySelector('footer'), nav: !!document.querySelector('nav'),
}));
// 2. skip link
report.skipLink = await page.evaluate(() => { const a = document.querySelector('a[href^="#main"]'); if (!a) return false; a.focus(); return document.activeElement === a; });
// 3. keyboard: Tab reaches nav links, intake input, submit button, CTA
await page.keyboard.press('Tab');
const order = [];
for (let i = 0; i < 12; i++) { order.push(await page.evaluate(() => { const el = document.activeElement; return el ? (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().slice(0, 26) : 'none'; })); await page.keyboard.press('Tab'); }
report.tabOrder = order;
// 4. focus visibility on primary CTA
report.focusVisible = await page.evaluate(() => { const el = document.querySelector('a[href^="/register"]'); el.focus(); const s = getComputedStyle(el); return s.outlineStyle !== 'none' || s.boxShadow !== 'none'; });
// 5. contrast: sample key text/paths via elements
report.contrast = await page.evaluate(() => {
  function lum(c){const[r,g,b]=c.match(/\d+/g).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*r+.7152*g+.0722*b}
  function ratio(fg,bg){const l1=lum(fg),l2=lum(bg);return ((Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05)).toFixed(2)}
  const h1 = getComputedStyle(document.querySelector('h1'));
  const lead = getComputedStyle(document.querySelector('[class*="heroLead"]'));
  const chip = document.querySelector('[class*="chip"]');
  const chipCs = getComputedStyle(chip);
  const cs2bg = (el) => { let e = el; while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !c.includes('0, 0, 0, 0') && c !== 'transparent') return c; e = e.parentElement; } return 'rgb(247,248,247)'; };
  return {
    h1_on_bg: ratio(h1.color, 'rgb(255,255,255)'),
    secondary_on_white: ratio(lead.color, 'rgb(255,255,255)'),
    chip_text_on_chip: ratio(chipCs.color, cs2bg(chip)),
    cta_white_on_green: ratio('rgb(255,255,255)', getComputedStyle(document.querySelector('a[href^="/register"]')).backgroundColor),
  };
});
// 6. reduced motion: emulate and check no animation
const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const p2 = await ctx2.newPage();
await p2.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
report.reducedMotion = await p2.evaluate(async () => {
  const el = document.querySelector('[class*="serviceItem"]');
  window.scrollTo(0, 1200); await new Promise(r => setTimeout(r, 600));
  return { serviceOpacity: getComputedStyle(el).opacity, matchMedia: matchMedia('(prefers-reduced-motion: reduce)').matches };
});
console.log(JSON.stringify(report, null, 1));
await browser.close();
