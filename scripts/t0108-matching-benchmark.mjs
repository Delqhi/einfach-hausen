import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0108-src-'));
fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
const src = fs.readFileSync(path.join(root, 'src/lib/matching.ts'), 'utf8');
const dest = path.join(scratch, 'matching.mjs');
fs.writeFileSync(dest, stripTypeScriptTypes(src));

let passed = 0;
const failures = [];
function check(name, condition, detail = '') {
  if (condition) { passed++; console.log(`  ok  ${name}`); }
  else { failures.push(`${name}${detail ? ` :: ${detail}` : ''}`); console.error(`FAIL  ${name}${detail ? ` :: ${detail}` : ''}`); }
}

// Regression corpus: deterministic candidate scenarios with calibrated
// expectations. Each case states which of two candidates must win and why.
const corpus = [
  {
    name: 'relationship beats raw distance',
    a: { qualityVerified: 3, distanceKm: 2, rating: 4.5, existingRelationship: true, openJobs: 0, emergencyPoints: 0 },
    b: { qualityVerified: 3, distanceKm: 0.5, rating: 4.5, existingRelationship: false, openJobs: 0, emergencyPoints: 0 },
    winner: 'a', because: '+30 relationship outweighs ~15 distance advantage',
  },
  {
    name: 'full verification outranks partial at equal footing',
    a: { qualityVerified: 4, distanceKm: 20, rating: 4, existingRelationship: false, openJobs: 0, emergencyPoints: 0 },
    b: { qualityVerified: 1, distanceKm: 1, rating: 4, existingRelationship: false, openJobs: 0, emergencyPoints: 0 },
    winner: 'a', because: '45 quality points dominate the ~19 distance gap',
  },
  {
    name: 'overloaded partner is calibrated down',
    a: { qualityVerified: 2, distanceKm: 10, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 0 },
    b: { qualityVerified: 2, distanceKm: 10, rating: 0, existingRelationship: false, openJobs: 30, emergencyPoints: 0 },
    winner: 'a', because: '-20 capacity clamp keeps unbookable partners behind',
  },
  {
    name: 'emergency readiness counts only in emergency mode',
    a: { qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 12 },
    b: { qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 0 },
    winner: 'a', because: 'emergency response strength adds up to +30',
  },
];

try {
  const m = await import(pathToFileURL(dest).href);

  for (const c of corpus) {
    const sa = m.explainMatchScore(c.a).score;
    const sb = m.explainMatchScore(c.b).score;
    check(`corpus: ${c.name}`, sa > sb, `${c.because} (a=${sa} b=${sb})`);
  }

  // Calibration invariants on single candidates.
  const perfect = m.explainMatchScore({ qualityVerified: 4, distanceKm: 0, rating: 5, existingRelationship: true, openJobs: 0, emergencyPoints: 30 });
  check('theoretical maximum caps at exactly 200', perfect.score === 200);
  const worst = m.explainMatchScore({ qualityVerified: 0, distanceKm: 100, rating: 0, existingRelationship: false, openJobs: 50, emergencyPoints: -8 });
  check('worst case goes negative but bounded', worst.score >= -40 && worst.score < 0);

  // Emergency response scoring calibration.
  const measured = m.emergencyResponseScore({ averageResponseMinutes: 10, responseSamples: 5, responseTargetMinutes: null });
  const declared = m.emergencyResponseScore({ averageResponseMinutes: null, responseSamples: 0, responseTargetMinutes: 60 });
  check('measured response beats declared target', measured > declared, `measured=${measured} declared=${declared}`);
  check('no data falls back to neutral default', m.emergencyResponseScore({ averageResponseMinutes: null, responseSamples: 0, responseTargetMinutes: null }) === 8);

  // Short-notice window calibration.
  const now = new Date('2026-03-15T10:00:00Z');
  check('same-day request is short notice', m.preferredRequestWindow({ preferredDate: '2026-03-15', preferredTime: '18:00', now }).shortNotice === true);
  check('next week request is not short notice', m.preferredRequestWindow({ preferredDate: '2026-03-22', preferredTime: '10:00', now }).shortNotice === false);
  check('past dates expire', m.preferredRequestWindow({ preferredDate: '2026-03-14', preferredTime: '10:00', now }).expired === true);

  // Benchmark: scoring throughput stays far above dispatch needs.
  const started = Date.now();
  let sink = 0;
  for (let i = 0; i < 5000; i++) {
    sink += m.explainMatchScore({ qualityVerified: i % 5, distanceKm: i % 37, rating: (i % 50) / 10, existingRelationship: i % 7 === 0, openJobs: i % 11, emergencyPoints: i % 13 === 0 ? 8 : 0 }).score;
  }
  const elapsed = Date.now() - started;
  check(`benchmark: 5000 scorings under 500ms (took ${elapsed}ms)`, elapsed < 500);
  check('benchmark computed real scores', Number.isFinite(sink) && sink !== 0);
} catch (error) {
  failures.push(`module load failed :: ${error.message}`);
  console.error(error);
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
