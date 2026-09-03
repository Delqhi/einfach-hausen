#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const expectations = [
  {
    file: 'src/app/eigenheimbesitzer/page.tsx',
    asset: '/images/premium/hero-homeowner.jpg',
    forbidden: 'HeroChoices',
    label: 'owner route',
  },
  {
    file: 'src/app/kontakt/page.tsx',
    asset: '/images/premium/story-ansprechpartner.jpg',
    forbidden: 'HeroContact',
    label: 'contact route',
  },
];

const failures = [];
for (const expectation of expectations) {
  const source = fs.readFileSync(path.join(root, expectation.file), 'utf8');
  if (!source.includes('HeroEditorialPhoto')) {
    failures.push(expectation.label + ': missing shared editorial photo hero');
  }
  if (!source.includes(expectation.asset)) {
    failures.push(expectation.label + ': missing page-specific premium photo asset');
  }
  if (source.includes(expectation.forbidden)) {
    failures.push(expectation.label + ': still uses abstract SaaS-style hero mockup');
  }
}

if (failures.length) {
  console.error('PREMIUM PUBLIC HERO CONTRACT: RED');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log('PREMIUM PUBLIC HERO CONTRACT: GREEN (' + expectations.length + ' photo-led routes)');
