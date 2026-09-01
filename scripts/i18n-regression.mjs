// T-0113/T-0114 deterministic locale contract regression.
import assert from 'node:assert/strict';
import fs from 'node:fs';
process.env.DATABASE_PATH = '/tmp/eh-i18n.db';
const mod = await import('../src/lib/i18n.ts');
const { normalizeLocale, t, formatMoney, formatDate, formatNumber } = mod;

// 1) deterministic fallback matrix
assert.equal(normalizeLocale('en'), 'en');
assert.equal(normalizeLocale('de'), 'de');
assert.equal(normalizeLocale('fr'), 'de');
assert.equal(normalizeLocale(undefined), 'de');
assert.equal(normalizeLocale(null), 'de');
// 2) coverage: every de key exists in en (contract completeness)
const srcText = fs.readFileSync('src/lib/i18n.ts', 'utf8');
const deBlock = srcText.split('de: {')[1]?.split('} as const')[0] || '';
const enBlock = srcText.split('en: {')[1]?.split('} as const')[0] || '';
const deKeys = Array.from(deBlock.matchAll(/'([^']+)':/g)).map(m => m[1]);
const enKeys = new Set(Array.from(enBlock.matchAll(/'([^']+)':/g)).map(m => m[1]));
for (const key of deKeys) assert.ok(enKeys.has(key), `missing en key: ${key}`);
assert.ok(deKeys.length >= 20, `contract size ${deKeys.length} >= 20`);
// 3) string resolution de/en
assert.equal(t('de', 'app.home.title'), 'Mein Zuhause');
assert.equal(t('en', 'app.home.title'), 'My home');
// 4) locale-safe Intl formatters
assert.ok(formatMoney('de', 1990).includes('19,90'), 'de money format');
assert.ok(formatMoney('en', 1990).includes('19.90'), 'en money format');
assert.ok(formatDate('de', '2026-09-01').includes('2026'), 'de date format');
assert.ok(formatNumber('en', 1234.5).includes('1,234'), 'en number grouping');
// 5) purity: t() never mutates state (same call same result)
assert.equal(t('de', 'app.home.title'), t('de', 'app.home.title'));
console.log(JSON.stringify({ ok: true, checks: 5, keys: deKeys.length }));
