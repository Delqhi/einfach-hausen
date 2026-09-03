import Stripe from 'stripe';
import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { getProviderContext } from '@/lib/provider';
export async function GET(req:NextRequest){const u=await getCurrentUser();if(!u||u.role!=='provider')return NextResponse.redirect(new URL('/login',req.url));const ctx=getProviderContext(u.id);if(!ctx?.isOwner)return NextResponse.redirect(new URL('/pro/profile?stripe=owner',req.url));if(!process.env.STRIPE_SECRET_KEY)return NextResponse.redirect(new URL('/pro/profile?stripe=missing',req.url));const p=db.prepare('SELECT stripe_account_id FROM provider_profiles WHERE user_id=?').get(ctx.providerId) as any;if(!p?.stripe_account_id)return NextResponse.redirect(new URL('/pro/profile?stripe=missing',req.url));const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);const origin=process.env.NEXT_PUBLIC_APP_URL||new URL(req.url).origin;const link=await stripe.accountLinks.create({account:p.stripe_account_id,refresh_url:`${origin}/api/stripe/connect/refresh`,return_url:`${origin}/api/stripe/connect/return`,type:'account_onboarding'});return NextResponse.redirect(link.url);}
