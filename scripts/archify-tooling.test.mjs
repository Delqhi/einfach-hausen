import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const node = process.execPath;
const root = process.cwd();

test('repo Archify exporter produces a canonical SVG through the HTML export UI', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-archify-export-'));
  const output = path.join(temp, 'platform.svg');
  const result = spawnSync(node, ['scripts/export-archify-svg.mjs', 'docs/diagrams/platform-architecture.html', output], {
    cwd: root,
    encoding: 'utf8'
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const svg = fs.readFileSync(output, 'utf8');
  assert.equal((svg.match(/<svg\b/g) || []).length, 1);
  assert.match(svg, /viewBox=/);
  assert.doesNotMatch(svg, /class="(?:toolbar|export-menu)"/);
});

test('repo Archify verifier accepts a manifest with the generated platform triplet', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-archify-verify-'));
  const manifest = path.join(temp, 'manifest.json');
  fs.writeFileSync(manifest, JSON.stringify({ diagrams: [{
    name: 'platform architecture',
    type: 'architecture',
    source: 'docs/diagrams/platform-architecture.architecture.json',
    html: 'docs/diagrams/platform-architecture.html',
    svg: 'docs/diagrams/platform-architecture.svg'
  }] }));
  const result = spawnSync(node, ['scripts/verify-archify-diagrams.mjs'], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ARCHIFY_MANIFEST: manifest }
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /ok: platform architecture/);
});
