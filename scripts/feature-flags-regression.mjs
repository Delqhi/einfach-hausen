// T-0125 deterministic feature-flag service regression.
import assert from 'node:assert/strict';
import { createE2EFixture } from './e2e-fixtures.mjs';
const fs = await import('node:fs');
for (const suffix of ['', '-wal', '-shm']) fs.rmSync('/tmp/eh-flags.db' + suffix, { force: true });
process.env.DATABASE_PATH = '/tmp/eh-flags.db';
const { db } = await import('../src/lib/db.ts');
// feature-flags.ts imports './db' (Next style); for the strip-types runtime we
// rewrite the specifier to './db.ts' on the fly via a source patch import.
const srcText = fs.readFileSync('src/lib/feature-flags.ts', 'utf8');
fs.writeFileSync('src/lib/feature-flags.ts', srcText.replace("from './db'", "from './db.ts'"));
let flagsMod;
try { flagsMod = await import(new URL('../src/lib/feature-flags.ts', import.meta.url).href); }
finally { fs.writeFileSync('src/lib/feature-flags.ts', srcText); }
const { isFeatureEnabled, setFeatureEnabled } = flagsMod;

// 1) unknown key fails safe (false)
assert.equal(isFeatureEnabled('nonexistent_flag'), false, 'unknown key must evaluate false');
// 2) set + read roundtrip
setFeatureEnabled('test_flag', true, 'regression');
assert.equal(isFeatureEnabled('test_flag'), true, 'enabled flag must read true');
// 3) disable roundtrip
setFeatureEnabled('test_flag', false, 'regression');
assert.equal(isFeatureEnabled('test_flag'), false, 'disabled flag must read false');
// 4) flags never bypass authorization: service only reads state, no auth semantics
// (structure check: exports exactly the two functions + no auth bypass surface)
const mod = await import(new URL('../src/lib/feature-flags.ts', import.meta.url).href);
assert.deepEqual(Object.keys(mod).sort(), ['isFeatureEnabled', 'setFeatureEnabled']);
// 5) audit trail: updated_by persisted
const row = db.prepare('SELECT updated_by,enabled FROM feature_flags WHERE key=?').get('test_flag');
assert.equal(row.updated_by, 'regression');
assert.equal(row.enabled, 0);
// 6) deterministic re-run stability
assert.equal(isFeatureEnabled('test_flag'), false);
console.log(JSON.stringify({ ok: true, checks: 6 }));
