import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const PartySchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['CLAIMANT', 'RESPONDENT'] },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: AddressSchema, required: true }
});

const DisputeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ['CONTRACT', 'TORT', 'COMMERCIAL'] }
});

const ContractSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  clauses: [{
    number: { type: Number, required: true },
    text: { type: String, required: true }
  }]
});

const ClaimDetailsSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  breachedClauses: [{ type: Number }],
  supportingEvidence: [{ type: String }]
});

const caseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true,
    enum: ['FILED', 'EVALUATION', 'ARBITRATION', 'CLOSED']
  },
  claimant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dispute: {
    description: String,
    amount: Number,
    category: {
      type: String,
      required: true
    }
  },
  contract: {
    title: String,
    fileUrl: String,
    clauses: [{
      number: Number,
      text: String
    }]
  },
  claimDetails: {
    description: String,
    amount: Number,
    breachedClauses: [Number],
    supportingEvidence: [String]
  }
}, {
  timestamps: true
});

// Single index declarations instead of duplicates
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ "claimant.email": 1, "respondent.email": 1 });
caseSchema.index({ arbitrationRank: -1, status: 1 });
caseSchema.index({ "dispute.category": 1, status: 1 });

export const Case = mongoose.models.Case || mongoose.model('Case', caseSchema);
export default Case; 