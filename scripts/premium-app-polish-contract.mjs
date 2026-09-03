#!/usr/bin/env node
import fs from 'node:fs';

const owner = fs.readFileSync(new URL('../src/app/app/homeowner.module.css', import.meta.url), 'utf8');
const provider = fs.readFileSync(new URL('../src/app/pro/provider-workspace.module.css', import.meta.url), 'utf8');
const ownerPage = fs.readFileSync(new URL('../src/app/app/page.tsx', import.meta.url), 'utf8');
const providerPage = fs.readFileSync(new URL('../src/app/pro/page.tsx', import.meta.url), 'utf8');
const failures = [];

for (const [label, source, checks] of [
  ['owner', owner, ['premium app convergence', '.qa-card:hover', '.ki-card', '.ov-card:hover', 'prefers-reduced-motion']],
  ['provider', provider, ['premium app convergence', '.pdx-stats', '.pdx-stat', '.partner-standard-banner', 'prefers-reduced-motion']],
]) {
  for (const check of checks) if (!source.includes(check)) failures.push(`${label} CSS missing ${check}`);
}

for (const label of ['Auftrag', 'Beratung', 'Notfall', 'Als Nächstes']) {
  if (!ownerPage.includes(label)) failures.push(`owner structure lost ${label}`);
}
for (const label of ['Anfragen in deiner Nähe', 'Nächste Termine', '/pro/orders', '/pro/calendar']) {
  if (!providerPage.includes(label)) failures.push(`provider structure lost ${label}`);
}

if (failures.length) {
  console.error('PREMIUM APP POLISH CONTRACT: RED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PREMIUM APP POLISH CONTRACT: GREEN (navigation and core structure locked)');
