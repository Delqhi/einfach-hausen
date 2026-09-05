import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const expectedSlugs = [
  'haus-technik',
  'elektro-smart-home',
  'heizung',
  'sanitaer-wasser',
  'dach-fenster-tueren',
  'innenausbau-sanierung',
  'garten-aussenbereich',
  'reinigung-pflege',
  'saisonale-dienste',
  'spezialfaelle',
  'umzug-entruempelung',
  'beratung-notfall',
];

assert.ok(exists('src/components/marketing/service-catalog.tsx'), 'service catalog must exist');
const catalog = read('src/components/marketing/service-catalog.tsx');
for (const slug of expectedSlugs) assert.match(catalog, new RegExp(`slug:\\s*['\"]${slug}['\"]`));
assert.match(catalog, /SERVICE_PATHS/);
assert.match(catalog, /getServiceCategory/);

const shell = read('src/components/marketing/site-shell.tsx');
assert.match(shell, /megaMenu/);
assert.match(shell, /Alle Leistungen/);
assert.match(shell, /Beratung/);
assert.match(shell, /Notfall/);
assert.match(shell, /Blog/);
assert.match(shell, /Lexikon/);
assert.match(shell, /Sicherheit/);


assert.ok(exists('src/components/marketing/service-detail-page.tsx'), 'shared service detail page must exist');
assert.ok(exists('src/app/leistungen/[slug]/page.tsx'), 'dynamic service route must exist');
const dynamicServicePage = read('src/app/leistungen/[slug]/page.tsx');
assert.match(dynamicServicePage, /generateStaticParams/);
assert.match(dynamicServicePage, /generateMetadata/);
const sitemap = read('src/app/sitemap.ts');
assert.match(sitemap, /SERVICE_PATHS/);
const serviceIndex = read('src/app/leistungen/page.tsx');
assert.match(serviceIndex, /SERVICE_CATEGORIES/);
assert.ok(serviceIndex.includes('href={`/leistungen/${slug}`}'));
const heatingPage = read('src/app/leistungen/heizung/page.tsx');
assert.match(heatingPage, /ServiceDetailPage/);


const productRoutes = [
  ['beratung', /kein Auftrag/i],
  ['notfall', /Bereitschaft|24\/7/],
  ['versicherung', /nicht automatisch/i],
  ['immobilienverkauf', /Freigabe|Makler/],
];
for (const [slug, pattern] of productRoutes) {
  const rel = `src/app/${slug}/page.tsx`;
  assert.ok(exists(rel), `public product page /${slug} must exist`);
  assert.match(read(rel), pattern);
  assert.ok(sitemap.includes(`/${slug}`), `sitemap must include /${slug}`);
}

console.log(JSON.stringify({ ok: true, services: expectedSlugs.length, productRoutes: productRoutes.length, checks: ['catalog', 'megamenu', 'help-discovery', 'service-routes', 'sitemap', 'product-pages'] }, null, 2));
