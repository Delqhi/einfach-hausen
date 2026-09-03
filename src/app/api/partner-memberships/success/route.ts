import { NextRequest,NextResponse } from 'next/server';

export async function GET(req:NextRequest){
  const configured=Boolean(process.env.STRIPE_SECRET_KEY&&process.env.STRIPE_WEBHOOK_SECRET);
  return NextResponse.redirect(new URL(configured?'/pro/plans?checkout=processing':'/pro/plans?checkout=unavailable',req.url));
}
