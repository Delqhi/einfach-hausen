import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { authMode, createSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { checkRateLimit, consumeRateLimitAttempt, rateLimitBlockedEvent, recordRateLimitSuccess } from '@/lib/security/rate-limit';

export const runtime = 'nodejs';

const noStore = { 'cache-control': 'no-store' };

// Local-mode credential login (development convenience path). Supabase mode
// keeps the client-side Supabase form; production local auth fails closed by
// design (authMode() throws), so this endpoint cannot bypass that invariant.
//
// Session issuance goes through createSession() so the cookie name, cookie
// policy and single-session rotation stay identical to the server-action
// paths; a previous inline implementation wrote a hardcoded cookie name that
// getCurrentUser() could not read when SESSION_COOKIE_NAME was overridden.
export async function POST(request: Request) {
  if (authMode() !== 'local') {
    return NextResponse.json({ error: 'Local login is disabled.' }, { status: 403, headers: noStore });
  }
  let email = '';
  let password = '';
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    email = String(body.email ?? '').trim().toLowerCase();
    password = String(body.password ?? '');
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400, headers: noStore });
  }
  if (!email || !password) {
    return NextResponse.json({ error: 'E-Mail und Passwort angeben.' }, { status: 400, headers: noStore });
  }

  // Same brute-force budget as the Supabase/server-action login paths.
  const limiter = checkRateLimit('login', email);
  if (!limiter.allowed) {
    rateLimitBlockedEvent('login', email, limiter.retryAfterSeconds);
    return NextResponse.json(
      { error: 'Zu viele Versuche. Bitte später erneut.' },
      { status: 429, headers: { ...noStore, 'retry-after': String(limiter.retryAfterSeconds) } },
    );
  }
  const consumption = consumeRateLimitAttempt('login', email);
  if (consumption.blocked && !consumption.consumed) {
    return NextResponse.json({ error: 'Zu viele Versuche. Bitte später erneut.' }, { status: 429, headers: noStore });
  }

  const user = db.prepare('SELECT id,password_hash,role FROM users WHERE lower(email)=?').get(email) as
    | { id: number; password_hash: string; role: 'homeowner' | 'provider' }
    | undefined;
  const ok = user && user.password_hash.startsWith('$2') && await bcrypt.compare(password, user.password_hash).catch(() => false);
  if (!user || !ok) {
    return NextResponse.json({ error: 'E-Mail oder Passwort falsch.' }, { status: 401, headers: noStore });
  }
  recordRateLimitSuccess('login', email);
  await createSession(user.id);
  return NextResponse.json({ ok: true, role: user.role }, { headers: noStore });
}
