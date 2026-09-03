import { db } from '../db';

const MAX_DETAIL = 500;
const EVENT_RETENTION_DAYS = 90;

// Defense in depth: credential-shaped key/value material is redacted before it
// can reach storage, even when a future caller passes it by mistake.
const SECRET_PAIR = /([?&;"'\s]|^)((?:password|passwort|passwd|pwd|token|secret|api[-_]?key|authorization|auth|session|cookie)[a-z0-9_-]*\s*[=:]\s*)([^\s;&"']+)/gi;

function clean(value: string): string {
  const redacted = String(value ?? '').replace(SECRET_PAIR, '$1$2[redacted]');
  return redacted.slice(0, MAX_DETAIL);
}

export type SecurityEventKind =
  | 'auth_register'
  | 'auth_register_fail'
  | 'account_delete'
  | 'account_export'
  | 'auth_login_ok'
  | 'auth_login_fail'
  | 'admin_login_ok'
  | 'admin_login_fail'
  | 'review_reported'
  | 'rate_limit_block'
  | 'rate_limit_blocked_request'
  | 'security_validation_reject';

function pruneAgedEvents(): void {
  db.prepare(`DELETE FROM security_events WHERE created_at < datetime('now', ?)`)
    .run(`-${EVENT_RETENTION_DAYS} days`);
  db.prepare(`DELETE FROM admin_audit_log WHERE created_at < datetime('now', ?)`)
    .run(`-${EVENT_RETENTION_DAYS} days`);
}

export function logSecurityEvent(kind: SecurityEventKind, identifier = '', detail = ''): void {
  try {
    db.prepare('INSERT INTO security_events(kind,identifier,detail) VALUES(?,?,?)').run(
      clean(kind), clean(identifier), clean(detail),
    );
    pruneAgedEvents();
  } catch {
    // Audit must never crash the request path; limiter/auth decisions stay authoritative.
  }
}

export function logAdminAudit(actor: string, action: string, target = '', detail = ''): void {
  try {
    db.prepare('INSERT INTO admin_audit_log(actor,action,target,detail) VALUES(?,?,?,?)').run(
      clean(actor), clean(action), clean(target), clean(detail),
    );
    pruneAgedEvents();
  } catch {
    // Same fail-open-for-logging policy; authority checks are enforced elsewhere.
  }
}
