// T-0132 error tracking sink: collects structured client + server error events
// with correlation ids into the bounded error_events table. Privacy-safe:
// digest/classification only; message is scrubbed against the same secret
// patterns as the structured logger; no user content, no identifiers.
// Bounded table (oldest rows pruned past 5k) so it cannot grow unbounded.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { redactDetail } from '@/lib/security/redact';

function scrub(value: unknown, max: number): string {
  return redactDetail(String(value ?? '')).slice(0, max);
}

export async function POST(req: NextRequest) {
  let body: {
    source?: string; error_class?: string; digest?: string; message?: string;
    path?: string; correlation_id?: string; release?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }); }

  const source = body?.source === 'server' ? 'server' : 'client';
  const errorClass = ['auth', 'validation', 'authorization', 'rate_limit', 'payment', 'storage', 'external_service', 'database', 'internal']
    .includes(body?.error_class ?? '') ? body!.error_class! : 'internal';
  const digest = /^[\w-]{6,64}$/.test(body?.digest ?? '') ? body!.digest! : '';
  const correlationId = /^[\w-]{6,64}$/.test(body?.correlation_id ?? '') ? body!.correlation_id! : '';
  const release = /^[\w.-]{1,64}$/.test(body?.release ?? '') ? body!.release! : '';

  db.prepare('INSERT INTO error_events(source,error_class,digest,message,path,correlation_id,release) VALUES(?,?,?,?,?,?,?)')
    .run(source, errorClass, digest, scrub(body?.message, 400), scrub(body?.path, 200), correlationId, release);
  const count = (db.prepare('SELECT COUNT(*) c FROM error_events').get() as { c: number }).c;
  if (count > 5000) db.prepare('DELETE FROM error_events WHERE id IN (SELECT id FROM error_events ORDER BY id LIMIT ?)').run(count - 5000);

  // Server-side structured log line joins with journald via correlation id.
  console.error(JSON.stringify({
    ts: new Date().toISOString(), level: 'error', error_class: errorClass,
    message: 'error event recorded', source, digest, correlation_id: correlationId,
  }));
  return NextResponse.json({ ok: true });
}
