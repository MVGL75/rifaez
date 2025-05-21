import './config/env.js';
console.log(process.env.STRIPE_SECRET_KEY)

import express from 'express';
import mongoose from 'mongoose';

import { User } from './models/Users.js';
import raffleRoutes from './routes/raffleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import domainRoutes from './routes/domainRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import path from "path";
import Webhook from "./middleware/webhook.js"
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import session from 'express-session';
import passport from 'passport';

const mongoURI = 'mongodb://127.0.0.1:27017/rifas';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();

app.use("/stripe/webhook", Webhook)

app.use(express.static(path.join(__dirname, '../client/dist')))

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", 
  credentials: true             
}));



app.use(express.json({ limit: '10kb' }));
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", 
    sameSite: 'lax'
  }
}));

app.disable('x-powered-by');
app.use(helmet());
app.use(limiter);


app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

import { Strategy as LocalStrategy } from 'passport-local';

passport.use('worker-aware', new LocalStrategy({
  usernameField: 'username'
}, async function verifyWorkerLogin(username, password, done) {
  try {
    // 1. Try login with main user
    const user = await User.findOne({ username: username });
    if (user) {
      const match = await user.authenticate(password);
      if (match.user) {
        match.user.asWorker = false;
        match.user.loggedInEmail = username;
        return done(null, match.user);
      }
    }

    // 2. Try login as a worker
    const owner = await User.findOne({ 'workers.email': username });
    if (!owner) return done(null, false, { message: 'User not found' });

    const match = await owner.authenticate(password);
    if (!match.user) return done(null, false, { message: 'Invalid password' });

    match.user.asWorker = true;
    match.user.loggedInEmail = username;
    return done(null, match.user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    asWorker: user.asWorker,
    loggedInEmail: user.loggedInEmail
  });
});

passport.deserializeUser(async (storedSession, done) => {
  try {
    const user = await User.findById(storedSession.id).lean();

    if (!user) return done(null, false);
    
    user.asWorker = storedSession.asWorker;
    user.loggedInEmail = storedSession.loggedInEmail;

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

app.use('/raffle', raffleRoutes);
app.use('/api/domains', domainRoutes)

app.use('/stripe', stripeRoutes)
app.use('/', authRoutes);



app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html')); // 'build/index.html' if CRA
});



app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging

  res.status(err.status || 500).json({
    success: false,
    type: "form",
    message: err.message || 'Internal Server Error',
  });
})
app.listen(5050, () => {
    console.log('Server is running on port 5050');
  });
  