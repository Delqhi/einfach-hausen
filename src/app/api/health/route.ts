import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

const headers = {
  'cache-control': 'no-store, max-age=0',
  'x-content-type-options': 'nosniff',
};

export function GET() {
  try {
    const row = db
      .prepare("SELECT 1 AS ok FROM sqlite_schema WHERE type = 'table' AND name = 'users' LIMIT 1")
      .get() as { ok: number } | undefined;
    const databaseReady = row?.ok === 1;

    return NextResponse.json(
      {
        ok: databaseReady,
        service: 'einfach-hausen',
        checks: { database: databaseReady ? 'ready' : 'unavailable' },
        time: new Date().toISOString(),
      },
      { status: databaseReady ? 200 : 503, headers },
    );
  } catch {
    return NextResponse.json(
      {
        ok: false,
        service: 'einfach-hausen',
        checks: { database: 'unavailable' },
      },
      { status: 503, headers },
    );
  }
}
