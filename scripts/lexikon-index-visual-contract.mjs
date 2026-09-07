#!/usr/bin/env node
import fs from 'node:fs';
const modulePath = process.env.PLAYWRIGHT_CORE_MODULE || 'playwright-core';
const { chromium } = await import(modulePath);
const base = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const candidates = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  (() => { try { const p = chromium.executablePath(); return fs.existsSync(p) ? p : ''; } catch { return ''; } })(),
  '/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome',
  '/home/ubuntu/.cache/ms-playwright/chromium-1223/chrome-linux/chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const executablePath = candidates.find((p) => fs.existsSync(p));
if (!executablePath) throw new Error('Chromium executable not found');
const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox'] });
const failures = [];
for (const viewport of [{ width: 1320, height: 900, name: 'desktop', heroMax: 720, gapMax: 175 }, { width: 390, height: 844, name: 'mobile', heroMax: 920, gapMax: 170 }]) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await page.goto(`${base}/lexikon`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(250);
  const m = await page.evaluate(() => {
    const h1 = [...document.querySelectorAll('h1')].find((el) => el.textContent?.includes('Fachbegriffe'));
    const hero = h1?.closest('section');
    const glossar = [...document.querySelectorAll('h2')].find((el) => el.textContent?.includes('Alle Begriffe'));
    const category = document.querySelector('a[href="/lexikon/kategorie/heizung-energie"]');
    const wrapper = category?.parentElement;
    const hr = hero?.getBoundingClientRect();
    const gr = glossar?.getBoundingClientRect();
    const style = wrapper ? getComputedStyle(wrapper) : null;
    return { heroHeight: hr?.height ?? Infinity, gap: hr && gr ? gr.top - hr.bottom : Infinity, categoryOpacity: Number(style?.opacity ?? 0), scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth };
  });
  console.log(`${viewport.name}: hero=${Math.round(m.heroHeight)} gap=${Math.round(m.gap)} categoryOpacity=${m.categoryOpacity} width=${m.scrollWidth}/${m.clientWidth}`);
  if (m.heroHeight > viewport.heroMax) failures.push(`${viewport.name} hero ${Math.round(m.heroHeight)} > ${viewport.heroMax}`);
  if (m.gap > viewport.gapMax) failures.push(`${viewport.name} hero→glossar gap ${Math.round(m.gap)} > ${viewport.gapMax}`);
  if (m.categoryOpacity < 0.99) failures.push(`${viewport.name} category cards hidden before scroll (opacity ${m.categoryOpacity})`);
  if (m.scrollWidth > m.clientWidth) failures.push(`${viewport.name} horizontal overflow ${m.scrollWidth} > ${m.clientWidth}`);
  await page.close();
}
await browser.close();
if (failures.length) { console.error(failures.map((f) => `FAIL ${f}`).join('\n')); process.exit(1); }
console.log('PASS lexikon index visual contract');
