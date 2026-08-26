import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'eh-t0107-src-'));
fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
const rel = 'src/lib/matching.ts';
const src = fs.readFileSync(path.join(root, rel), 'utf8');
const dest = path.join(scratch, 'matching.mjs');
fs.writeFileSync(dest, stripTypeScriptTypes(src));

let passed = 0;
const failures = [];
function check(name, condition, detail = '') {
  if (condition) { passed++; console.log(`  ok  ${name}`); }
  else { failures.push(`${name}${detail ? ` :: ${detail}` : ''}`); console.error(`FAIL  ${name}${detail ? ` :: ${detail}` : ''}`); }
}

try {
  const m = await import(pathToFileURL(dest).href);

  const { reasons, score } = m.explainMatchScore({ qualityVerified: 4, distanceKm: 12.34, rating: 4.5, existingRelationship: true, openJobs: 2, emergencyPoints: 0 });
  const sum = reasons.reduce((s, r) => s + r.points, 0);
  check('reason points sum exactly to the score', Math.round(sum * 10) / 10 === score, `sum=${sum} score=${score}`);
  check('quality contributes 60 at 4/4', reasons.find(r => r.key === 'quality')?.points === 60);
  check('relationship bonus is explicit', reasons.find(r => r.key === 'relationship')?.points === 30);
  check('distance label carries kilometres', /12,3 km|12\.3 km/.test(reasons.find(r => r.key === 'distance')?.label || '') || (reasons.find(r => r.key === 'distance')?.label || '').includes('12'));
  check('reasons sorted by absolute impact', Math.abs(reasons[0].points) >= Math.abs(reasons[reasons.length - 1].points));
  check('score is deterministic for identical input', m.explainMatchScore({ qualityVerified: 4, distanceKm: 12.34, rating: 4.5, existingRelationship: true, openJobs: 2, emergencyPoints: 0 }).score === score);

  const noGeo = m.explainMatchScore({ qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 5 });
  check('missing geo falls back to regional points with honest label', noGeo.reasons.some(r => r.key === 'distance' && r.points === 10 && r.label.includes('ohne exakte Distanz')));
  check('emergency strength appears only when relevant', noGeo.reasons.some(r => r.key === 'emergency' && r.points === 5));
  const baseline = m.explainMatchScore({ qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 0 });
  check('capacity neutral at zero open jobs', baseline.reasons.find(r => r.key === 'capacity')?.points === 10);

  const overloaded = m.explainMatchScore({ qualityVerified: 0, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 30, emergencyPoints: 0 });
  check('capacity penalty clamps at -20', overloaded.reasons.find(r => r.key === 'capacity')?.points === -20);

  // Availability freshness (EH T-0109): stale data is penalized, fresh is free.
  check('fresh classification within 90 days', m.classifyAvailabilityFreshness('2026-08-01 00:00:00', new Date('2026-08-26T12:00:00Z')) === 'fresh');
  check('stale beyond 90 days', m.classifyAvailabilityFreshness('2026-01-15 00:00:00', new Date('2026-08-26T12:00:00Z')) === 'stale');
  check('missing timestamp classifies unknown', m.classifyAvailabilityFreshness(null) === 'unknown' && m.classifyAvailabilityFreshness('garbage') === 'unknown');
  const stale = m.explainMatchScore({ qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 0, availabilityFreshness: 'stale' });
  check('stale availability penalized -6 with honest label', stale.reasons.find(r => r.key === 'availability_freshness')?.points === -6 && stale.reasons.find(r => r.key === 'availability_freshness')?.label.includes('90 Tagen'));
  const unknown = m.explainMatchScore({ qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 0, availabilityFreshness: 'unknown' });
  check('unknown availability mildly penalized -3', unknown.reasons.find(r => r.key === 'availability_freshness')?.points === -3);
  const fresh = m.explainMatchScore({ qualityVerified: 2, distanceKm: null, rating: 0, existingRelationship: false, openJobs: 0, emergencyPoints: 0, availabilityFreshness: 'fresh' });
  check('fresh availability adds no reason and no points', !fresh.reasons.some(r => r.key === 'availability_freshness'));
  check('points still sum to score with freshness penalties', [stale, unknown, fresh].every(x => Math.round(x.reasons.reduce((s, r) => s + r.points, 0) * 10) / 10 === x.score));
} catch (error) {
  failures.push(`module load failed :: ${error.message}`);
  console.error(error);
}

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
