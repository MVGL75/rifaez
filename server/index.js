import './config/env.js';

import express from 'express';
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

import { User } from './models/Users.js';
import sanitizeUser from './utils/sanitize.js';
import raffleRoutes from './routes/raffleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import domainRoutes from './routes/domainRoutes.js';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

const mongoURI = 'mongodb://127.0.0.1:27017/rifas';



mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();
app.use(express.json());
app.use(session({
  secret: 'your_secret_key', // put a good secret here!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true if https
    sameSite: 'lax'
  }
}));
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true             
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/raffle', raffleRoutes);
app.use('/api/domains', domainRoutes)
app.use('/', authRoutes);



app.get('/api/user', async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findById(req.user._id)
    if(!user) return res.json({ message: 'User not found', status: 401 });
    const popUser = await user.populate('raffles')
    const safeUser = sanitizeUser(popUser)
    return res.json(safeUser);
  }
  return res.json({ message: 'Not authenticated', status: 401 });
});



app.use((err, req, res, next) => {
  console.error(err.stack); // Log for debugging

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
})
app.listen(5050, () => {
    console.log('Server is running on port 5050');
  });
  