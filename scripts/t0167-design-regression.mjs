import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const bottomNav = read('src/components/bottom-nav.tsx');
const navConfig = read('src/components/nav-config.ts');
const shell = read('src/components/shell.tsx');
const css = read('src/app/design-system.css');
const globals = read('src/app/globals.css');
const login = read('src/app/login/page.tsx');
const register = read('src/app/register/page.tsx');
const ownerCss = read('src/app/app/homeowner.module.css');
const providerCss = read('src/app/pro/provider-workspace.module.css');
const providerLoading = read('src/app/pro/loading.tsx');
const ownerDashboard = read('src/app/app/page.tsx');
const ownerJobs = read('src/app/app/jobs/page.tsx');
const ownerHome = read('src/app/app/home/page.tsx');
const ownerMessages = read('src/app/app/messages/page.tsx');
const providerDashboard = read('src/app/pro/page.tsx');
const providerJob = read('src/app/pro/jobs/[id]/page.tsx');
const providerTeam = read('src/app/pro/team/page.tsx');

const results = [];
function check(name, condition) {
  results.push({ name, ok: Boolean(condition) });
}

check('owner fallback /app/more route remains', navConfig.includes("'/app/more'") && bottomNav.includes('href={href}'));
check('provider requests route unchanged', navConfig.includes("'/pro'"));
check('provider orders route unchanged', navConfig.includes("'/pro/orders'"));
check('provider messages route unchanged', navConfig.includes("'/pro/messages'"));
check('provider team route unchanged', navConfig.includes("'/pro/team'"));
check('provider profile route unchanged', navConfig.includes("'/pro/profile'"));
check('owner mobile nav has native dialog', /<dialog\b/.test(bottomNav));
check('owner more trigger announces dialog', /aria-haspopup=["'{]+dialog/.test(bottomNav));
check('owner more trigger exposes expanded state', bottomNav.includes('aria-expanded'));
check('mobile menu has accessible label', /aria-label=.*Menü|aria-labelledby/.test(bottomNav));
check('dialog has dedicated sheet class', bottomNav.includes('mobile-menu-sheet'));
check('dialog backdrop styling exists', css.includes('.mobile-menu-sheet::backdrop'));
check('AppShell BottomNav API remains unchanged', shell.includes('<BottomNav role={role} active={active}/>'));
check('login keeps server action', login.includes('action={loginAction}'));
check('login keeps email and password fields', login.includes('name="email"') && login.includes('name="password"'));
check('register keeps server action and role field', register.includes('action={registerAction}') && register.includes('name="role"'));
check('auth uses reference-specific visual classes', login.includes('auth-reference') && register.includes('auth-reference'));
check('auth primary action uses shared green token', css.includes('.auth-reference .btn.primary') && css.includes('var(--eh-green-700)'));
check('auth controls meet minimum target height', css.includes('.auth-reference input') && css.includes('min-height:46px'));
check('auth mobile fields keep 16px text', css.includes('.auth-reference input') && css.includes('font-size:16px'));
check('auth card is restrained and rounded', css.includes('.auth-reference-card') && css.includes('border-radius:20px'));
check('canonical shared green token palette exists', ['--eh-green-900:#123c2a','--eh-green-700:#176b45','--eh-green-600:#238454','--eh-green-100:#eaf5ee','--eh-green-50:#f4faf6'].every((token) => css.includes(token)));
check('legacy globals alias canonical tokens', globals.includes('--green:var(--eh-green-700)') && globals.includes('--muted:var(--eh-muted)') && globals.includes('--line:var(--eh-border)') && globals.includes('--bg:var(--eh-canvas)'));
check('active provider shell uses light semantic class', shell.includes("app-shell-v3 provider-theme") && !shell.includes("app-shell-v3 pro-theme"));
check('provider loading state uses light semantic class', providerLoading.includes('provider-theme') && !providerLoading.includes('pro-theme'));
check('provider scoped CSS targets light semantic class', providerCss.includes('.app-shell-v3.provider-theme') && !providerCss.includes('.app-shell-v3.pro-theme'));
check('shared design system has no active dark pro shell selector', !css.includes('.app-shell-v3.pro-theme'));
check('provider logo no longer requests inverse branding', !shell.includes('Logo inverse={pro}'));
check('owner scope aliases shared visual tokens', ownerCss.includes('--owner-green-700: var(--eh-green-700)') && ownerCss.includes('--owner-bg: var(--eh-canvas)'));
check('provider scope aliases shared visual tokens', providerCss.includes('--provider-green-700: var(--eh-green-700)') && providerCss.includes('--provider-canvas: var(--eh-canvas)'));
check('owner scoped UI has no sub-12px type', !/font-size:\s*(?:8|9|10|11)(?:\.\d+)?px/.test(ownerCss));
check('provider scoped UI has no sub-12px type', !/font-size:\s*(?:8|9|10|11)(?:\.\d+)?px/.test(providerCss));
check('owner mobile bottom navigation is readable', /bottom-nav a\)[\s\S]{0,180}font-size:\s*12px/.test(ownerCss));
check('provider bottom navigation is readable', /bottom-nav a\)[\s\S]{0,180}font-size:\s*12px/.test(providerCss));
check('owner forms keep 46px minimum controls', ownerCss.includes('min-height: 46px'));
check('provider forms keep 46px minimum controls', providerCss.includes('min-height: 46px'));
check('owner reduced motion remains', ownerCss.includes('@media (prefers-reduced-motion: reduce)'));
check('provider reduced motion remains', providerCss.includes('@media (prefers-reduced-motion: reduce)'));
check('owner dashboard is composer-first', ownerDashboard.indexOf('owner-copilot') > -1 && ownerDashboard.indexOf('owner-copilot') < ownerDashboard.indexOf('owner-next-section'));
check('owner dashboard preserves explicit no-order promise', ownerDashboard.includes('Kein Auftrag ohne deine Freigabe'));
check('owner jobs remain status-led list rows', ownerJobs.includes('mobile-job-card') && ownerJobs.includes('status ${j.status}'));
check('owner house record stays grouped around durable sections', ['/app/home/history','/app/documents','/app/year','/app/home/sale'].every((route) => ownerHome.includes(route)));
check('owner messages remain categorized conversation threads', ownerMessages.includes('contact-category-groups') && ownerMessages.includes('data-message-thread="owner"'));
check('provider queue exposes operational metadata and next action', providerDashboard.includes('provider-row-meta') && providerDashboard.includes('provider-next-action') && providerDashboard.includes('<ProviderAccessBoundary'));
check('provider order detail remains state-driven', ['ProviderNextStep','markInProgressAction','markCompleteAction','InvoiceForm'].every((term) => providerJob.includes(term)));
check('provider team stays people-first with one manage-jobs authority', providerTeam.includes('Menschen statt Rollenmatrix') && providerTeam.includes('name="canManageJobs"') && providerTeam.includes('Aufträge verwalten'));
check('no provider page emits legacy pro-theme class', ![shell, providerLoading, providerDashboard, providerJob, providerTeam].some((source) => source.includes('pro-theme')));

const failed = results.filter((r) => !r.ok);
for (const result of results) {
  console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.name}`);
}
console.log(`\n${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exit(1);
