import { NextResponse } from 'next/server';

// T-0134 liveness endpoint: process-state only. No dependency checks, no DB,
// no external calls - if this responds, the Node process and the HTTP server
// are alive. Readiness (dependencies) is /api/health.
export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: 'einfach-hausen',
      state: 'alive',
      uptime_seconds: Math.round(process.uptime()),
      time: new Date().toISOString(),
    },
    { status: 200, headers: { 'cache-control': 'no-store' } },
  );
}
