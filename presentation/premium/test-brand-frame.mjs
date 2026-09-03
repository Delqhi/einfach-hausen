#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(here, 'deck.html'), 'utf8');

for (const token of [
  '--brand-logo-src:',
  '--brand-logo-size:',
  '--brand-logo-opacity:',
  '--phone-frame-padding:',
  '--phone-radius:',
  '--phone-screen-radius:',
  '--phone-notch-width:',
  '--phone-notch-height:',
  '--phone-notch-top:',
  '--phone-shadow:',
]) assert.match(html, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing configurable token ${token}`);

assert.match(html, /data-brand-logo/, 'footer must use replaceable logo slots');
assert.doesNotMatch(html, /<span class="footer-brand"><svg/, 'footer must not duplicate hard-coded inline SVG logos');
assert.match(html, /\.phone\{[^}]*padding:var\(--phone-frame-padding\)/, 'phone frame must consume configurable padding token');
assert.match(html, /\.phone\{[^}]*border-radius:var\(--phone-radius\)/, 'phone frame must consume configurable radius token');
assert.match(html, /\.phone-screen\{[^}]*border-radius:var\(--phone-screen-radius\)/, 'screen must consume configurable radius token');
assert.match(html, /\.notch\{[^}]*top:var\(--phone-notch-top\)[^}]*width:var\(--phone-notch-width\)[^}]*height:var\(--phone-notch-height\)/, 'notch must consume configurable geometry tokens');

const padding = Number((html.match(/--phone-frame-padding:(\d+)px/) || [])[1]);
const notchWidth = Number((html.match(/--phone-notch-width:(\d+)px/) || [])[1]);
const notchHeight = Number((html.match(/--phone-notch-height:(\d+)px/) || [])[1]);
assert.ok(padding <= 3, `phone padding must be <=3px, got ${padding}px`);
assert.ok(notchWidth <= 60, `notch width must be <=60px, got ${notchWidth}px`);
assert.ok(notchHeight <= 14, `notch height must be <=14px, got ${notchHeight}px`);
assert.match(html, /--brand:#176B45/, 'presentation must use canonical action green');
assert.match(html, /--deep:#123C2A/, 'presentation must use canonical deep green');
assert.match(html, /--bg:#F7F8F7/, 'presentation must use canonical light canvas');
assert.equal((html.match(/class="brand-logo-copy"/g) || []).length, 15, 'all slide footers must carry the original repo wordmark treatment');
assert.match(html, /class="slide light-evidence" data-slide="12"/, 'evidence slide should break up consecutive dark slides');

console.log('brand-frame-contract PASS');
