import { db } from '../db';
import { logSecurityEvent } from './audit';

export type RateLimitKind = 'login' | 'register' | 'admin_login' | 'admin_mutation';

type Policy = { maxAttempts: number; windowMs: number; blockMs: number };

// Sliding-inactivity-window policies: every counted attempt restarts the
// window, so sustained abuse never resets; a quiet window expires cleanly.
const POLICIES: Record<RateLimitKind, Policy> = {
  login: { maxAttempts: 5, windowMs: 15 * 60_000, blockMs: 60 * 60_000 },
  register: { maxAttempts: 10, windowMs: 15 * 60_000, blockMs: 60 * 60_000 },
  admin_login: { maxAttempts: 5, windowMs: 15 * 60_000, blockMs: 30 * 60_000 },
  admin_mutation: { maxAttempts: 120, windowMs: 15 * 60_000, blockMs: 30 * 60_000 },
};

// Bounded retention keeps unique-identifier floods from growing auth_rate_limits forever.
const ROW_RETENTION_MS = 30 * 24 * 60 * 60_000;

export type RateLimitVerdict = { allowed: true; retryAfterSeconds: 0 } | { allowed: false; retryAfterSeconds: number };

type Row = { attempts: number; window_start_at: string; blocked_until: string | null };

function key(identifier: string): string {
  return identifier.trim().toLowerCase().slice(0, 200);
}

function policy(kind: RateLimitKind): Policy {
  return POLICIES[kind];
}

function parseTime(value: string | null | undefined): number {
  if (!value) return Number.NaN;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

// Bounded busy retry: short waits resolve nearly all contention once
// busy_timeout is configured; persistent failure surfaces to the caller.
function withRetry<T>(fn: () => T, attempts = 3): T {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try { return fn(); } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message.toLowerCase() : '';
      if (!message.includes('busy') && !message.includes('locked')) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20 * (i + 1));
    }
  }
  throw lastError;
}

function pruneAged(): void {
  db.prepare('DELETE FROM auth_rate_limits WHERE updated_at < ?')
    .run(new Date(Date.now() - ROW_RETENTION_MS).toISOString().slice(0, 19).replace('T', ' '));
}

// Fail-closed contract: unreadable or malformed limiter state denies access.
export function checkRateLimit(kind: RateLimitKind, identifier: string): RateLimitVerdict {
  try {
    const p = policy(kind);
    const id = key(identifier);
    const now = Date.now();
    const row = db.prepare('SELECT attempts,window_start_at,blocked_until FROM auth_rate_limits WHERE kind=? AND identifier=?')
      .get(kind, id) as Row | undefined;
    if (!row) return { allowed: true, retryAfterSeconds: 0 };
    const blockedAt = parseTime(row.blocked_until);
    // Malformed persisted state must not open the gate.
    if (row.blocked_until != null && Number.isNaN(blockedAt)) return { allowed: false, retryAfterSeconds: 30 };
    if (!Number.isNaN(blockedAt) && blockedAt > now) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((blockedAt - now) / 1000)) };
    }
    const windowStart = parseTime(row.window_start_at);
    if (Number.isNaN(windowStart)) return { allowed: false, retryAfterSeconds: 30 };
    if (now - windowStart > p.windowMs) {
      // Window fully elapsed without a lockout: stale counters reset.
      db.prepare('DELETE FROM auth_rate_limits WHERE kind=? AND identifier=?').run(kind, id);
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (row.attempts >= p.maxAttempts) {
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(p.blockMs / 1000)) };
    }
    return { allowed: true, retryAfterSeconds: 0 };
  } catch {
    return { allowed: false, retryAfterSeconds: 30 };
  }
}

export type ConsumptionVerdict = { consumed: boolean; blocked: boolean };

