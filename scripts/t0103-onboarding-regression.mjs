import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0103-src-'));
fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
const rel = 'src/lib/onboarding.ts';
const src = fs.readFileSync(path.join(root, rel), 'utf8');
const stripped = stripTypeScriptTypes(src);
const dest = path.join(scratch, 'onboarding.mjs');
fs.writeFileSync(dest, stripped);

let passed = 0;
const failures = [];
function check(name, condition, detail = '') {
  if (condition) { passed++; console.log(`  ok  ${name}`); }
  else { failures.push(`${name}${detail ? ` :: ${detail}` : ''}`); console.error(`FAIL  ${name}${detail ? ` :: ${detail}` : ''}`); }
}

try {
  const ob = await import(pathToFileURL(dest).href);

  check('steps are explicit and ordered', JSON.stringify(ob.ONBOARDING_STEPS) === JSON.stringify(['profile', 'interests', 'contact']));
  check('normalize collapses junk to done', ob.normalizeOnboardingState('garbage') === 'done' && ob.normalizeOnboardingState(undefined) === 'done');
  check('next from profile is interests', ob.nextOnboardingStep('profile') === 'interests');
  check('next from contact is done', ob.nextOnboardingStep('contact') === 'done');
  check('next from done is null', ob.nextOnboardingStep('done') === null);

  // Happy path advances step by step.
  let d = ob.decideOnboardingTransition('profile', 'profile');
  check('profile save advances', d.kind === 'advance' && d.to === 'interests');
  d = ob.decideOnboardingTransition('interests', 'interests');
  check('interests save advances', d.kind === 'advance' && d.to === 'contact');
  d = ob.decideOnboardingTransition('contact', 'contact');
  check('contact save completes', d.kind === 'advance' && d.to === 'done');

  // Idempotent replay of an earlier step keeps the pointer.
  d = ob.decideOnboardingTransition('contact', 'profile');
  check('earlier-step replay keeps state', d.kind === 'keep');
  d = ob.decideOnboardingTransition('done', 'contact');
  check('completed onboarding never regresses', d.kind === 'invalid');

  // Out-of-order progression is refused server-side.
  d = ob.decideOnboardingTransition('profile', 'contact');
  check('skipping ahead is invalid', d.kind === 'invalid');
  d = ob.decideOnboardingTransition('profile', 'interests');
  check('one-step-ahead action is invalid', d.kind === 'invalid');
} catch (error) {
  failures.push(`module load failed :: ${error.message}`);
  console.error(error);
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
