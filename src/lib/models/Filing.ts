import mongoose from 'mongoose';
import { IFiling } from '../types/interfaces';

const filingSchema = new mongoose.Schema<IFiling>({
  filingDate: { type: Date, default: Date.now },
  claimantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  initialClaim: {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    breachedClauses: [Number],
    industryRules: [String]
  },
  supportingDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  initialEvaluation: {
    evaluationDate: Date,
    arbitrationRank: {
      type: Number,
      min: 0,
      max: 0.90
    },
    findings: String,
    recommendedAction: String
  }
}, { timestamps: true });

// Add indexes for common queries
filingSchema.index({ filingDate: -1 });
filingSchema.index({ claimantId: 1 });
filingSchema.index({ 'initialEvaluation.arbitrationRank': -1 });

export default mongoose.models.Filing || mongoose.model<IFiling>('Filing', filingSchema); 