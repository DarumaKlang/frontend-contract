import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDefaultApiKey, getBackendBaseUrl } from '@/lib/config';
import { getSupabaseClient } from '@/lib/supabase';

// Require Stripe webhook secret to be configured
const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!stripeSecret) {
  console.error('Stripe webhook secret missing');
  // Note: In production you might want to fail fast or disable endpoint
}
const stripeKey = process.env.STRIPE_SECRET_KEY || '';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!stripeKey) {
    console.error('Stripe secret key missing');
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  if (!stripeSecret) {
    console.error('Stripe webhook secret not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const sig = req.headers.get('stripe-signature') || '';
  const bodyBuffer = await req.arrayBuffer();
  const raw = Buffer.from(bodyBuffer);

  const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, stripeSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  try {
    // Handle relevant events
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const backendUrl = getBackendBaseUrl();
      const payload = {
        provider: 'stripe',
        event: 'checkout.session.completed',
        sessionId: session.id,
        customer: session.customer,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        created: session.created,
        event_id: event.id,
      };

      if (backendUrl) {
        await fetch(`${backendUrl.replace(/\/$/, '')}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': getDefaultApiKey(),
          },
          body: JSON.stringify(payload),
        });
      }

      // Supabase fallback for durability/idempotency
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('payments').upsert(
            {
              event_id: event.id,
              provider: 'stripe',
              type: 'checkout.session.completed',
              payload: payload,
              created_at: new Date((session.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
            },
            { onConflict: 'event_id' }
          );
        }
      } catch (supErr) {
        console.warn('Supabase write (checkout.session.completed) failed:', supErr);
      }
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const backendUrl = getBackendBaseUrl();
      const payload = {
        provider: 'stripe',
        event: 'payment_intent.succeeded',
        payment_intent_id: pi.id,
        amount: pi.amount_received,
        currency: pi.currency,
        created: pi.created,
        event_id: event.id,
      };

      if (backendUrl) {
        await fetch(`${backendUrl.replace(/\/$/, '')}/payments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': getDefaultApiKey(),
          },
          body: JSON.stringify(payload),
        });
      }

      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          await supabase.from('payments').upsert(
            {
              event_id: event.id,
              provider: 'stripe',
              type: 'payment_intent.succeeded',
              payload: payload,
              amount: pi.amount_received,
              currency: pi.currency,
              created_at: new Date((pi.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
            },
            { onConflict: 'event_id' }
          );
        }
      } catch (supErr) {
        console.warn('Supabase write (payment_intent.succeeded) failed:', supErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook handling error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
