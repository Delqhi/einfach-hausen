import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { markPaymentPaid } from '@/lib/payments';

export async function GET(req:NextRequest){
  const id=req.nextUrl.searchParams.get('session_id'); if(!id || !process.env.STRIPE_SECRET_KEY) return NextResponse.redirect(new URL('/app',req.url));
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const session=await stripe.checkout.sessions.retrieve(id);
  const payment=db.prepare('SELECT job_id FROM payments WHERE stripe_session_id=?').get(id) as {job_id:number}|undefined;
  if(session.payment_status==='paid') markPaymentPaid(id);
  return NextResponse.redirect(new URL(`/app/jobs/${payment?.job_id||''}?payment=success`,req.url));
}
