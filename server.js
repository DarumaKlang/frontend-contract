require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.DOMAIN || req.headers.origin || 'https://contract-generator.com';
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: process.env.PRICE_ID, quantity: 1 }],
      mode: 'payment',
      success_url: `${site.replace(/\/+$/, '')}/print-success`,
      cancel_url: `${site.replace(/\/+$/, '')}/print-cancel`,
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
