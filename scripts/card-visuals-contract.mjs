import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const root = process.cwd();
// Asset list is manifest-driven (public/images/card-visuals/manifest.json),
// so a file rename (e.g. the v4 renders) cannot silently orphan this gate.
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/images/card-visuals/manifest.json'), 'utf8'));
const assets = manifest.assets;
assert.ok(Array.isArray(assets) && assets.length > 0, 'manifest assets');

const registry = fs.readFileSync(path.join(root, 'src/components/visuals/card-visuals.ts'), 'utf8');
assert.match(registry, /CARD_VISUALS/);
for (const asset of assets) {
  assert.ok(registry.includes(`/images/card-visuals/${asset}.png`), asset + ' registered');
}

for (const asset of assets) {
  const pngPath = path.join(root, 'public/images/card-visuals', asset + '.png');
  assert.ok(fs.existsSync(pngPath), asset);
  const image = PNG.sync.read(fs.readFileSync(pngPath));
  assert.equal(image.width, 1254, asset + ' width');
  assert.equal(image.height, 1254, asset + ' height');
  assert.ok(image.data.some((value, index) => index % 4 === 3 && value === 0), asset + ' transparency');
}

for (const file of ['CardVisual.tsx', 'CardVisual.module.css']) {
  assert.ok(fs.existsSync(path.join(root, 'src/components/visuals', file)), file);
}

for (const file of ['FeatureVisualCard.tsx', 'FeatureVisualGrid.tsx']) {
  assert.ok(fs.existsSync(path.join(root, 'src/components/marketing', file)), file);
}

console.log('card visuals contract: PASS');
