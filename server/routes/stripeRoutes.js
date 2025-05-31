import express from 'express';
import Stripe from 'stripe';
import AppError from '../utils/AppError.js';
import { User } from "../models/Users.js"
import sanitizeUser from '../utils/sanitize.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import CustomDomain from '../models/CustomDomain.js';
import plans from '../seed/plans.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
});


const router = express.Router();

const checkPriceId = [process.env.PRICE_ID_BASIC, process.env.PRICE_ID_PRO, process.env.PRICE_ID_BUSINESS]


router.post('/create-checkout-session', isAuthenticated, async (req, res) => {
  const {priceId, customerEmail} = req.body;
  if (!priceId || !customerEmail) {
    throw new AppError({message: "missing priceid or customer email"});
  }  
  console.log(checkPriceId, priceId)
  const newPriceId = checkPriceId.find(id => id === priceId)
  if(!newPriceId){
    throw new AppError({message: "price is invalid"});
  }
  const user = await User.findById(req.user._id)
  if(user.subscriptionId){
    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
    if(subscription){
      await updateSubscription(user, subscription, priceId)
      await findUser(req, res)
    }
  }
  try {
    const baseUrl = `${process.env.CLIENT_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`;

    let extraParams = '';
    if (req.session?.redirectAfterPayment?.url && req.session?.redirectAfterPayment?.frontUrl) {
      const url = encodeURIComponent(req.session.redirectAfterPayment.url);
      const frontUrl = encodeURIComponent(req.session.redirectAfterPayment.frontUrl);
      extraParams = `&redirect_url=${url}&front_url=${frontUrl}`;
    }

    const return_url = `${baseUrl}${extraParams}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: customerEmail,
      ui_mode: 'embedded',
      line_items: [
        {
          price: newPriceId,
          quantity: 1,
        },
      ],
      return_url,
    });
    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    throw new AppError(err)
  }
});

router.post("/update-plan", isAuthenticated, async (req, res) => {
  try {
    const {newPriceId} = req.body
    const user = await User.findByUsername(req.user.username)
    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
    if (subscription.status === 'canceled') {
      await deleteUserFeatures(user);
        user.subscriptionId = null;
        user.subscriptionStatus = null;
        user.planId = null;
        await user.save();
      return res.status(400).json({
        message: "Your subscription expired before completing payment. Please subscribe again."
      });
    }

    await updateSubscription(user, subscription, newPriceId)
    await findUser(req, res)

  } catch (error) {
    throw new AppError(error)
  } 
})


const updateSubscription = async (user, subscription, newPriceId) => {
  await stripe.subscriptions.update(user.subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId, // new plan
      },
    ],
    cancel_at_period_end: false,
    proration_behavior: 'create_prorations',
  });
  if(plans[user.planId].rank > plans[newPriceId].rank){
    await restrictUserFeatures(user, newPriceId);
  } else {
    await updateUserFeatures(user, newPriceId)
  }
  user.planId = newPriceId;
  user.subscriptionStatus = "active";
  await user.save();

}

router.post('/cancel-subscription', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.subscriptionId) {
      return res.status(400).json({ error: 'No subscription found for user.' });
    }

    // Cancel immediately or at period end
    const canceledSubscription = await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });

    user.subscriptionStatus = 'canceled';
    await user.save();
    await findUser(req, res);
    console.log("client", user)
    
  } catch (error) {
    throw new AppError(error)
  }
});

router.get('/session-status', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.json({
      ...session
    });
  } catch (e) {
    throw new AppError(e)
  }
});


const deleteUserFeatures = async (user) => {

  const userWithRaffles = await user.populate('raffles');

  const userRaffles = userWithRaffles.raffles || [];
  const activeRaffles = userWithRaffles.raffles?.filter(r => r.isActive) || [];
  const activeWorkers = user.workers || [];

    await Promise.all(
      activeRaffles.map(raffle => {
        raffle.isActive = false;
        return raffle.save();
      })
    );

  await Promise.all(
    userRaffles.map(raffle => {
        raffle.template = "classic";
        return raffle.save();
    })
  );
  await Promise.all(
    activeWorkers.map(worker => {
        worker.isActive = false;
        return worker.save();
    })
  );
    // user.workers = user.workers.slice(0, 0);

  await user.save();
};

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
  const permittedMethods = newPlanRestrictions.methods;

  await Promise.all(
    userWithRaffles.raffles.map(raffle => {
      if (raffle.paymentMethods.length > permittedMethods) {
        raffle.paymentMethods = raffle.paymentMethods.slice(0, permittedMethods);
        return raffle.save();
      }
      return Promise.resolve(); // Ensure Promise.all doesn't get undefined
    })
  );

  const permittedWorkers = newPlanRestrictions.workers;
  const activeWorkers = user.workers?.filter(worker => worker.isActive) || [];
  const workerDiff = activeWorkers.length - permittedWorkers;
  if (workerDiff > 0) {
    await Promise.all(
      activeWorkers.slice(0, workerDiff).map(worker => {
          worker.isActive = false;
          return worker.save();
      })
    );
}

  await user.save();
};
const updateUserFeatures = async (user, newPriceId) => {
  const newPlanRestrictions = plans[newPriceId];
  
  const permittedWorkers = newPlanRestrictions.workers;
  const activeWorkers = user.workers?.filter(worker => worker.isActive) || [];
  const inActiveWorkers = user.workers?.filter(worker => !worker.isActive) || [];
  const workerSlots = permittedWorkers - activeWorkers.length ;
  const workerSlotDiff = workerSlots > inActiveWorkers.length ? inActiveWorkers.length : workerSlots;
  if (workerSlotDiff > 0) {
    await Promise.all(
      inActiveWorkers.slice(0, workerSlotDiff).map(worker => {
          worker.isActive = true;
          return worker.save();
      })
    );
}

  await user.save();
}

const findUser = async(req, res) => {
  const user = await User.findById(req.user._id)
  if(!user) return res.json({ message: 'User not found', status: 401 });
  const clientUser = await setUserForClient(req, user)
  return res.json(clientUser);
}

async function setUserForClient(req, user){
  const popUser = await user.populate('raffles')
  const safeUser = sanitizeUser(popUser)
  const domain = await CustomDomain.findOne({userId: user._id, status: 'active'})
  return {...safeUser, currentPlan: plans[user.planId]?.name, planStatus: user.subscriptionStatus,  asWorker: req.user.asWorker, domain: domain || false}
}








export default router;
