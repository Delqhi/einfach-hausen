import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { redirect } from 'next/navigation';
import { db } from './db';

export type CurrentUser = {
  id: number; email: string; role: 'homeowner' | 'provider'; first_name: string; last_name: string; phone: string | null;
};

const COOKIE = 'mh_session';

export async function createSession(userId: number) {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  db.prepare('INSERT INTO sessions(token,user_id,expires_at) VALUES(?,?,?)').run(token, userId, expires.toISOString());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) db.prepare('DELETE FROM sessions WHERE token=?').run(token);
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const row = db.prepare(`SELECT u.id,u.email,u.role,u.first_name,u.last_name,u.phone
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token=? AND s.expires_at > ?`).get(token, new Date().toISOString()) as CurrentUser | undefined;
  if (!row) { jar.delete(COOKIE); return null; }
  return row;
}

export async function requireUser(role?: CurrentUser['role']) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (role && user.role !== role) redirect(user.role === 'provider' ? '/pro' : '/app');
  return user;
}
