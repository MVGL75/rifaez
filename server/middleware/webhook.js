// routes/stripe.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { User } from "../models/Users.js"
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Use raw body for Stripe signature verification
import bodyParser from 'body-parser';

router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
      
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Handle the completed checkout session
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // You can access:
      const customerEmail = session.customer_email;
      const customerId = session.customer;
      const subscriptionId = session.subscription;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0].price.id;

      // 🔁 Example: link to your user
      const user = await User.findOne({ username: customerEmail });
      if (user) {
        user.stripeCustomerId = customerId;
        user.subscriptionId = subscriptionId;
        user.planId = priceId;
        user.subscriptionStatus = 'active';
        await user.save();
        console.log(`✅ Subscription saved for ${customerEmail}`);
      } else {
        console.warn(`⚠️ No user found with email: ${customerEmail}`);
      }
    }
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
  
      const customerId = subscription.customer;
  
      const user = await User.findOne({ stripeCustomerId: customerId });
  
      if (user) {
        user.subscriptionId = null;
        user.subscriptionStatus = null;
        user.planId = null;
        await user.save();
        console.log(`✅ Subscription removed for user ${user.email}`);
      } else {
        console.warn(`⚠️ No user found for customer ${customerId}`);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;