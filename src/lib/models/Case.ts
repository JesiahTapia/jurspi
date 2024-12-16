import mongoose from 'mongoose';
import { ICase } from '../types/interfaces';

const partySchema = new mongoose.Schema({
  type: { type: String, enum: ['CLAIMANT', 'RESPONDENT'], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  representatives: [{
    name: String,
    email: String,
    phone: String,
    firm: String
  }]
});

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['CLAIM', 'RESPONSE', 'EVIDENCE', 'CONTRACT', 'OTHER'],
    required: true 
  },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  metadata: {
    size: Number,
    mimeType: String,
    version: { type: Number, default: 1 }
  }
});

const timelineEventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relatedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
});

const contractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  clauses: [{
    number: { type: Number, required: true },
    text: { type: String, required: true },
    relevantToDispute: Boolean
  }]
});

const evaluationSchema = new mongoose.Schema({
  evaluationDate: { type: Date, default: Date.now },
  arbitrationRank: { 
    type: Number, 
    required: true,
    min: 0,
    max: 0.90
  },
  evaluationType: { 
    type: String, 
    enum: ['INITIAL', 'SECOND'],
    required: true 
  },
  findings: { type: String, required: true },
  recommendedAction: { type: String, required: true },
  relevantClauses: [Number]
});

const caseSchema = new mongoose.Schema<ICase>({
  caseNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ['FILED', 'EVALUATION', 'RESPONSE_PENDING', 'IN_PROGRESS', 'CONCLUDED', 'DISMISSED'],
    default: 'FILED'
  },
  filingDate: { type: Date, default: Date.now },
  claimant: { type: partySchema, required: true },
  respondent: partySchema,
  arbitrators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Arbitrator' }],
  documents: [documentSchema],
  timeline: [timelineEventSchema],
  arbitrationRank: Number,
  dispute: {
    description: { type: String, required: true },
    amount: Number,
    category: { type: String, required: true }
  },
  contract: { type: contractSchema, required: true },
  initialEvaluation: evaluationSchema,
  secondEvaluation: evaluationSchema,
  claimDetails: {
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    breachedClauses: [{ type: Number, required: true }],
    supportingEvidence: [{ type: String }]
  },
  respondentAnswer: {
    responseDate: Date,
    accepted: Boolean,
    counterClaims: [{
      description: String,
      amount: Number,
      supportingEvidence: [String]
    }]
  }
}, { timestamps: true });

caseSchema.index({ caseNumber: 1 }, { unique: true });
caseSchema.index({ 'claimant.email': 1 });
caseSchema.index({ 'respondent.email': 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ arbitrationRank: -1 });
caseSchema.index({ status: 1, filingDate: -1 });
caseSchema.index({ 'claimant.email': 1, 'respondent.email': 1 });
caseSchema.index({ arbitrationRank: -1, status: 1 });
caseSchema.index({ 'dispute.category': 1, status: 1 });

export default mongoose.models.Case || mongoose.model<ICase>('Case', caseSchema); 