import mongoose, { Document, Schema } from 'mongoose';

export interface IBusiness extends Document {
  name: string;
  industry: 'Chiropractor' | 'Real Estate' | 'Restaurant' | 'Other';
  subscriptionPlan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  subscriptionStatus: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'TRIAL';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  afterHoursAIEnabled: boolean;
  phoneNumbers: string[];
  address?: string;
  description?: string;
  services?: string;
  timezone: string;
  retellAgentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema: Schema = new Schema({
  name: { type: String, required: true },
  industry: { 
    type: String, 
    required: true, 
    enum: ['Chiropractor', 'Real Estate', 'Restaurant', 'Other'],
    default: 'Other'
  },
  subscriptionPlan: {
    type: String,
    enum: ['BASIC', 'PRO', 'ENTERPRISE'],
    default: 'BASIC'
  },
  subscriptionStatus: {
    type: String,
    enum: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIAL'],
    default: 'TRIAL'
  },
  stripeCustomerId: { type: String, required: false },
  stripeSubscriptionId: { type: String, required: false },
  afterHoursAIEnabled: { type: Boolean, default: false },
  phoneNumbers: [{ type: String }],
  address: { type: String, required: false },
  description: { type: String, required: false },
  services: { type: String, required: false },
  timezone: { type: String, default: 'UTC' },
  retellAgentId: { type: String, required: false }
}, { timestamps: true });

export default mongoose.model<IBusiness>('Business', BusinessSchema);
