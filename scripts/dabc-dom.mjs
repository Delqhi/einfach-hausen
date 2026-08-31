import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto('https://www.doktorabc.com/de', { waitUntil: 'networkidle', timeout: 45000 });
// Footer-Struktur
const footer = await page.evaluate(() => {
  const f = document.querySelector('footer') || document.querySelector('[class*="footer"]');
  if (!f) return 'KEIN FOOTER ELEMENT';
  // Alle Headings + Linktexte in Reihenfolge
  const items = [];
  f.querySelectorAll('h2,h3,h4,a,button,p,span').forEach(el => {
    const t = (el.textContent||'').trim().slice(0, 80);
    const tag = el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : '');
    if (t) items.push(`<${tag}> ${t}`);
  });
  return items.slice(0, 100).join('\n');
});
console.log('=== FOOTER STRUKTUR ===');
console.log(footer);
// Auch die Badge/Cert-Sektion
const badges = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')].map(i => i.alt || i.src.split('/').pop()).filter(a => a && (a.includes('PCI') || a.includes('DMCA') || a.includes('Script') || a.includes('zertifiziert') || a.includes('Guet') || a.toLowerCase().includes('logo')));
  return imgs.slice(0, 20).join(' | ');
});
console.log('\n=== BADGES/LOGOS ===');
console.log(badges);
// Topbar (schwarze Leiste oben)
const topbar = await page.evaluate(() => {
  const els = [...document.querySelectorAll('div')].filter(d => {
    const cs = getComputedStyle(d);
    return cs.position === 'fixed' && cs.top === '0px' && d.textContent.includes('Versand');
  });
  return els[0]?.textContent?.trim().slice(0, 300) || 'nicht gefunden';
});
console.log('\n=== TOPBAR ===');
console.log(topbar);
await browser.close();
