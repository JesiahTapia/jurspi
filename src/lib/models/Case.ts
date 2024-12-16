import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  claimantId: { type: String, required: true },
  respondentId: { type: String },
  arbitratorId: { type: String },
  status: { type: String, required: true, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Case = mongoose.models.Case || mongoose.model('Case', caseSchema); 