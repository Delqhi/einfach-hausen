import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { markPaymentFailed, markPaymentPaid, stripePaymentsConfigured } from '@/lib/payments';
import { createNotification } from '@/lib/notifications';
import { activatePackageOrder } from '@/lib/packages';
import { claimWebhookEvent,completeWebhookEvent,releaseWebhookEvent } from '@/lib/security/webhooks';

function subscriptionId(value:Stripe.Checkout.Session['subscription']){
  if(typeof value==='string')return value;
  return value?.id||null;
}

function subscriptionPeriodEnd(subscription:Stripe.Subscription){
  const values=subscription.items.data.map(item=>item.current_period_end).filter(value=>Number.isFinite(value)&&value>0);
  return values.length?new Date(Math.max(...values)*1000).toISOString():null;
}

async function reconcileHomeownerMembership(stripe:Stripe,session:Stripe.Checkout.Session){
  const id=subscriptionId(session.subscription);
  const homeownerId=Number(session.metadata?.homeownerId);
  const planSlug=session.metadata?.planSlug?.trim();
  if(!id||!Number.isSafeInteger(homeownerId)||homeownerId<=0||!planSlug)return;

  const subscription=await stripe.subscriptions.retrieve(id);
  const periodEnd=subscriptionPeriodEnd(subscription);
  const current=db.prepare('SELECT plan_slug,status,stripe_subscription_id FROM subscriptions WHERE homeowner_id=?').get(homeownerId) as {
    plan_slug:string; status:string; stripe_subscription_id:string|null;
  }|undefined;
  const changed=!current||current.plan_slug!==planSlug||current.status!=='active'||current.stripe_subscription_id!==subscription.id;

  db.prepare(`INSERT INTO subscriptions(homeowner_id,plan_slug,status,stripe_subscription_id,current_period_end,updated_at)
    VALUES(?,?,'active',?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(homeowner_id) DO UPDATE SET
      plan_slug=excluded.plan_slug,status='active',stripe_subscription_id=excluded.stripe_subscription_id,
      current_period_end=excluded.current_period_end,updated_at=CURRENT_TIMESTAMP`).run(homeownerId,planSlug,subscription.id,periodEnd);

  const previous=session.metadata?.previousSubscriptionId?.trim();
  if(previous&&previous!==subscription.id&&previous===current?.stripe_subscription_id){
    try{await stripe.subscriptions.cancel(previous);}catch{}
  }
  if(changed)createNotification(homeownerId,'Mitgliedschaft aktiv',`Deine Einfach-Hausen-Mitgliedschaft ${planSlug} ist aktiv.`,'/app/plans','membership');
}

async function reconcilePartnerMembership(stripe:Stripe,session:Stripe.Checkout.Session){
  const id=subscriptionId(session.subscription);
  const providerId=Number(session.metadata?.providerId);
  const planSlug=session.metadata?.planSlug?.trim();
  if(!id||!Number.isSafeInteger(providerId)||providerId<=0||!planSlug)return;

  const subscription=await stripe.subscriptions.retrieve(id);
  const periodEnd=subscriptionPeriodEnd(subscription);
  const trialEnd=subscription.trial_end?new Date(subscription.trial_end*1000).toISOString():null;
  const status=subscription.status==='trialing'?'trialing':'active';
  const current=db.prepare('SELECT plan_slug,status,stripe_subscription_id FROM partner_subscriptions WHERE provider_id=?').get(providerId) as {
    plan_slug:string; status:string; stripe_subscription_id:string|null;
  }|undefined;
  const changed=!current||current.plan_slug!==planSlug||current.status!==status||current.stripe_subscription_id!==subscription.id;

  db.prepare(`INSERT INTO partner_subscriptions(provider_id,plan_slug,status,stripe_subscription_id,current_period_end,trial_end,updated_at)
    VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(provider_id) DO UPDATE SET
      plan_slug=excluded.plan_slug,status=excluded.status,stripe_subscription_id=excluded.stripe_subscription_id,
      current_period_end=excluded.current_period_end,trial_end=excluded.trial_end,updated_at=CURRENT_TIMESTAMP`).run(providerId,planSlug,status,subscription.id,periodEnd,trialEnd);

  if(current?.stripe_subscription_id&&current.stripe_subscription_id!==subscription.id){
    try{await stripe.subscriptions.cancel(current.stripe_subscription_id);}catch{}
  }
  if(changed){
    const managers=db.prepare('SELECT user_id FROM provider_members WHERE provider_id=? AND active=1 AND can_manage_jobs=1').all(providerId) as Array<{user_id:number}>;
    for(const manager of managers)createNotification(manager.user_id,'Partner-Tarif aktiv',`Partner-Tarif ${planSlug.toUpperCase()} ist aktiv.`,'/pro/plans','membership');
  }
}

