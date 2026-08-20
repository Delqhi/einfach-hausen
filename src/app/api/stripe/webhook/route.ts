import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { markPaymentFailed, markPaymentPaid } from '@/lib/payments';

export async function POST(req:NextRequest){
  if(!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return new NextResponse('Stripe webhook not configured',{status:503});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const body=await req.text(); const sig=req.headers.get('stripe-signature'); if(!sig)return new NextResponse('Missing signature',{status:400});
  let event:Stripe.Event; try{event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET);}catch{return new NextResponse('Invalid signature',{status:400});}
  if(event.type==='checkout.session.completed' || event.type==='checkout.session.async_payment_succeeded'){
    const s=event.data.object as Stripe.Checkout.Session; if(s.payment_status==='paid') markPaymentPaid(s.id);
  }
  if(event.type==='checkout.session.async_payment_failed'){
    const s=event.data.object as Stripe.Checkout.Session; markPaymentFailed(s.id);
  }
  if(event.type==='account.updated'){
    const account=event.data.object as Stripe.Account;
    const ready=Boolean(account.details_submitted&&account.charges_enabled&&account.payouts_enabled);
    db.prepare('UPDATE provider_profiles SET stripe_onboarded=? WHERE stripe_account_id=?').run(ready?1:0,account.id);
  }
  return NextResponse.json({received:true});
}
