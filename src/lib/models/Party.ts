import mongoose from 'mongoose';
import { PartyType, UserId } from './types';

export interface IParty {
  userId: UserId;
  type: PartyType;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  organization?: string;
  representatives?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PartySchema = new mongoose.Schema<IParty>({
  userId: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: Object.values(PartyType),
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  organization: { type: String },
  representatives: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true }
  }]
}, {
  timestamps: true
});

PartySchema.index({ userId: 1 }, { unique: true });
PartySchema.index({ email: 1 }, { unique: true });
PartySchema.index({ type: 1 });
PartySchema.index({ 'representatives.email': 1 });

export const Party = mongoose.models.Party || mongoose.model<IParty>('Party', PartySchema);
  