#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const routes = [
  ['src/app/login/page.tsx', 'loginPage'],
  ['src/app/register/page.tsx', 'registerPage'],
  ['src/app/register-owner/page.tsx', 'ownerRegister'],
  ['src/app/register-pro/page.tsx', 'proRegister'],
  ['src/app/role/page.tsx', 'rolePage'],
  ['src/app/welcome/page.tsx', 'welcomePage'],
  ['src/app/check-email/page.tsx', 'checkEmail'],
];

const failures = [];
for (const [file, marker] of routes) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  if (!source.includes('auth-convergence.module.css')) failures.push(file + ': missing shared premium auth stylesheet');
  if (!source.includes('auth.' + marker)) failures.push(file + ': missing ' + marker + ' auth convergence marker');
  if (!source.includes('auth.authConverged')) failures.push(file + ': missing shared authConverged root marker');
}

const cssPath = path.join(root, 'src/components/marketing/auth-convergence.module.css');
if (!fs.existsSync(cssPath)) {
  failures.push('src/components/marketing/auth-convergence.module.css: missing shared convergence layer');
} else {
  const css = fs.readFileSync(cssPath, 'utf8');
  for (const token of ['.authConverged', '.authV2Page', '.loginPage', '.registerPage', '.ownerRegister', '.proRegister', '.rolePage', '.welcomePage', '.checkEmail']) {
    if (!css.includes(token)) failures.push('auth convergence css: missing ' + token);
  }
  if (!css.includes('@media (max-width: 880px)')) failures.push('auth convergence css: missing deliberate mobile recomposition');

  const visualContracts = [
    {
      pattern: /\.authV2Page\s+:global\(\.eh-auth-grid\)[^{]*\{[^}]*max-width:\s*1520px;/s,
      failure: 'auth convergence css: v2 auth shell needs the shared 1520px desktop composition',
    },
    {
      pattern: /\.authV2Page\s+:global\(#login-card-container\)[^{]*\{[^}]*max-width:\s*5[2-9]0px;/s,
      failure: 'auth convergence css: v2 auth form must use a premium 520px+ card width',
    },
    {
      pattern: /\.authV2Page\s+:global\(#btn-submit-login\),[\s\S]*?background:\s*var\(--auth-petrol\);/s,
      failure: 'auth convergence css: v2 auth primary actions must use canonical petrol',
    },
    {
      pattern: /\.authV2Page\s+:global\(\.eh-auth-topbar-role-switch\),[\s\S]*?display:\s*none;/s,
      failure: 'auth convergence css: v2 auth topbar must remove duplicate portal chrome',
    },
    {
      pattern: /\.authConverged\s+:global\(\.pill-field\)[^{]*\{[^}]*flex-direction:\s*row;/s,
      failure: 'auth convergence css: auth fields must override the global column label layout',
    },
    {
      pattern: /\.proRegister\s+:global\(\.pro-form\)\s*\{[^}]*background:\s*transparent;[^}]*border:\s*0;[^}]*padding:\s*0;/s,
      failure: 'auth convergence css: provider form must not inherit the dark app form shell',
    },
    {
      pattern: /\.registerPage\s+:global\(\.oreg-benefits\)\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s,
      failure: 'auth convergence css: shared register benefits need a legible two-column mobile composition',
    },
    {
      pattern: /\.ownerRegister\s+:global\(\.oreg-benefits\)\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s,
      failure: 'auth convergence css: owner benefits need a legible two-column mobile composition',
    },
    {
      pattern: /\.proRegister\s+:global\(\.benefit-card\)\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s,
      failure: 'auth convergence css: provider benefits need a legible two-column mobile composition',
    },
  ];
  for (const contract of visualContracts) {
    if (!contract.pattern.test(css)) failures.push(contract.failure);
  }
}

if (failures.length) {
  console.error('PREMIUM AUTH CONTRACT: RED');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log('PREMIUM AUTH CONTRACT: GREEN (' + routes.length + ' routes + shared convergence layer)');
