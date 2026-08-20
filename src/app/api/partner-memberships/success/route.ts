import Stripe from 'stripe';
import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';

export async function GET(req:NextRequest){
  const sessionId=req.nextUrl.searchParams.get('session_id');
  if(!sessionId||!process.env.STRIPE_SECRET_KEY)return NextResponse.redirect(new URL('/pro/plans',req.url));
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const session=await stripe.checkout.sessions.retrieve(sessionId);
  const providerId=Number(session.metadata?.providerId); const planSlug=session.metadata?.planSlug;
  if(session.status==='complete'&&session.subscription&&providerId&&planSlug){
    const subscription=await stripe.subscriptions.retrieve(String(session.subscription));
    const periodEnd=Math.max(...subscription.items.data.map(item=>item.current_period_end));
    const trialEnd=subscription.trial_end?new Date(subscription.trial_end*1000).toISOString():null;
    const previous=db.prepare('SELECT stripe_subscription_id FROM partner_subscriptions WHERE provider_id=?').get(providerId) as {stripe_subscription_id:string|null}|undefined;
    db.prepare(`INSERT INTO partner_subscriptions(provider_id,plan_slug,status,stripe_subscription_id,current_period_end,trial_end,updated_at) VALUES(?,?,?, ?,?,?,CURRENT_TIMESTAMP)
      ON CONFLICT(provider_id) DO UPDATE SET plan_slug=excluded.plan_slug,status=excluded.status,stripe_subscription_id=excluded.stripe_subscription_id,current_period_end=excluded.current_period_end,trial_end=excluded.trial_end,updated_at=CURRENT_TIMESTAMP`).run(providerId,planSlug,subscription.status==='trialing'?'trialing':'active',subscription.id,new Date(periodEnd*1000).toISOString(),trialEnd);
    if(previous?.stripe_subscription_id&&previous.stripe_subscription_id!==subscription.id){try{await stripe.subscriptions.cancel(previous.stripe_subscription_id);}catch{}}
    const managers=db.prepare('SELECT user_id FROM provider_members WHERE provider_id=? AND active=1 AND can_manage_jobs=1').all(providerId) as Array<{user_id:number}>;
    for(const manager of managers)createNotification(manager.user_id,'Partner-Tarif aktiv',`Der Partner-Tarif ${planSlug.toUpperCase()} ist jetzt aktiv.`,'/pro/plans','membership');
  }
  return NextResponse.redirect(new URL('/pro/plans?checkout=success',req.url));
}
