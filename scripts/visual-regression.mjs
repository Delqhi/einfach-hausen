#!/usr/bin/env node
// T-0130 Visual-Canonicals (supersedes the T-0152/T-0153 mobile-only run).
// Deterministic visual regression of the public website against
// tests/visual-baselines across the DESIGN.md §14 viewport set
// (390 / tablet / 1320): all 16 public routes, the logged-out app entries
// (/app, /pro redirect targets) and the 404 state screen.
//
// The matrix, the determinism contract and the diff logic live in
// scripts/lib/visual-canonicals.mjs and are shared with the release gate
// (Layer 3), so this run and the gate can never disagree about what
// "canonical" means. Update baselines deliberately: npm run test:visual:update
// (or --viewports=mobile to limit a run, e.g. on a loaded host).
//
// Evidence: .sin-gpt-web/evidence/T-0130/visual-actual/*.png (actual shots)
//           .sin-gpt-web/evidence/T-0130/visual-diff/*.diff.png (failures only)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import {
  APP_ENTRY_ROUTES,
  DEFAULT_PIXEL_BUDGET,
  PUBLIC_ROUTES,
  STATE_ROUTES,
  VIEWPORTS,
  runVisualCanonicals,
} from './lib/visual-canonicals.mjs';

const root = process.cwd();
const update = process.argv.includes('--update-baselines') || process.env.GATE_UPDATE_BASELINES === '1';
const budget = Number(process.env.GATE_PIXEL_BUDGET || DEFAULT_PIXEL_BUDGET);
const viewportArg = (process.argv.find((arg) => arg.startsWith('--viewports=')) || '').replace('--viewports=', '');
const viewports = viewportArg ? viewportArg.split(',').filter((key) => key in VIEWPORTS) : Object.keys(VIEWPORTS);
if (!viewports.length) { console.error(`--viewports must name at least one of: ${Object.keys(VIEWPORTS).join(', ')}`); process.exit(2); }
const routes = [...PUBLIC_ROUTES, ...APP_ENTRY_ROUTES];
const baselineDir = path.join(root, 'tests', 'visual-baselines');
const evidenceDir = path.join(root, '.sin-gpt-web', 'evidence', 'T-0130');
const actualDir = path.join(evidenceDir, 'visual-actual');
const diffDir = path.join(evidenceDir, 'visual-diff');

function browserExecutable() {
  let bundled = '';
  try { bundled = chromium.executablePath(); } catch {}
  const candidates = [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    typeof bundled === 'string' && fs.existsSync(bundled) ? bundled : '',
    '/home/ubuntu/.cache/ms-playwright/chromium-1228/chrome-linux/chrome',
    '/home/ubuntu/.cache/ms-playwright/chromium-1223/chrome-linux/chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) throw new Error('No Chromium browser found; set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH');
  return found;
}

const freePort = () => new Promise((resolve, reject) => {
  const socket = net.createServer();
  socket.unref();
  socket.on('error', reject);
  socket.listen(0, '127.0.0.1', () => { const address = socket.address(); socket.close(() => resolve(typeof address === 'object' && address ? address.port : 0)); });
});

async function waitForServer(url, timeoutMs = 90000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { const response = await fetch(url, { redirect: 'manual' }); if (response.status < 500) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Server did not become ready: ${url}`);
}

if (!fs.existsSync(path.join(root, '.next', 'BUILD_ID'))) {
  console.error('No production build found — run `npm run build` first (or use npm run release-gate).');
  process.exit(2);
}

const port = await freePort();
const base = `http://127.0.0.1:${port}`;
const dbPath = path.join(os.tmpdir(), `eh-visual-${randomUUID()}.db`);
const nextBin = path.join(root, 'node_modules/next/dist/bin/next');
const server = spawn(process.execPath, [nextBin, 'start', '-H', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  env: { ...process.env, DATABASE_PATH: dbPath, ADMIN_PASSWORD: `VisualAdmin!${randomUUID()}`, SESSION_COOKIE_NAME: 'visual_session', NEXT_PUBLIC_APP_URL: base, AUTH_MODE: 'supabase', E2E_INSECURE_COOKIES: '1' },
  stdio: 'ignore',
});
let browser;
let outcome = { results: [], failures: [] };
try {
  await waitForServer(`${base}/`);
  browser = await chromium.launch({ headless: true, executablePath: browserExecutable() });
  outcome = await runVisualCanonicals({ browser, base, routes, states: STATE_ROUTES, viewports, baselineDir, actualDir, diffDir, budget, update, log: console.log });
  const summary = {
    task: 'T-0130',
    generatedAt: new Date().toISOString(),
    viewports,
    routes,
    states: STATE_ROUTES.map((state) => state.name),
    budget,
    results: outcome.results,
  };
  fs.mkdirSync(evidenceDir, { recursive: true });
  fs.writeFileSync(path.join(evidenceDir, 'visual-canonicals.json'), JSON.stringify(summary, null, 2));
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill('SIGTERM');
  for (const suffix of ['', '-wal', '-shm']) { try { fs.rmSync(dbPath + suffix, { force: true }); } catch {} }
}
const counts = outcome.results.reduce((acc, result) => { acc[result.status] = (acc[result.status] || 0) + 1; return acc; }, {});
const countText = Object.entries(counts).map(([status, count]) => `${count} ${status}`).join(', ');
console.log(outcome.failures.length
  ? `FAIL (${countText}): ${outcome.failures.join('; ')}`
  : `visual canonicals: ${outcome.results.length} shots across ${viewports.length} viewport(s) within budget (${countText})`);
process.exit(outcome.failures.length ? 1 : 0);
