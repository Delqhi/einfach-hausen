#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const brand = JSON.parse(readFileSync(path.join(here, 'brand.config.json'), 'utf8'));
const html = readFileSync(path.join(here, 'deck.html'), 'utf8');

assert.equal(brand.brand.colors.primary, '#176B45');
assert.equal(brand.brand.colors.secondary, '#123C2A');
assert.equal(brand.brand.colors.canvas, '#F7F8F7');
assert.equal(brand.brand.colors.surface, '#FFFFFF');
assert.equal(brand.brand.colors.surfaceMuted, '#F2F4F2');
assert.equal(brand.brand.colors.text, '#171A18');
assert.equal(brand.brand.colors.muted, '#66706A');
assert.equal(brand.brand.colors.border, '#E4E8E5');
assert.equal(brand.brand.colors.accent, '#238454');

assert.equal(brand.brand.logo.src, 'assets/branding/einfachhausen-mark.svg');
assert.equal(brand.brand.logo.source, '../../public/brand/einfachhausen-mark.svg');
assert.equal(brand.brand.logo.variant, 'original');
assert.equal(brand.brand.logo.heroHeight, 60);
assert.equal(brand.brand.logo.footerHeight, 26);
assert.equal(brand.brand.logo.maxWidth, 188);
assert.equal(brand.brand.logo.safeArea, 8);
assert.equal(brand.brand.logo.darkMode, 'surface');

const originalLogo = readFileSync(path.join(repo, 'public/brand/einfachhausen-mark.svg'));
const presentationLogo = readFileSync(path.join(here, brand.brand.logo.src));
assert.deepEqual(presentationLogo, originalLogo, 'presentation logo copy must be byte-identical to repository source');

assert.equal(brand.devices.phone.framePx, 3);
assert.equal(brand.qa.maxPhoneFramePx, 5);
assert.ok(brand.devices.phone.framePx <= brand.qa.maxPhoneFramePx, 'phone frame exceeds QA maximum');
assert.deepEqual(brand.rhythm.darkSlides, [1, 11, 15]);

assert.match(html, /Brand source: brand\.config\.json/);
assert.match(html, /--brand:#176B45/);
assert.match(html, /--deep:#123C2A/);
assert.match(html, /--bg:#F7F8F7/);
assert.match(html, /--ink:#171A18/);
assert.match(html, /--muted:#66706A/);
assert.match(html, /--line:#E4E8E5/);
assert.match(html, /--brand-logo-src:url\("\.\/assets\/branding\/einfachhausen-mark\.svg"\)/);
assert.match(html, /--phone-frame-padding:3px/);
assert.match(html, /data-brand-logo/);

const darkSlides = [...html.matchAll(/<section class="slide dark" data-slide="(\d+)"/g)].map((m) => Number(m[1]));
assert.deepEqual(darkSlides, brand.rhythm.darkSlides, 'deck dark-slide rhythm differs from brand config');
assert.match(html, /<section class="slide light-evidence" data-slide="12">/);
assert.doesNotMatch(html, /<section class="slide dark" data-slide="12">/);
assert.doesNotMatch(html, /#0B3D2A/i, 'legacy deep green must not return');
assert.doesNotMatch(html, /#0B6B43/i, 'legacy primary green must not return');

console.log('brand-config-contract PASS');
