import mongoose from 'mongoose';
import { IArbitrator } from '../types/interfaces';

const arbitratorSchema = new mongoose.Schema<IArbitrator>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specializations: [{ type: String }],
  availability: { type: Boolean, default: true },
  cases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Case' }],
  rating: Number
}, { timestamps: true });

export default mongoose.models.Arbitrator || mongoose.model<IArbitrator>('Arbitrator', arbitratorSchema); 