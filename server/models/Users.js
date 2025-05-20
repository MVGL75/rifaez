import mongoose from 'mongoose';
import RaffleSchema from './Raffle.js';
import passportLocalMongoose from 'passport-local-mongoose';

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