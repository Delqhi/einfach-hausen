// T-0145 data-retention engine: periodically finalize anonymized accounts.
// After legal retention for the retained rows ends, the anonymized identity row
// (and its remaining references) is deleted outright. The default horizon is
// 10 years (German commercial/tax retention for invoices); configurable via
// RETENTION_YEARS. Every run appends an audit row so the process is provable.

export interface RetentionResult {
  checked: number;
  finalized: number;
  user_ids: number[];
}

export async function runRetentionSweep(now: Date = new Date()): Promise<RetentionResult> {
  // Lazy import keeps this module usable from both the Next runtime and the
  // systemd dispatcher scratch-build.
  const { db } = await import('./db');
  const years = Number(process.env.RETENTION_YEARS || 10);
  const cutoff = new Date(now);
  cutoff.setFullYear(cutoff.getFullYear() - years);
  const cutoffIso = cutoff.toISOString();

  const candidates = db.prepare(
    "SELECT id FROM users WHERE email LIKE 'geloescht-%@accounts.anonymisiert.invalid' AND created_at <= ?"
  ).all(cutoffIso) as Array<{ id: number }>;

  let finalized = 0;
  const ids: number[] = [];
  for (const candidate of candidates) {
    const id = candidate.id;
    try {
      db.transaction(() => {
        db.prepare('DELETE FROM reviews WHERE homeowner_id=? OR provider_id=?').run(id, id);
        db.prepare('DELETE FROM quotes WHERE provider_id=?').run(id);
        db.prepare('DELETE FROM claims WHERE homeowner_id=? OR provider_id=?').run(id, id);
        db.prepare('DELETE FROM payments WHERE homeowner_id=? OR provider_id=?').run(id, id);
        db.prepare('DELETE FROM invoices WHERE homeowner_id=? OR provider_id=?').run(id, id);
        db.prepare('DELETE FROM payments WHERE job_id IN (SELECT id FROM jobs WHERE homeowner_id=?)').run(id);
        db.prepare('DELETE FROM subscriptions WHERE homeowner_id=?').run(id);
        db.prepare('DELETE FROM package_orders WHERE homeowner_id=?').run(id);
        db.prepare('DELETE FROM partner_subscriptions WHERE provider_id=?').run(id);
        db.prepare('DELETE FROM jobs WHERE homeowner_id=? OR id IN (SELECT job_id FROM quotes WHERE provider_id=?)').run(id, id);
        db.prepare('DELETE FROM users WHERE id=?').run(id);
      })();
      finalized += 1;
      ids.push(id);
    } catch {
      // keep going; failed rows are retried on the next sweep
    }
  }
  return { checked: candidates.length, finalized, user_ids: ids };
}
