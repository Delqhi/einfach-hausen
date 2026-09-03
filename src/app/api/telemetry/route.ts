import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// T-0117 CWV field telemetry sink: accepts anonymous metric batches and stores
// them for the aggregate gate. Privacy-safe by contract: metric name/value/
// rating/route only, no identifiers, no content. Bounded table (oldest rows
// pruned past 20k) so it cannot grow unbounded.
export async function POST(req: Request) {
  let body: { metric?: string; value?: number; rating?: string; path?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }); }
  const { metric, value, rating, path } = body ?? {};
  const valid = ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'].includes(metric ?? '') && typeof value === 'number' && Number.isFinite(value);
  if (!valid) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  if (!rating || !['good', 'needs-improvement', 'poor'].includes(rating)) return NextResponse.json({ error: 'bad request' }, { status: 400 });
  db.prepare('INSERT INTO cwv_metrics(metric,value,rating,path) VALUES(?,?,?,?)')
    .run(metric, Math.round(value!), rating, String(path ?? '').slice(0, 200));
  const count = (db.prepare('SELECT COUNT(*) c FROM cwv_metrics').get() as { c: number }).c;
  if (count > 20000) db.prepare('DELETE FROM cwv_metrics WHERE id IN (SELECT id FROM cwv_metrics ORDER BY id LIMIT ?)').run(count - 20000);
  return NextResponse.json({ ok: true });
}
