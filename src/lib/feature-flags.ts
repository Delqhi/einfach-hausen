// T-0138/T-0126 minimal typed feature flags: read-through with a safe default.
// Flags are DB-backed so they flip without a deploy; unknown keys are false.
import { db } from './db';

export function isFeatureEnabled(key: string): boolean {
  try {
    const row = db.prepare('SELECT enabled FROM feature_flags WHERE key=?').get(key) as { enabled: number } | undefined;
    return Boolean(row?.enabled);
  } catch {
    return false;
  }
}

export function setFeatureEnabled(key: string, enabled: boolean, updatedBy: string): void {
  db.prepare(`INSERT INTO feature_flags(key,enabled,updated_by,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET enabled=excluded.enabled, updated_by=excluded.updated_by, updated_at=CURRENT_TIMESTAMP`)
    .run(key, enabled ? 1 : 0, updatedBy);
}
