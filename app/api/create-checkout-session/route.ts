import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const priceId = process.env.PRICE_ID;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

async function createCheckoutSession(origin: string) {
  const defaultLineItem = {
    price_data: {
      currency: process.env.STRIPE_CURRENCY || 'usd',
      product_data: {
        name: 'Lease agreement payment',
      },
      unit_amount: 5000,
    },
    quantity: 1,
  };

  const lineItem = priceId
    ? {
        price: priceId,
        quantity: 1,
      }
    : defaultLineItem;

  try {
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'payment',
      success_url: `${origin}/print-success`,
      cancel_url: `${origin}/print-cancel`,
    });
  } catch (error: any) {
    if (
      error?.type === 'StripeInvalidRequestError' &&
      error?.code === 'resource_missing' &&
      error?.param === 'line_items[0][price]' &&
      priceId
    ) {
      console.warn('Stripe price ID invalid, falling back to inline price_data', { priceId });
      return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [defaultLineItem],
        mode: 'payment',
        success_url: `${origin}/print-success`,
        cancel_url: `${origin}/print-cancel`,
      });
    }
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const session = await createCheckoutSession(origin);
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('create-checkout-session error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to create Stripe checkout session' },
      { status: 500 }
    );
  }
}
