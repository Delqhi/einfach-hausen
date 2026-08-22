import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { markPaymentFailed, markPaymentPaid } from '@/lib/payments';
import { createNotification } from '@/lib/notifications';
import { activatePackageOrder } from '@/lib/packages';

export async function POST(req:NextRequest){
  if(!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) return new NextResponse('Stripe webhook not configured',{status:503});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const body=await req.text(); const sig=req.headers.get('stripe-signature'); if(!sig)return new NextResponse('Missing signature',{status:400});
  let event:Stripe.Event; try{event=stripe.webhooks.constructEvent(body,sig,process.env.STRIPE_WEBHOOK_SECRET);}catch{return new NextResponse('Invalid signature',{status:400});}

  if(event.type==='checkout.session.completed' || event.type==='checkout.session.async_payment_succeeded'){
    const s=event.data.object as Stripe.Checkout.Session; const kind=s.metadata?.kind;
    if(kind==='membership'&&s.subscription){
      const userId=Number(s.metadata?.homeownerId); const planSlug=s.metadata?.planSlug;
      const sub=await stripe.subscriptions.retrieve(String(s.subscription));
      if(userId&&planSlug){
        const periodEnd=Math.max(...sub.items.data.map(item=>item.current_period_end));
        db.prepare(`INSERT INTO subscriptions(homeowner_id,plan_slug,status,stripe_subscription_id,current_period_end,updated_at) VALUES(?,?,'active',?,?,CURRENT_TIMESTAMP)
          ON CONFLICT(homeowner_id) DO UPDATE SET plan_slug=excluded.plan_slug,status='active',stripe_subscription_id=excluded.stripe_subscription_id,current_period_end=excluded.current_period_end,updated_at=CURRENT_TIMESTAMP`).run(userId,planSlug,sub.id,new Date(periodEnd*1000).toISOString());
        const previous=s.metadata?.previousSubscriptionId; if(previous&&previous!==sub.id){try{await stripe.subscriptions.cancel(previous);}catch{}}
        createNotification(userId,'Mitgliedschaft aktiv',`Deine Einfach-Hausen-Mitgliedschaft ${planSlug} ist aktiv.`,'/app/plans','membership');
      }
    } else if(kind==='partner_membership'&&s.subscription){
      const providerId=Number(s.metadata?.providerId); const planSlug=s.metadata?.planSlug; const sub=await stripe.subscriptions.retrieve(String(s.subscription));
      if(providerId&&planSlug){
        const periodEnd=Math.max(...sub.items.data.map(item=>item.current_period_end)); const trialEnd=sub.trial_end?new Date(sub.trial_end*1000).toISOString():null;
        const previous=db.prepare('SELECT stripe_subscription_id FROM partner_subscriptions WHERE provider_id=?').get(providerId) as {stripe_subscription_id:string|null}|undefined;
        db.prepare(`INSERT INTO partner_subscriptions(provider_id,plan_slug,status,stripe_subscription_id,current_period_end,trial_end,updated_at) VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP)
          ON CONFLICT(provider_id) DO UPDATE SET plan_slug=excluded.plan_slug,status=excluded.status,stripe_subscription_id=excluded.stripe_subscription_id,current_period_end=excluded.current_period_end,trial_end=excluded.trial_end,updated_at=CURRENT_TIMESTAMP`).run(providerId,planSlug,sub.status==='trialing'?'trialing':'active',sub.id,new Date(periodEnd*1000).toISOString(),trialEnd);
        if(previous?.stripe_subscription_id&&previous.stripe_subscription_id!==sub.id){try{await stripe.subscriptions.cancel(previous.stripe_subscription_id);}catch{}}
        const managers=db.prepare('SELECT user_id FROM provider_members WHERE provider_id=? AND active=1 AND can_manage_jobs=1').all(providerId) as Array<{user_id:number}>; for(const manager of managers)createNotification(manager.user_id,'Partner-Tarif aktiv',`Partner-Tarif ${planSlug.toUpperCase()} ist aktiv.`,'/pro/plans','membership');
      }
    } else if(kind==='package'&&s.payment_status==='paid'){
      const orderId=Number(s.metadata?.packageOrderId); const userId=Number(s.metadata?.homeownerId);
      if(orderId&&userId){activatePackageOrder(orderId,userId);createNotification(userId,'Jahrespaket bezahlt','Dein Hausmeisterservice hat die Leistungen in deinen Jahresplan übernommen.','/app/plans','package');}
    } else if(s.payment_status==='paid') markPaymentPaid(s.id);
  }
  if(event.type==='checkout.session.async_payment_failed'){
    const s=event.data.object as Stripe.Checkout.Session; if(!s.metadata?.kind)markPaymentFailed(s.id);
  }
  if(event.type==='customer.subscription.updated' || event.type==='customer.subscription.deleted'){
    const s=event.data.object as Stripe.Subscription; const periodEnd=Math.max(...s.items.data.map(item=>item.current_period_end)); const end=new Date(periodEnd*1000).toISOString();
    const ownerStatus=event.type==='customer.subscription.deleted'?'cancelled':(s.status==='active'||s.status==='trialing'?'active':s.status==='past_due'?'past_due':'cancelled');
    db.prepare('UPDATE subscriptions SET status=?,current_period_end=?,updated_at=CURRENT_TIMESTAMP WHERE stripe_subscription_id=?').run(ownerStatus,end,s.id);
    const partnerStatus=event.type==='customer.subscription.deleted'?'cancelled':(s.status==='trialing'?'trialing':s.status==='active'?'active':s.status==='past_due'?'past_due':'cancelled');
    db.prepare('UPDATE partner_subscriptions SET status=?,current_period_end=?,trial_end=?,updated_at=CURRENT_TIMESTAMP WHERE stripe_subscription_id=?').run(partnerStatus,end,s.trial_end?new Date(s.trial_end*1000).toISOString():null,s.id);
  }
  if(event.type==='account.updated'){
    const account=event.data.object as Stripe.Account; const ready=Boolean(account.details_submitted&&account.charges_enabled&&account.payouts_enabled);
    db.prepare('UPDATE provider_profiles SET stripe_onboarded=? WHERE stripe_account_id=?').run(ready?1:0,account.id);
  }
  return NextResponse.json({received:true});
}
