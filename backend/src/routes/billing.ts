import express from 'express';
import Stripe from 'stripe';
import Business from '../models/Business';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10' as any,
});

// Create a Checkout Session for a subscription
router.post('/create-checkout-session', authenticate, async (req: AuthRequest, res) => {
  try {
    const { priceId } = req.body;
    const businessId = req.user?.businessId;
    if (!businessId) return res.status(400).json({ message: 'Business ID required' });

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    // Create or retrieve customer
    let customerId = business.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user?.id, // In a real app, use user.email
        name: business.name,
        metadata: { businessId: businessId.toString() },
      });
      customerId = customer.id;
      business.stripeCustomerId = customerId;
      await business.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: { businessId: businessId.toString() },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
});

// Create a Customer Portal Session for managing subscription
router.post('/create-portal-session', authenticate, async (req: AuthRequest, res) => {
  try {
    const businessId = req.user?.businessId;
    const business = await Business.findById(businessId);
    
    if (!business?.stripeCustomerId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: business.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/settings`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating portal session', error: error.message });
  }
});

// Stripe Webhook Handler (called by Stripe on events)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      const bizId = subscription.metadata.businessId;
      if (bizId) {
        await Business.findByIdAndUpdate(bizId, {
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
          // Note: In a real app, map price ID to internal plan names (BASIC, PRO, etc.)
        });
      }
      break;
    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      const deletedBizId = deletedSub.metadata.businessId;
      if (deletedBizId) {
        await Business.findByIdAndUpdate(deletedBizId, {
          subscriptionStatus: 'CANCELED',
          stripeSubscriptionId: undefined,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
