#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const manifestPath = path.resolve(process.env.ARCHIFY_MANIFEST || 'docs/archify-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error(`archify verify: manifest missing: ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const archifyBin = path.resolve(process.env.ARCHIFY_BIN || path.join(os.homedir(), '.claude/skills/archify/bin/archify.mjs'));
if (!fs.existsSync(archifyBin)) {
  console.error(`archify verify: Archify CLI missing: ${archifyBin}`);
  process.exit(1);
}

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(`${args.join(' ')} failed with ${result.status}`);
  }
  return result.stdout;
}

run([archifyBin, 'doctor']);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-archify-verify-'));
try {
  for (const diagram of manifest.diagrams || []) {
    const source = path.resolve(root, diagram.source);
    const html = path.resolve(root, diagram.html);
    const svg = path.resolve(root, diagram.svg);
    if (![source, html, svg].every((file) => fs.existsSync(file))) {
      throw new Error(`${diagram.name}: JSON/HTML/SVG triplet is incomplete`);
    }
    const generatedHtml = path.join(temp, `${path.basename(html)}.generated.html`);
    const generatedSvg = path.join(temp, `${path.basename(svg)}.generated.svg`);
    run([archifyBin, 'validate', diagram.type, source, '--json']);
    run([archifyBin, 'render', diagram.type, source, generatedHtml]);
    run([archifyBin, 'check', generatedHtml]);
    run([path.resolve(root, 'scripts/export-archify-svg.mjs'), generatedHtml, generatedSvg]);
    if (!fs.readFileSync(generatedHtml).equals(fs.readFileSync(html))) {
      throw new Error(`${diagram.html} is stale; render it from ${diagram.source}`);
    }
    if (!fs.readFileSync(generatedSvg).equals(fs.readFileSync(svg))) {
      throw new Error(`${diagram.svg} is stale; export it from ${diagram.html}`);
    }
    console.log(`ok: ${diagram.name}`);
  }
} catch (error) {
  console.error(`archify verify: ${error.message}`);
  process.exit(1);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
