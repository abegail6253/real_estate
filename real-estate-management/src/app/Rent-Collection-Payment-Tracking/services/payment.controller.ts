import { Router } from 'express';
import Stripe from 'stripe';  // Use the server-side Stripe SDK
import paypal from 'paypal-rest-sdk';

const router = Router();

// Initialize Stripe with server-side SDK
const stripe = new Stripe('your-stripe-secret-key', {
  apiVersion: '2025-03-31.basil' as '2025-03-31.basil',  // Cast to the required version type
});

// Initialize PayPal
paypal.configure({
  mode: 'sandbox', // or 'live' for production
  client_id: 'your-paypal-client-id',
  client_secret: 'your-paypal-client-secret',
});

// Stripe Payment Route
router.post('/stripe', async (req, res) => {
  try {
    const { amount, token } = req.body;  // 'amount' and 'token' passed from frontend

    // Create payment intent via Stripe's server-side SDK
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: token,
      confirmation_method: 'manual',
      confirm: true,
    });

    res.status(200).send(paymentIntent);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

// PayPal Payment Route
router.post('/paypal', (req, res) => {
  const { amount } = req.body;
  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    transactions: [
      {
        amount: {
          total: amount,
          currency: 'USD',
        },
        description: 'Rent Payment',
      },
    ],
    redirect_urls: {
      return_url: 'http://your-website.com/success',
      cancel_url: 'http://your-website.com/cancel',
    },
  };

  paypal.payment.create(paymentData, (error: any, payment: any) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

export default router;
