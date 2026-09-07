import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { startServer } from './server.mjs';

const directory = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(directory, '../..');
const dependencies = process.env.EH_VERIFY_DEPENDENCIES || repository;
const { chromium } = await import(pathToFileURL(path.join(dependencies, 'node_modules/playwright-core/index.mjs')).href);
const evidence = path.join(repository, 'docs/brand/evidence/study');
await mkdir(evidence, { recursive: true });
const server = await startServer();
let browser;
const records = [];
try {
  const base = 'http://127.0.0.1:' + server.address().port;
  const missing = await fetch(base + '/.env');
  assert.equal(missing.status, 404, 'Server must never expose arbitrary repository files');
  browser = await chromium.launch({
    headless: true,
    ...(process.env.EH_CHROMIUM_PATH ? { executablePath: process.env.EH_CHROMIUM_PATH } : {})
  });
  for (const width of [390, 736, 1320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.original-logo').evaluate(img => img.complete && img.naturalWidth > 0), true);
    for (const direction of ['architecture', 'companion', 'journal']) {
      await page.locator('button[data-direction="' + direction + '"]').click();
      assert.equal(await page.locator('#brand-world').getAttribute('data-direction'), direction);
      for (const view of ['home', 'file', 'contact']) {
        await page.locator('button[data-view="' + view + '"]').click();
        assert.equal(await page.locator('[data-panel="' + view + '"]').isVisible(), true);
        assert.equal(await page.locator('[data-panel]:visible').count(), 1);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.equal(overflow, false, direction + '/' + view + '/' + width + ' overflows');
        const image = direction + '-' + view + '-' + width + '.png';
        await page.screenshot({ path: path.join(evidence, image), fullPage: true });
        records.push({ direction, view, width, image, overflow: false });
      }
    }
    await page.locator('button[data-view="file"]').click();
    await page.locator('button[data-register="documents"]').click();
    assert.equal(await page.locator('[data-register-panel="documents"]').isVisible(), true);
    await page.locator('[data-register-panel="documents"] summary').first().click();
    assert.equal(await page.locator('details[open]').count(), 1);
    await page.locator('button[data-view="contact"]').click();
    await page.locator('#contact-name').fill('Stilprobe');
    await page.locator('#contact-message').fill('Ich möchte meine nächste Wartung planen.');
    await page.locator('#contact-form button[type="submit"]').click();
    await page.locator('#contact-status').filter({ hasText: 'nichts versendet' }).waitFor();
    await page.locator('button[data-direction="architecture"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#brand-world').getAttribute('data-direction'), 'architecture');
    assert.deepEqual(errors, []);
    await page.close();
  }
  const report = { status: 'pass', screenshots: records.length, originalLogo: true, localOnlyForm: true, keyboardSwitch: true, reducedMotion: true, sourceExposureGuard: true, records };
  await writeFile(path.join(evidence, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
