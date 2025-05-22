import mongoose from 'mongoose';
import GoogleStrategy from 'passport-google-oauth20';
import FacebookStrategy from 'passport-facebook';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   let user = await User.findOne({ googleId: profile.id });
//   if (!user) {
//     user = await User.create({
//       googleId: profile.id,
//       username: profile.displayName,
//       username: profile.emails?.[0]?.value
//     });
//   }
//   return done(null, user);
// }));

// // Facebook Strategy
// passport.use(new FacebookStrategy({
//   clientID: process.env.FB_CLIENT_ID,
//   clientSecret: process.env.FB_CLIENT_SECRET,
//   callbackURL: '/auth/facebook/callback',
//   profileFields: ['id', 'displayName', 'emails']
// }, async (accessToken, refreshToken, profile, done) => {
//   let user = await User.findOne({ facebookId: profile.id });
//   if (!user) {
//     user = await User.create({
//       facebookId: profile.id,
//       username: profile.emails?.[0]?.value
//     });
//   }
//   return done(null, user);
// }));

const UserSchema = new mongoose.Schema({
  name: { type: String },
  companyName: { 
    type: String,
    default: "Mi Empresa"
  },
  stripeCustomerId: {
    type: String,
    default: null,
  },
  subscriptionId: {
    type: String,
    default: null,
  },
  planId: {
    type: String,
    default: null,
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'incomplete', 'incomplete_expired', 'trialing', 'unpaid'],
    default: null,
  },
  logo: { 
    type: {
      url: String,
      public_id: String,
    },
  },
  workers: {
    type: [
      {
        email: {
          type: String,
          required: true
        },
        role: {
          type: String,
        }
      }
    ],
    default: [
      { email: "worker1@example.com", role: "editor" },
      { email: "worker2@example.com", role: "editor" }
    ]
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  payment_methods: {
    type: [{
      bank: String,
      person: String, 
      number: String,
    }],
    default: [],
  },
  facebook: { 
    type: String,
    default: ""
  },
  phone: { 
    type: String,
    default: "6671112222",
  },
  raffles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Raffle'
    }
  ]
});

UserSchema.plugin(passportLocalMongoose);

export const User = mongoose.model('User', UserSchema);