import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const rel = (file) => path.relative(root, file).replaceAll(path.sep, '/');
const src = walk(path.join(root, 'src/app'));
const routeFiles = src.filter((file) => file.endsWith('/route.ts')).sort();
const routes = routeFiles.map((file) => {
  const source = fs.readFileSync(file, 'utf8');
  const methods = [...source.matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/g)].map((m) => m[1]);
  const endpoint = '/' + rel(file).replace(/^src\/app\//, '').replace(/\/route\.ts$/, '');
  return { endpoint, methods, file: rel(file) };
});
const actionFiles = src.filter((file) => /\.(ts|tsx)$/.test(file) && /^['"]use server['"];?/m.test(fs.readFileSync(file, 'utf8'))).sort();
const actions = actionFiles.flatMap((file) => {
  const source = fs.readFileSync(file, 'utf8');
  return [...source.matchAll(/export\s+async\s+function\s+(\w+)\b/g)].map((m) => ({ name: m[1], file: rel(file) }));
});
const clientContracts = [
  'GET /api/ki ← AiSettings.load/useEffect', 'POST /api/ki ← KiChatPage.sendWith',
  'GET /api/ai/byok ← AiSettings.load/useEffect', 'POST /api/ai/byok ← AiSettings.saveKey/disableKey',
  'POST /api/ai/credits ← AiSettings.watchAd', 'GET /api/account/export ← AccountActions.exportData',
  'POST /api/konto-loeschen ← AccountActions.deleteAccount', 'POST /api/telemetry ← CwvTelemetry',
  'POST /api/errors ← ErrorPage', 'POST+PATCH /api/owner/messages/[contactUserId] ← OwnerMessageComposer',
  'POST+PATCH /api/support/messages/[homeownerId] ← ProviderMessageComposer',
];
const lines = ['# API-Endpunkte und Server-Actions — EH-02', '', `Stand: ${new Date().toISOString().slice(0, 10)}. Kanonisches Inventar aus src/app.`, '', '## Client → Server-Verträge', '', ...clientContracts.map((x) => `- ${x}`), '', `## Route Handler (${routes.length})`, '', ...routes.map((r) => `- ${r.methods.join('/')} \`${r.endpoint}\` — \`${r.file}\``), '', `## Server Actions (${actions.length})`, '', ...actions.map((a) => `- \`${a.name}\` — \`${a.file}\``), '', '## EH-02 Gate', '', '- Client-Verträge werden durch `scripts/eh02-api-contract-regression.mjs` geprüft.', '- TODO/FIXME/STUB-Kommentare bzw. echte not-implemented-Throws im TypeScript-Quellbaum sind im Gate verboten.', '- Build muss grün sein.'];
if (process.argv.includes('--write')) fs.writeFileSync(path.join(root, 'docs/API_ENDPOINT_INVENTORY.md'), lines.join('\n') + '\n');
console.log(JSON.stringify({ routes: routes.length, routeMethods: routes.reduce((n, r) => n + r.methods.length, 0), actionFiles: actionFiles.length, actions: actions.length, clientContracts: clientContracts.length }));