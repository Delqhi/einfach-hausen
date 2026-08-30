import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { authMode, invalidateUserSessions } from '@/lib/auth';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// Local-mode credential login (development convenience path). Supabase mode
// keeps the client-side Supabase form; production local auth fails closed by
// design (authMode() throws), so this endpoint cannot bypass that invariant.
export async function POST(request: Request) {
  if (authMode() !== 'local') {
    return NextResponse.json({ error: 'Local login is disabled.' }, { status: 403, headers: { 'cache-control': 'no-store' } });
  }
  let email = '';
  let password = '';
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? '').trim().toLowerCase();
    password = String(body.password ?? '');
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }
  if (!email || !password) {
    return NextResponse.json({ error: 'E-Mail und Passwort angeben.' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }
  const user = db.prepare('SELECT id,password_hash,role FROM users WHERE lower(email)=?').get(email) as
    | { id: number; password_hash: string; role: 'homeowner' | 'provider' }
    | undefined;
  const ok = user && user.password_hash.startsWith('$2') && await bcrypt.compare(password, user.password_hash).catch(() => false);
  if (!user || !ok) {
    return NextResponse.json({ error: 'E-Mail oder Passwort falsch.' }, { status: 401, headers: { 'cache-control': 'no-store' } });
  }
  // Single live session per user (mirrors the sessions invariant in db.ts).
  invalidateUserSessions(user.id);
  const token = randomBytes(32).toString('hex');
  db.prepare('INSERT INTO sessions(token,user_id,expires_at,issued_at) VALUES(?,?,?,?)')
    .run(token, user.id, new Date(Date.now() + 7 * 24 * 3600_000).toISOString(), new Date().toISOString());
  const store = await cookies();
  store.set('mh_session', token, { httpOnly: true, sameSite: 'lax', path: '/' });
  return NextResponse.json({ ok: true, role: user.role }, { headers: { 'cache-control': 'no-store' } });
}
