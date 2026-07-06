import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { requireAdmin } from '@/lib/admin';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export async function GET(req: Request) {
  const adminErr = await requireAdmin(req);
  if (adminErr) return adminErr;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Stripe secret key not configured' }, { status: 500 });
  }

  try {
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });

    const url = new URL(req.url);
    const days = Number(url.searchParams.get('days') || '30');
    const since = Math.floor(Date.now() / 1000) - days * 24 * 60 * 60;

    // List payment intents created since `since` and sum succeeded amounts
    const piList = await stripe.paymentIntents.list({ created: { gte: since }, limit: 100 });
    let total = 0;
    let count = 0;
    for (const pi of piList.data) {
      if (pi.status === 'succeeded' && typeof pi.amount_received === 'number') {
        total += pi.amount_received;
        count += 1;
      }
    }

    // Convert to human amounts if currency uses cents (assume amounts are in cents)
    const currency = (piList.data[0]?.currency || 'usd').toUpperCase();
    return NextResponse.json({ days, count, total, currency });
  } catch (err: any) {
    console.error('admin/revenue error:', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
