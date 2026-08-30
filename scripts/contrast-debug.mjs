import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('http://localhost:3110/leistungen', { waitUntil: 'networkidle' });
const bad = await page.evaluate(() => {
  const lum = (c) => { const m = c.match(/\d+/g); if (!m) return null; const [r,g,b] = m.map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}); return .2126*r+.7152*g+.0722*b; };
  const out = [];
  for (const h of document.querySelectorAll('h1, h2')) {
    const cs = getComputedStyle(h); let e = h, bg = null;
    while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !c.includes('0, 0, 0, 0') && c !== 'transparent') { bg = c; break; } e = e.parentElement; }
    const l1 = lum(cs.color), l2 = lum(bg || 'rgb(255,255,255)');
    if (l1 !== null && l2 !== null) {
      const ratio = (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);
      if (ratio < 4.5) out.push({ text: h.textContent.slice(0,40), color: cs.color, bg, ratio: ratio.toFixed(2) });
    }
  }
  return out;
});
console.log(JSON.stringify(bad, null, 1));
await browser.close();