// Atomically count ONE attempt against the bucket before expensive work
// (bcrypt, mutations), so concurrent request batches cannot all slip past the
// check-then-record gap. An already-active lockout consumes nothing.
// IMMEDIATE transactions avoid deferred-BEGIN lock upgrades, which lose writes
// under contention even with busy_timeout configured.
export function consumeRateLimitAttempt(kind: RateLimitKind, identifier: string): ConsumptionVerdict {
  try {
    const p = policy(kind);
    const id = key(identifier);
    let lockEvent: string | null = null;
    const verdict = withRetry(() => db.transaction(() => {
      const nowIso = new Date().toISOString();
      const now = Date.now();
      const row = db.prepare('SELECT attempts,window_start_at,blocked_until FROM auth_rate_limits WHERE kind=? AND identifier=?')
        .get(kind, id) as Row | undefined;
      if (row) {
        const blockedAt = parseTime(row.blocked_until);
        if (row.blocked_until != null && (Number.isNaN(blockedAt) || blockedAt > now)) return { consumed: false, blocked: true };
        const windowStart = parseTime(row.window_start_at);
        const fresh = !Number.isNaN(windowStart) && now - windowStart <= p.windowMs;
        const attempts = fresh ? row.attempts + 1 : 1;
        const locked = attempts >= p.maxAttempts;
        const blockedUntil = locked ? new Date(now + p.blockMs).toISOString() : null;
        db.prepare(`INSERT INTO auth_rate_limits(kind,identifier,attempts,window_start_at,blocked_until,updated_at)
          VALUES(?,?,?,?,?,CURRENT_TIMESTAMP)
          ON CONFLICT(kind,identifier) DO UPDATE SET attempts=excluded.attempts,window_start_at=excluded.window_start_at,
            blocked_until=COALESCE(excluded.blocked_until,auth_rate_limits.blocked_until),updated_at=CURRENT_TIMESTAMP`)
          .run(kind, id, attempts, nowIso, blockedUntil);
        if (locked && blockedUntil) lockEvent = `locked_until=${blockedUntil}`;
        return { consumed: true, blocked: locked };
      }
      db.prepare('INSERT INTO auth_rate_limits(kind,identifier,attempts,window_start_at,blocked_until) VALUES(?,?,1,?,NULL)')
        .run(kind, id, nowIso);
      return { consumed: true, blocked: false };
    }).immediate());
    // Audit logging happens after the write transaction committed; keeping it
    // inside would couple audit latency/failures to limiter durability.
    if (lockEvent) logSecurityEvent('rate_limit_block', `${kind}:${id}`, lockEvent);
    pruneAged();
    return verdict;
  } catch {
    // A lost count must not break the request path; the preceding
    // checkRateLimit gate plus DB-enforced invariants remain authoritative.
    return { consumed: false, blocked: true };
  }
}

// Mark the lockout for an attempt that was already consumed and then failed
// (bad password), without counting a second attempt.
export function applyRateLimitLockout(kind: RateLimitKind, identifier: string): void {
  try {
    const p = policy(kind);
    const id = key(identifier);
    let lockEvent: string | null = null;
    withRetry(() => db.transaction(() => {
      const row = db.prepare('SELECT attempts FROM auth_rate_limits WHERE kind=? AND identifier=?').get(kind, id) as { attempts: number } | undefined;
      if (!row || row.attempts < p.maxAttempts) return;
      const blockedUntil = new Date(Date.now() + p.blockMs).toISOString();
      db.prepare('UPDATE auth_rate_limits SET blocked_until=?,updated_at=CURRENT_TIMESTAMP WHERE kind=? AND identifier=? AND (blocked_until IS NULL OR blocked_until<CURRENT_TIMESTAMP)')
        .run(blockedUntil, kind, id);
      lockEvent = `locked_until=${blockedUntil}`;
    }).immediate());
    if (lockEvent) logSecurityEvent('rate_limit_block', `${kind}:${id}`, lockEvent);
  } catch {
    // Threshold was already enforced at consumption time.
  }
}

export function recordRateLimitFailure(kind: RateLimitKind, identifier: string): void {
  const verdict = consumeRateLimitAttempt(kind, identifier);
  if (verdict.consumed && verdict.blocked) applyRateLimitLockout(kind, identifier);
}

export function recordRateLimitSuccess(kind: RateLimitKind, identifier: string): void {
  try {
    db.prepare('DELETE FROM auth_rate_limits WHERE kind=? AND identifier=?').run(kind, key(identifier));
  } catch {
    // Best effort reset; rows also age out via the window reset in checkRateLimit.
  }
}

export function rateLimitBlockedEvent(kind: RateLimitKind, identifier: string, retryAfterSeconds: number): void {
  logSecurityEvent('rate_limit_blocked_request', `${kind}:${key(identifier)}`, `retry_after_s=${retryAfterSeconds}`);
}
