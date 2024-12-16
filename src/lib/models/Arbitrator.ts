import mongoose from 'mongoose';
import { UserId } from './types';

export interface IArbitrator {
  arbitratorId: UserId;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  qualifications: {
    degree: string;
    institution: string;
    year: number;
  }[];
  yearsOfExperience: number;
  languages: string[];
  availability: boolean;
  rating?: number;
  casesHandled: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  currentCases: mongoose.Types.ObjectId[];
  completedCases: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ArbitratorSchema = new mongoose.Schema<IArbitrator>({
  arbitratorId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specializations: [{ type: String, required: true }],
  qualifications: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true }
  }],
  yearsOfExperience: { type: Number, required: true },
  languages: [{ type: String, required: true }],
  availability: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5 },
  casesHandled: { type: Number, default: 0 },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  currentCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }],
  completedCases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }]
}, {
  timestamps: true
});

// Add indexes for common queries
ArbitratorSchema.index({ email: 1 });
ArbitratorSchema.index({ specializations: 1 });
ArbitratorSchema.index({ availability: 1 });
ArbitratorSchema.index({ languages: 1 });
ArbitratorSchema.index({ arbitratorId: 1 }, { unique: true });
ArbitratorSchema.index({ email: 1 }, { unique: true });
ArbitratorSchema.index({ specializations: 1 });
ArbitratorSchema.index({ languages: 1 });
ArbitratorSchema.index({ availability: 1 });
ArbitratorSchema.index({ rating: -1 });

export const Arbitrator = mongoose.models.Arbitrator || mongoose.model<IArbitrator>('Arbitrator', ArbitratorSchema); 