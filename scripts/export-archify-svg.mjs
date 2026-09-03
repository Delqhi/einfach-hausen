#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright-core';

function usage() {
  console.error('usage: node scripts/export-archify-svg.mjs <input.html> <output.svg>');
  process.exit(2);
}

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) usage();
const input = path.resolve(inputArg);
const output = path.resolve(outputArg);
if (!fs.existsSync(input)) {
  console.error(`error: HTML input does not exist: ${input}`);
  process.exit(1);
}

const browserCandidates = [
  process.env.ARCHIFY_BROWSER_EXECUTABLE_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium'
].filter((candidate) => candidate && fs.existsSync(candidate));

if (!browserCandidates[0]) {
  console.error('error: no usable Chromium browser found; set ARCHIFY_BROWSER_EXECUTABLE_PATH');
  process.exit(1);
}

const browser = await chromium.launch({ headless: true, executablePath: browserCandidates[0] });
try {
  const page = await browser.newPage({ acceptDownloads: true });
  await page.route('**/*', (route) => {
    const request = route.request();
    if (request.url().startsWith('file://') || request.resourceType() === 'document') return route.continue();
    return route.abort();
  });
  await page.goto(`file://${input}?theme=dark`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.locator('.diagram-container svg').waitFor({ state: 'attached' });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#btn-export').click();
  await page.locator('button[data-format="svg"]').click();
  const download = await downloadPromise;
  await fs.promises.mkdir(path.dirname(output), { recursive: true });
  await download.saveAs(output);
} finally {
  await browser.close();
}

const svg = await fs.promises.readFile(output, 'utf8');
if ((svg.match(/<svg\b/g) || []).length !== 1 || !svg.includes('viewBox=')) {
  console.error(`error: Archify SVG export is malformed: ${output}`);
  process.exit(1);
}
if (/<(?:html|body|button)\b/i.test(svg) || /class="(?:toolbar|export-menu)"/.test(svg)) {
  console.error(`error: browser/UI markup leaked into SVG export: ${output}`);
  process.exit(1);
}
console.log(output);
