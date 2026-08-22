import { randomBytes } from 'node:crypto';
import { db } from './db';

export type CurrentUser = {
  id: number; email: string; role: 'homeowner' | 'provider'; first_name: string; last_name: string; phone: string | null;
};

const DEV_COOKIE = 'mh_session';
// __Host- requires Secure+Path=/+no Domain; valid only over HTTPS production.
const PROD_COOKIE = '__Host-mh_session';

function cookieName(): string {
  return process.env.NODE_ENV === 'production' ? PROD_COOKIE : DEV_COOKIE;
}

// Exported for deterministic security regressions; mirrors createSession().
export function sessionCookiePolicy() {
  return {
    name: cookieName(),
    options: cookieOptions(new Date()),
  };
}

function cookieOptions(expires: Date) {
  return { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', expires };
}

// Lazily resolved so this module stays importable outside Next's request context.
async function jar(): Promise<{ get(k: string): { value: string } | undefined; set(k: string, v: any, o?: any): void; delete(k: string): void }> {
  const { cookies } = await import('next/headers');
  return await cookies() as any;
}
async function navigateTo(url: string): Promise<never> {
  const { redirect } = await import('next/navigation');
  redirect(url);
  throw new Error('unreachable');
}

// Session rotation: a user holds at most one active session; every new auth
// invalidates all previous tokens for that user. Invalidate+issue run in one
// transaction, and the UNIQUE(user_id) index enforces the invariant in SQL
// even across concurrent workers.
export function invalidateUserSessions(userId: number): void {
  db.prepare('DELETE FROM sessions WHERE user_id=?').run(userId);
}

export function pruneExpiredSessions(): void {
  db.prepare('DELETE FROM sessions WHERE expires_at<=?').run(new Date().toISOString());
}

export function issueSessionToken(userId: number): { token: string; expires: Date } {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  db.prepare('INSERT INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)')
    .run(token, userId, expires.toISOString(), new Date().toISOString());
  return { token, expires };
}

// Atomic rotation core: prune expired rows, invalidate prior sessions, and
// insert the new token inside a single IMMEDIATE transaction (deferred BEGIN
// lock upgrades lose writes under concurrent workers).
export function rotateAndIssueUserSession(userId: number): { token: string; expires: Date } {
  return db.transaction(() => {
    pruneExpiredSessions();
    invalidateUserSessions(userId);
    return issueSessionToken(userId);
  }).immediate();
}

// Best-effort expiry of pre-__Host- cookie names so upgraded clients stop
// carrying dead legacy cookies.
async function clearLegacyCookies(current: string): Promise<void> {
  const store = await jar();
  const expired = cookieOptions(new Date(0));
  for (const name of [DEV_COOKIE, PROD_COOKIE]) {
    if (name === current) continue;
    try { store.set(name, '', expired); } catch {}
  }
}

export async function createSession(userId: number) {
  const { token, expires } = rotateAndIssueUserSession(userId);
  const name = cookieName();
  const store = await jar();
  store.set(name, token, cookieOptions(expires));
  await clearLegacyCookies(name);
}

export async function destroySession() {
  const store = await jar();
  const name = cookieName();
  const token = store.get(name)?.value;
  if (token) db.prepare('DELETE FROM sessions WHERE token=?').run(token);
  try { store.delete(name); } catch {}
  await clearLegacyCookies(name);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const store = await jar();
  const name = cookieName();
  const token = store.get(name)?.value;
  if (!token) return null;
  const row = db.prepare(`SELECT u.id,u.email,u.role,u.first_name,u.last_name,u.phone
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token=? AND s.expires_at > ?`).get(token, new Date().toISOString()) as CurrentUser | undefined;
  if (!row) {
    // Stale or rotated token: drop the row and clear the cookie.
    db.prepare('DELETE FROM sessions WHERE token=?').run(token);
    try { store.delete(name); } catch {}
    return null;
  }
  return row;
}

export async function requireUser(role?: CurrentUser['role']) {
  const user = await getCurrentUser();
  if (!user) await navigateTo('/login');
  if (role && user!.role !== role) await navigateTo(user!.role === 'provider' ? '/pro' : '/app');
  return user!;
}
