#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const has = (source, token, label) => { if (!source.includes(token)) failures.push(`${label}: missing ${token}`); };
const lacks = (source, token, label) => { if (source.includes(token)) failures.push(`${label}: forbidden ${token}`); };

const routeFiles = [
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/register-owner/page.tsx',
  'src/app/register-pro/page.tsx',
];
for (const file of routeFiles) {
  const source = read(file);
  has(source, 'AuthShell', file);
  lacks(source, 'auth-convergence.module.css', file);
  lacks(source, 'auth.authConverged', file);
  lacks(source, '<svg', file);
  lacks(source, 'linear-gradient', file);
  lacks(source, 'className=', file);
}

const loginPage = read('src/app/login/page.tsx');
has(loginPage, 'nextPath={sp.next}', 'login route');
lacks(loginPage, 'safeNextPath(', 'login route');
has(loginPage, 'initialAuthMode="login"', 'login route');
const registerPage = read('src/app/register/page.tsx');
has(registerPage, 'initialAuthMode="register"', 'register route');

const ownerRoute = read('src/app/register-owner/page.tsx');
has(ownerRoute, 'initialAuthMode="register"', 'owner registration route');
has(ownerRoute, 'initialRole="kunde"', 'owner registration route');
const providerRoute = read('src/app/register-pro/page.tsx');
has(providerRoute, 'initialAuthMode="register"', 'provider registration route');
has(providerRoute, 'initialRole="handwerker"', 'provider registration route');

const shell = read('src/components/auth-v2/AuthShell.tsx');
for (const token of ['@/design-system', 'EHScope', 'EHLogo', 'EHPageHero', 'EHPanel', 'EHPromiseRow', 'LoginForm']) {
  has(shell, token, 'AuthShell');
}
for (const token of ['auth-shell.css', 'motion/react', 'lucide-react', 'className=', 'rounded-', 'shadow-', 'HeroPanel', './Logo']) {
  lacks(shell, token, 'AuthShell');
}

const form = read('src/components/auth-v2/LoginForm.tsx');
for (const token of ['@/design-system', 'EHField', 'EHInput', 'EHButton', 'EHCheckbox', 'EHErrorState', 'EHFormSection', 'EHFieldGrid', 'EHActions']) {
  has(form, token, 'LoginForm');
}
for (const token of ['motion/react', 'lucide-react', 'className=', 'rounded-', 'shadow-', '#']) {
  lacks(form, token, 'LoginForm');
}
for (const token of ['getSupabase', 'signInWithPassword', 'registerAction', 'safeNextPath']) {
  has(form, token, 'LoginForm auth behavior');
}

for (const token of ['DEMO_USERS', 'DEMO_PASSWORD', 'demoEmailFor', 'btn-demo-kunde', 'btn-demo-handwerker']) {
  has(form, token, 'LoginForm demo behavior');
}

const forgot = read('src/components/auth-v2/ForgotPasswordModal.tsx');
for (const token of ['@/design-system', 'EHDialog', 'EHButton', 'EHText']) has(forgot, token, 'ForgotPasswordModal');
for (const token of ['className=', 'lucide-react', 'rounded-', 'shadow-', '#']) lacks(forgot, token, 'ForgotPasswordModal');

const legal = read('src/components/auth-v2/LegalModal.tsx');
for (const token of ['@/design-system', 'EHDialog', 'EHButton', 'EHHeading', 'EHText']) has(legal, token, 'LegalModal');
for (const token of ['className=', 'lucide-react', 'rounded-', 'shadow-', '#']) lacks(legal, token, 'LegalModal');
has(legal, 'Gina Schulze', 'LegalModal company identity');
has(legal, 'Jeremy Schulze', 'LegalModal company identity');

if (failures.length) {
  console.error(`AUTH EDITION CONTRACT: RED (${failures.length} failures)`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('AUTH EDITION CONTRACT: GREEN — canonical design-system auth across login + registration');
