import mongoose from 'mongoose';
import { IArbitrator } from '../types/interfaces';

const qualificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  dateObtained: { type: Date, required: true },
  expiryDate: Date,
  verificationUrl: String
});

const experienceSchema = new mongoose.Schema({
  yearsOfPractice: { 
    type: Number, 
    required: true,
    min: 0
  },
  totalCases: { 
    type: Number, 
    default: 0,
    min: 0
  },
  successRate: {
    type: Number,
    min: 0,
    max: 100
  }
});

const arbitratorSchema = new mongoose.Schema<IArbitrator>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specializations: [{ type: String, required: true }],
  availability: { type: Boolean, default: true },
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }],
  rating: { type: Number, min: 0, max: 5 },
  qualifications: [qualificationSchema],
  experience: experienceSchema,
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

arbitratorSchema.index({ userId: 1 }, { unique: true });
arbitratorSchema.index({ specializations: 1 });
arbitratorSchema.index({ rating: -1 });
arbitratorSchema.index({ status: 1 });
arbitratorSchema.index({ 'experience.totalCases': -1 });

export default mongoose.models.Arbitrator || mongoose.model<IArbitrator>('Arbitrator', arbitratorSchema); 