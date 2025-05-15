import mongoose from 'mongoose';
import RaffleSchema from './Raffle.js';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  companyName: { 
    type: String,
    default: "Mi Empresa"
  },
  logo: { 
    type: String,
    default: null
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
          required: true
        }
      }
    ],
    default: [
      { email: "worker1@example.com", role: "editor" },
      { email: "worker2@example.com", role: "editor" }
    ]
  },
  currentPlan: { 
    type: String,
    default: "basic"
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