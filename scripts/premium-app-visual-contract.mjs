#!/usr/bin/env node
import fs from 'node:fs';

const source = fs.readFileSync(new URL('./app-visual-regression.mjs', import.meta.url), 'utf8');
const failures = [];

const dbPathAssignment = source.indexOf("process.env.DATABASE_PATH = dbPath");
const dbImport = source.indexOf("await import('../src/lib/db.ts')");
if (dbPathAssignment < 0 || dbImport < 0 || dbPathAssignment > dbImport) {
  failures.push('fixture DATABASE_PATH must be set before importing src/lib/db.ts');
}
if (!source.includes('createServerClient')) failures.push('visual identities must create Supabase SSR cookies');
if (!source.includes('context.addCookies')) failures.push('authenticated cookies must be installed in the browser context');
if (!source.includes('authenticated landing')) failures.push('capture must fail closed when the protected landing is not reached');
if (/page\.fill\('input\[type="password"\]'/.test(source)) {
  failures.push('visual capture must not rely on the local-password login form');
}

if (failures.length) {
  console.error('PREMIUM APP VISUAL CONTRACT: RED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PREMIUM APP VISUAL CONTRACT: GREEN');
