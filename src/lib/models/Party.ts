import mongoose from 'mongoose';
import { IParty } from '@/types/arbitration';

const PartySchema = new mongoose.Schema<IParty>({
  type: { type: String, required: true, enum: ['CLAIMANT', 'RESPONDENT'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  representatives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  contactDetails: {
    email: { type: String, required: true },
    phone: String,
    address: String
  }
}, { timestamps: true });

export default mongoose.models.Party || mongoose.model<IParty>('Party', PartySchema);
  