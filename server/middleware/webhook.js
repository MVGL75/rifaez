// routes/stripe.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { User } from "../models/Users.js"
import plans from '../seed/plans.js';
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
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      const priceId = subscription.items.data[0].price.id;
      
      const user = await User.findOne({ stripeCustomerId: customerId });
      if(user){
        if(plans[user.planId].rank > plans[priceId].rank){
          await restrictUserFeatures(user, priceId);
        }
          user.planId = priceId;
          user.subscriptionStatus = "active";
          await user.save();
          console.log(`✅ Subscription update for user ${user.username}`);
      }
      
    }

    

    res.status(200).json({ received: true });
  }
);

const restrictUserFeatures = async (user, newPriceId) => {
  const newPlanRestrictions = plans[newPriceId];

  const userWithRaffles = await user.populate('raffles');
  const activeRaffleAmount = newPlanRestrictions.activeRaffles;

  const activeRaffles = userWithRaffles.raffles?.filter(r => r.isActive) || [];
  const excess = activeRaffles.length - activeRaffleAmount;

  if (excess > 0) {
    await Promise.all(
      activeRaffles.slice(0, excess).map(raffle => {
        raffle.isActive = false;
        return raffle.save();
      })
    );
  }

  const permittedTemplates = newPlanRestrictions.templates || [];
  await Promise.all(
    userWithRaffles.raffles.map(raffle => {
      if (!permittedTemplates.includes(raffle.template)) {
        raffle.template = "classic";
        return raffle.save();
      }
    })
  );
  const permittedWorkers = newPlanRestrictions.workers;
  const currentWorkerCount = user.workers?.length || 0;
  const workerDiff = currentWorkerCount - permittedWorkers;

  if (workerDiff > 0) {
    user.workers = user.workers.slice(0, permittedWorkers);
  }

  await user.save();
};



export default router;