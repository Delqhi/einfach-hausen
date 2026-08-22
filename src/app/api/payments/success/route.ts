import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req:NextRequest){
  const id=req.nextUrl.searchParams.get('session_id');
  const configured=Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET);
  const payment=id?db.prepare('SELECT job_id FROM payments WHERE stripe_session_id=?').get(id) as {job_id:number}|undefined:undefined;
  const suffix=configured?'payment=processing':'payment=unavailable';
  return NextResponse.redirect(new URL(`/app/jobs/${payment?.job_id||''}?${suffix}`,req.url));
}
