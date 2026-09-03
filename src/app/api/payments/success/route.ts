import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { stripePaymentsConfigured } from '@/lib/payments';

export async function GET(req:NextRequest){
  const user=await getCurrentUser();
  if(!user||user.role!=='homeowner')return NextResponse.redirect(new URL('/login',req.url));

  const sessionId=req.nextUrl.searchParams.get('session_id');
  const payment=sessionId&&sessionId.length<=255
    ?db.prepare('SELECT job_id FROM payments WHERE stripe_session_id=? AND homeowner_id=?').get(sessionId,user.id) as {job_id:number}|undefined
    :undefined;
  const configured=stripePaymentsConfigured();
  const state=configured?'processing':'unavailable';
  const destination=payment?.job_id?`/app/jobs/${payment.job_id}`:'/app/jobs';
  return NextResponse.redirect(new URL(`${destination}?payment=${state}`,req.url));
}
