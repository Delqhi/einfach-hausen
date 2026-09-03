import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3110/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const r = await page.evaluate(() => {
  const row = document.querySelector('[class*="chipRow"]');
  const chip = row?.querySelector('[class*="chip"]');
  const cs = chip ? getComputedStyle(chip) : null;
  const rs = row ? getComputedStyle(row) : null;
  return {
    row: rs && { display: rs.display, cols: rs.gridTemplateColumns, wrap: rs.flexWrap, w: Math.round(row.getBoundingClientRect().width) },
    chip: cs && { display: cs.display, fontSize: cs.fontSize, whiteSpace: cs.whiteSpace, w: Math.round(chip.getBoundingClientRect().width), overflow: cs.overflow, minWidth: cs.minWidth },
    chipText: chip?.textContent?.slice(0, 45),
  };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
