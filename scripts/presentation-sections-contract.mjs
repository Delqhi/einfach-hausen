#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const componentPath = 'src/components/marketing/motion-presentation.tsx';
assert.ok(exists(componentPath), 'shared motion presentation component must exist');
const component = read(componentPath);
assert.match(component, /<video/);
assert.match(component, /muted/);
assert.match(component, /playsInline/);
assert.match(component, /prefers-reduced-motion/);
assert.match(component, /poster=/);

const directRoutes = {
  'src/app/page.tsx': 'home',
  'src/app/eigenheimbesitzer/page.tsx': 'eigenheimbesitzer',
  'src/app/so-funktionierts/page.tsx': 'so-funktionierts',
  'src/app/hausakte/page.tsx': 'hausakte',
  'src/app/leistungen/page.tsx': 'leistungen',
};

Object.assign(directRoutes, {
  'src/app/preise/page.tsx': 'preise',
  'src/app/partner/page.tsx': 'partner',
  'src/app/sicherheit/page.tsx': 'sicherheit',
  'src/app/pilotphase/page.tsx': 'pilotphase',
});

for (const [file, id] of Object.entries(directRoutes)) {
  const source = read(file);
  assert.match(source, /MotionPresentation/, `${file} must render MotionPresentation`);
  assert.ok(source.includes(`presentationId="${id}"`), `${file} must use ${id}`);
}

const productSource = read('src/components/marketing/product-story-page.tsx');
assert.match(productSource, /presentationId/);
assert.match(productSource, /MotionPresentation/);
for (const [file, id] of Object.entries({
  'src/app/beratung/page.tsx': 'beratung',
  'src/app/versicherung/page.tsx': 'versicherung',
  'src/app/immobilienverkauf/page.tsx': 'immobilienverkauf',
  'src/app/notfall/page.tsx': 'notfall',
})) {
  assert.ok(read(file).includes(`presentationId="${id}"`), `${file} must use ${id}`);
}
const serviceSource = read('src/components/marketing/service-detail-page.tsx');
assert.match(serviceSource, /MotionPresentation/);
assert.match(serviceSource, /leistung-\$\{service\.slug\}/);

const serviceIds = [
  'leistung-haus-technik',
  'leistung-elektro-smart-home',
  'leistung-heizung',
  'leistung-sanitaer-wasser',
  'leistung-dach-fenster-tueren',
  'leistung-innenausbau-sanierung',
  'leistung-garten-aussenbereich',
  'leistung-reinigung-pflege',
  'leistung-saisonale-dienste',
  'leistung-spezialfaelle',
  'leistung-umzug-entruempelung',
  'leistung-beratung-notfall',
];

const allIds = [
  ...Object.values(directRoutes),
  'beratung', 'versicherung', 'immobilienverkauf', 'notfall',
  ...serviceIds,
];
assert.equal(allIds.length, 25);
for (const id of allIds) {
  assert.ok(
    exists(`public/media/presentations/${id}.mp4`),
    `missing video asset for ${id}`,
  );
  assert.ok(
    exists(`public/media/presentations/${id}.jpg`),
    `missing poster asset for ${id}`,
  );
}

console.log(JSON.stringify({ ok: true, presentations: allIds.length }, null, 2));