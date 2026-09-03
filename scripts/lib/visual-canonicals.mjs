// T-0130 Visual-Canonicals: the ONE deterministic definition of what the
// website looks like, shared by scripts/release-gate.mjs (Layer 3) and
// scripts/visual-regression.mjs. Before this module the two scripts carried
// two copies of the matrix and drifted (gate: 9 routes, standalone: 11 routes,
// both mobile-only). DESIGN.md §14 requires 390 / tablet / 1320 without
// overflow or breaks, so the canonical matrix is route x viewport.
//
// Determinism contract (why screenshots are reproducible run-to-run):
//   - light color scheme, de-DE locale, Europe/Berlin timezone, DPR 1
//   - prefers-reduced-motion: reduce (DESIGN.md §12) PLUS an injected
//     stylesheet that hard-stops any remaining animation/transition and hides
//     the text caret, so mid-frame states can never be captured
//   - self-hosted Inter (src/fonts) + explicit `document.fonts.ready` wait,
//     so no FOUT frame is baselined
//   - `[data-visual-volatile]` lets a component opt out of pixel comparison
//     (live clocks, random imagery) without a code-level test hook
//   - viewport-only screenshots (no fullPage): the lazy-image / scroll-motion
//     components (T-0211) would otherwise capture scroll-position-dependent
//     intermediate states
//
// Baseline naming keeps the historical mobile names (home.png,
// so-funktionierts.png, ...) so the existing tests/visual-baselines set stays
// valid; tablet/desktop canonicals get an `@tablet` / `@desktop` suffix.
// Missing baselines are created on first run (never a failure), exactly like
// the gate behaved before. Failures write a diff PNG next to the actual shot.

import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export const VIEWPORTS = Object.freeze({
  mobile: Object.freeze({ width: 390, height: 844 }),
  tablet: Object.freeze({ width: 834, height: 1194 }),
  desktop: Object.freeze({ width: 1320, height: 900 }),
});

// DESIGN.md §5.1 target structure: every primary navigation item is an
// indexable page. All 16 public routes are canonical; none is optional.
export const PUBLIC_ROUTES = Object.freeze([
  '/',
  '/so-funktionierts',
  '/eigenheimbesitzer',
  '/leistungen',
  '/hausakte',
  '/partner',
  '/preise',
  '/ueber-uns',
  '/hilfe',
  '/kontakt',
  '/sicherheit',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/login',
  '/welcome',
]);

// Logged-out app entry points: the auth redirect target is part of the
// visual contract (a broken redirect shows up as a different canonical).
export const APP_ENTRY_ROUTES = Object.freeze(['/app', '/pro']);

// DESIGN.md §5.4 / §10: states for error, 404 and loading are part of the
// platform surface. The 404 canonical is reachable through any unknown path.
// error.tsx / loading.tsx need a thrown error / a pending stream and cannot be
// reached deterministically from the outside without a test-only route, so
// they have NO automated canonical; DESIGN.md §10 requires manual screenshot
// evidence whenever they change. Adding a test-only trigger route to the app
// would be a product-code change and is deliberately out of scope here.
export const STATE_ROUTES = Object.freeze([
  Object.freeze({ route: '/__visual-canonical-404__', name: 'state-404', expectStatus: 404 }),
]);

// The gate's historical 9-route mobile matrix stays available so the release
// gate keeps its exact semantics; the standalone run uses the full matrix.
export const GATE_ROUTES = Object.freeze(['/', '/so-funktionierts', '/leistungen', '/preise', '/partner', '/hilfe', '/kontakt', '/login', '/welcome']);

export const DEFAULT_PIXEL_BUDGET = 0.08;
export const PIXELMATCH_THRESHOLD = 0.1;

export const DETERMINISM_CSS = `
*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
  caret-color: transparent !important;
}
[data-visual-volatile] { visibility: hidden !important; }
`;

export function canonicalName(route, viewportKey = 'mobile') {
  const base = route === '/' ? 'home' : route.replaceAll('/', '_').replace(/^_/, '');
  return viewportKey === 'mobile' ? base : `${base}@${viewportKey}`;
}

export function canonicalContextOptions(viewportKey = 'mobile') {
  const viewport = VIEWPORTS[viewportKey];
  if (!viewport) throw new Error(`Unknown canonical viewport: ${viewportKey}`);
  return {
    viewport: { ...viewport },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    colorScheme: 'light',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    serviceWorkers: 'block',
  };
}

