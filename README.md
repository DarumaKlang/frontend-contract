# frontend-contract

This repository is a Next.js app router project for generating contract and lease documents with Stripe Checkout integration.

## Project overview

- Next.js 16.2.9 with React 19.2.7
- Stripe client integration using `@stripe/stripe-js`
- Stripe Checkout session creation in `app/api/create-checkout-session/route.ts`
- In-app documentation page at `app/docs/page.tsx`

## Requirements

- Node 20+
- pnpm
- Stripe test keys for development

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create a `.env` file in the repo root with your Stripe credentials:

```dotenv
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
PRICE_ID=price_xxx
DOMAIN=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

3. Start the development server:

```bash
pnpm dev
```

4. Open the app in your browser at `http://localhost:3000`.

## Stripe integration

### Client-side

The main client flow is in `app/page.new.tsx`.

- Reads `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Loads Stripe with `loadStripe()`
- Calls `POST /api/create-checkout-session`
- Receives `sessionId`
- Redirects to Stripe Checkout with `stripe.redirectToCheckout({ sessionId })`

### Server-side

The backend API route is `app/api/create-checkout-session/route.ts`.

- Reads `STRIPE_SECRET_KEY` and `PRICE_ID`
- Creates a Stripe client with the secret key
- Calls `stripe.checkout.sessions.create()`
- Returns `{ sessionId }` to the client

### Fallback behavior

If `PRICE_ID` is invalid or missing, the route falls back to creating line items with inline `price_data`, allowing the checkout flow to work during development.

## Environment variables

The app expects these values in `.env`:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key for browser usage
- `STRIPE_SECRET_KEY` — Stripe secret key for server-side requests
- `PRICE_ID` — Optional Stripe Price ID for a predefined product price
- `DOMAIN` — App domain used for success/cancel URLs
- `STRIPE_WEBHOOK_SECRET` — Webhook secret for future webhook validation

> Never commit `.env` to source control.

## Testing Stripe

### Browser test

1. Run `pnpm dev`.
2. Open the app.
3. Click the payment button.
4. Complete checkout with a Stripe test card such as `4242 4242 4242 4242`.

### API route test

```bash
curl -i -X POST http://localhost:3000/api/create-checkout-session
```

A successful response should return JSON with a `sessionId`.

## Key files

- `app/page.new.tsx` — client-side Stripe logic and checkout button
- `app/api/create-checkout-session/route.ts` — server-side Stripe session creation
- `app/docs/page.tsx` — Stripe and project documentation page
- `.env` — Stripe keys and configuration values

## Notes

- Use Stripe test keys in development and production keys only after deployment.
- Keep `STRIPE_SECRET_KEY` server-side only.
- If `PRICE_ID` fails with `No such price`, verify the ID belongs to the same Stripe account as the secret key.

## Run scripts

- `pnpm dev` — start development server
- `pnpm build` — build production bundle
- `pnpm start` — start production server after build

## What to update next

- Add Stripe webhook handling for payment confirmations
- Store payment status in a database for persisted receipts or order records
- Make checkout price and description dynamic based on contract data
