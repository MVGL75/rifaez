import mongoose from 'mongoose';

const customDomainSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional if you're using a users collection
    required: true,
    unique: true,
  },
  domain: {
    type: String,
    required: true,
    unique: true, // ensures one domain can't be added twice
    lowercase: true,
    trim: true,
  },
  subdomain: {
    type: String,
    // required: true,
    lowercase: true,
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastVerifiedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'expired'],
    default: 'pending',
  },
});

export default mongoose.model('CustomDomain', customDomainSchema);