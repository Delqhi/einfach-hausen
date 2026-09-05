#!/usr/bin/env node
const base = (process.env.BASE_URL || 'http://127.0.0.1:3010').replace(/\/$/, '');
const checks = [
  ['/lexikon', 200],
  ['/lexikon/waermepumpe', 200],
  ['/lexikon/kategorie/heizung-energie', 200],
  ['/lexikon/diesen-begriff-gibt-es-nicht', 404],
  ['/lexikon/kategorie/gibt-es-nicht', 404],
];
let failed = 0;
for (const [path, expected] of checks) {
  const response = await fetch(`${base}${path}`, { redirect: 'manual' });
  const ok = response.status === expected;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${path} status=${response.status} expected=${expected}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