function reconcilePackage(session:Stripe.Checkout.Session){
  if(session.payment_status!=='paid')return;
  const orderId=Number(session.metadata?.packageOrderId);
  const homeownerId=Number(session.metadata?.homeownerId);
  if(!Number.isSafeInteger(orderId)||orderId<=0||!Number.isSafeInteger(homeownerId)||homeownerId<=0)return;
  const order=activatePackageOrder(orderId,homeownerId);
  if(order&&!['paid','scheduled','completed'].includes(order.status)){
    createNotification(homeownerId,'Jahrespaket bezahlt','Dein Hausmeisterservice hat die Leistungen in deinen Jahresplan übernommen.','/app/plans','package');
  }
}

function reconcileSubscriptionState(event:Stripe.Event){
  const subscription=event.data.object as Stripe.Subscription;
  const periodEnd=subscriptionPeriodEnd(subscription);
  const ownerStatus=event.type==='customer.subscription.deleted'
    ?'cancelled'
    :(subscription.status==='active'||subscription.status==='trialing'?'active':subscription.status==='past_due'?'past_due':'cancelled');
  db.prepare('UPDATE subscriptions SET status=?,current_period_end=?,updated_at=CURRENT_TIMESTAMP WHERE stripe_subscription_id=?').run(ownerStatus,periodEnd,subscription.id);

  const partnerStatus=event.type==='customer.subscription.deleted'
    ?'cancelled'
    :(subscription.status==='trialing'?'trialing':subscription.status==='active'?'active':subscription.status==='past_due'?'past_due':'cancelled');
  db.prepare('UPDATE partner_subscriptions SET status=?,current_period_end=?,trial_end=?,updated_at=CURRENT_TIMESTAMP WHERE stripe_subscription_id=?')
    .run(partnerStatus,periodEnd,subscription.trial_end?new Date(subscription.trial_end*1000).toISOString():null,subscription.id);
}

export async function POST(req:NextRequest){
  if(!stripePaymentsConfigured())return new NextResponse('Stripe webhook not configured',{status:503});
  const secretKey=process.env.STRIPE_SECRET_KEY;
  const webhookSecret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!secretKey||!webhookSecret)return new NextResponse('Stripe webhook not configured',{status:503});

  const stripe=new Stripe(secretKey);
  const body=await req.text();
  const signature=req.headers.get('stripe-signature');
  if(!signature)return new NextResponse('Missing signature',{status:400});

  let event:Stripe.Event;
  try{event=stripe.webhooks.constructEvent(body,signature,webhookSecret);}
  catch{return new NextResponse('Invalid signature',{status:400});}

  if(!claimWebhookEvent('stripe',event.id))return NextResponse.json({received:true,duplicate:true});

  try{
    if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
      const session=event.data.object as Stripe.Checkout.Session;
      const kind=session.metadata?.kind;
      if(kind==='membership')await reconcileHomeownerMembership(stripe,session);
      else if(kind==='partner_membership')await reconcilePartnerMembership(stripe,session);
      else if(kind==='package')reconcilePackage(session);

      // Payment attempts (including invoice_payment) reconcile independently of
      // metadata kind. Non-payment Checkout sessions simply have no matching row.
      if(session.payment_status==='paid')markPaymentPaid(session.id);
    }

    if(event.type==='checkout.session.async_payment_failed'||event.type==='checkout.session.expired'){
      const session=event.data.object as Stripe.Checkout.Session;
      markPaymentFailed(session.id);
    }

    if(event.type==='customer.subscription.updated'||event.type==='customer.subscription.deleted'){
      reconcileSubscriptionState(event);
    }

    if(event.type==='account.updated'){
      const account=event.data.object as Stripe.Account;
      const ready=Boolean(account.details_submitted&&account.charges_enabled&&account.payouts_enabled);
      db.prepare('UPDATE provider_profiles SET stripe_onboarded=? WHERE stripe_account_id=?').run(ready?1:0,account.id);
    }

    completeWebhookEvent('stripe',event.id);
    return NextResponse.json({received:true});
  }catch{
    releaseWebhookEvent('stripe',event.id);
    return new NextResponse('Webhook processing failed',{status:500});
  }
}
