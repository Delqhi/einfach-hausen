import Stripe from 'stripe';
import { NextRequest,NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createNotification } from '@/lib/notifications';
import { activatePackageOrder } from '@/lib/packages';

export async function GET(req:NextRequest){
  const sessionId=req.nextUrl.searchParams.get('session_id');
  if(!sessionId||!process.env.STRIPE_SECRET_KEY)return NextResponse.redirect(new URL('/app/plans',req.url));
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY); const session=await stripe.checkout.sessions.retrieve(sessionId);
  const orderId=Number(session.metadata?.packageOrderId); const userId=Number(session.metadata?.homeownerId); const packageSlug=session.metadata?.packageSlug;
  if(session.payment_status==='paid'&&orderId&&userId){
    activatePackageOrder(orderId,userId);
    const pkg=db.prepare('SELECT title FROM service_packages WHERE slug=?').get(packageSlug) as {title:string}|undefined;
    createNotification(userId,'Jahrespaket gebucht',`${pkg?.title||'Dein Paket'} ist bezahlt. Dein KI-Hausmeister übernimmt jetzt die weitere Jahresplanung.`,'/app/plans','package');
  }
  return NextResponse.redirect(new URL('/app/plans?checkout=success',req.url));
}
