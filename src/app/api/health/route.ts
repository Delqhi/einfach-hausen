import { NextResponse } from 'next/server';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

const headers = {
  'cache-control': 'no-store, max-age=0',
  'x-content-type-options': 'nosniff',
};

// Supabase is the production identity authority: without it no login can
// succeed, so readiness includes its reachability (bounded to keep /api/health
// fast). Only booleans/status words are exposed - never paths, keys or errors.
async function authAuthorityCheck(): Promise<'reachable' | 'unreachable' | 'unconfigured'> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !anon) return 'unconfigured';
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
      headers: { apikey: anon },
      signal: AbortSignal.timeout(1500),
      cache: 'no-store',
    });
    return res.ok ? 'reachable' : 'unreachable';
  } catch {
    return 'unreachable';
  }
}

async function storageCheck(): Promise<{ status: 'ready' | 'unavailable'; freeDiskPercent?: number }> {
  try {
    const dir = path.resolve(process.cwd(), 'public', 'uploads');
    await fsPromises.access(dir);
    try {
      const stats = await fsPromises.statfs(dir);
      const total = Number(stats.blocks) * Number(stats.bsize);
      const free = Number(stats.bavail) * Number(stats.bsize);
      if (total > 0) return { status: 'ready', freeDiskPercent: Math.round((free / total) * 100) };
    } catch { /* statfs unavailable on this platform: writable check is enough */ }
    return { status: 'ready' };
  } catch {
    return { status: 'unavailable' };
  }
}

export async function GET() {
  try {
    const row = db
      .prepare("SELECT 1 AS ok FROM sqlite_schema WHERE type = 'table' AND name = 'users' LIMIT 1")
      .get() as { ok: number } | undefined;
    const databaseReady = row?.ok === 1;
    const [auth, storage] = await Promise.all([authAuthorityCheck(), storageCheck()]);
    const smtpConfigured = Boolean(process.env.SMTP_HOST) && Boolean((process.env.MAIL_FROM || process.env.SMTP_USER || '').includes('@'));
    const ready = databaseReady && auth === 'reachable' && storage.status === 'ready';

    return NextResponse.json(
      {
        ok: ready,
        service: 'einfach-hausen',
        checks: {
          database: databaseReady ? 'ready' : 'unavailable',
          auth_authority: auth,
          smtp: smtpConfigured ? 'configured' : 'unconfigured',
          storage: storage.status,
          ...(storage.freeDiskPercent !== undefined ? { free_disk_percent: storage.freeDiskPercent } : {}),
        },
        time: new Date().toISOString(),
      },
      { status: ready ? 200 : 503, headers },
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
