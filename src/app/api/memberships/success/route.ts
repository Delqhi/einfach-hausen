import Stripe from 'stripe';
import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function GET(req:NextRequest){
  const sessionId=req.nextUrl.searchParams.get('session_id');
  if(!sessionId||!process.env.STRIPE_SECRET_KEY)return NextResponse.redirect(new URL('/app/plans',req.url));
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const session=await stripe.checkout.sessions.retrieve(sessionId);
  const userId=Number(session.metadata?.homeownerId); const planSlug=session.metadata?.planSlug;
  if(session.status==='complete'&&session.subscription&&userId&&planSlug){
    const subscription=await stripe.subscriptions.retrieve(String(session.subscription));
    const periodEnd=Math.max(...subscription.items.data.map(item=>item.current_period_end));
    db.prepare(`INSERT INTO subscriptions(homeowner_id,plan_slug,status,stripe_subscription_id,current_period_end,updated_at) VALUES(?,?,'active',?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(homeowner_id) DO UPDATE SET plan_slug=excluded.plan_slug,status='active',stripe_subscription_id=excluded.stripe_subscription_id,current_period_end=excluded.current_period_end,updated_at=CURRENT_TIMESTAMP`).run(userId,planSlug,subscription.id,new Date(periodEnd*1000).toISOString());
    const previous=session.metadata?.previousSubscriptionId; if(previous&&previous!==subscription.id){try{await stripe.subscriptions.cancel(previous);}catch{}}
    createNotification(userId,'Mitgliedschaft aktiv',`Deine Einfach-Hausen-Mitgliedschaft ${planSlug} ist jetzt aktiv.`,'/app/plans','membership');
  }
  return NextResponse.redirect(new URL('/app/plans?checkout=success',req.url));
}