// Navigate + settle. Returns { reachable, status }. Never throws for a route
// that simply fails: the caller records the failure as a canonical result so
// one broken page cannot hide the state of all the others.
export async function settleCanonicalPage(page, url, { expectStatus = null, timeout = 60000 } = {}) {
  let status = 0;
  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout });
    status = response ? response.status() : 0;
  } catch {
    return { reachable: false, status };
  }
  const reachable = expectStatus === null ? status > 0 && status < 500 : status === expectStatus;
  if (!reachable) return { reachable: false, status };
  await page.addStyleTag({ content: DETERMINISM_CSS }).catch(() => {});
  await page.evaluate(() => (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())).catch(() => {});
  // React 19 streaming can keep a transient second tree briefly after
  // networkidle; the settle wait matches the gate's historical 600ms.
  await page.waitForTimeout(600);
  return { reachable: true, status };
}

export function compareCanonical({ name, actualPath, baselineDir, diffDir, budget = DEFAULT_PIXEL_BUDGET, update = false }) {
  const baselinePath = path.join(baselineDir, `${name}.png`);
  if (!fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    return { name, status: 'created', ratio: 0, detail: 'baseline created' };
  }
  if (update) {
    fs.copyFileSync(actualPath, baselinePath);
    return { name, status: 'updated', ratio: 0, detail: 'baseline updated' };
  }
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const actual = PNG.sync.read(fs.readFileSync(actualPath));
  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    return { name, status: 'fail', ratio: 1, detail: `size ${baseline.width}x${baseline.height} -> ${actual.width}x${actual.height}` };
  }
  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const changed = pixelmatch(baseline.data, actual.data, diff.data, baseline.width, baseline.height, { threshold: PIXELMATCH_THRESHOLD });
  const ratio = changed / (baseline.width * baseline.height);
  if (ratio > budget) {
    if (diffDir) {
      fs.mkdirSync(diffDir, { recursive: true });
      fs.writeFileSync(path.join(diffDir, `${name}.diff.png`), PNG.sync.write(diff));
    }
    return { name, status: 'fail', ratio, detail: `${(ratio * 100).toFixed(2)}% pixels changed (budget ${(budget * 100).toFixed(0)}%)` };
  }
  return { name, status: 'pass', ratio, detail: `${(ratio * 100).toFixed(2)}%` };
}

// Full canonical run over a route x viewport matrix. `browser` is an already
// launched Playwright browser; `base` the origin of a running production
// server. Returns per-canonical results plus a `failures` list of strings the
// callers already know how to report.
export async function runVisualCanonicals({
  browser,
  base,
  routes = PUBLIC_ROUTES,
  states = STATE_ROUTES,
  viewports = Object.keys(VIEWPORTS),
  baselineDir,
  actualDir,
  diffDir,
  budget = DEFAULT_PIXEL_BUDGET,
  update = false,
  log = () => {},
}) {
  fs.mkdirSync(baselineDir, { recursive: true });
  fs.mkdirSync(actualDir, { recursive: true });
  const results = [];
  for (const viewportKey of viewports) {
    const context = await browser.newContext(canonicalContextOptions(viewportKey));
    const page = await context.newPage();
    const targets = [
      ...routes.map((route) => ({ route, name: canonicalName(route, viewportKey), expectStatus: null })),
      ...states.map((state) => ({ route: state.route, name: canonicalName(`/${state.name}`, viewportKey), expectStatus: state.expectStatus })),
    ];
    for (const target of targets) {
      const actualPath = path.join(actualDir, `${target.name}.png`);
      const { reachable, status } = await settleCanonicalPage(page, `${base}${target.route}`, { expectStatus: target.expectStatus });
      if (!reachable) {
        results.push({ name: target.name, status: 'fail', ratio: 1, detail: `route not reachable (http ${status || 'n/a'})` });
        continue;
      }
      await page.screenshot({ path: actualPath, fullPage: false });
      const result = compareCanonical({ name: target.name, actualPath, baselineDir, diffDir, budget, update });
      results.push(result);
      if (result.status === 'created' || result.status === 'updated') log(`  baseline ${result.status}: ${target.name}.png`);
    }
    await context.close();
  }
  const failures = results.filter((result) => result.status === 'fail').map((result) => `${result.name}: ${result.detail}`);
  return { results, failures };
}
