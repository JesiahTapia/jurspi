import mongoose, { Schema } from 'mongoose';

const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
});

const PartySchema = new Schema({
  type: { type: String, required: true, enum: ['CLAIMANT', 'RESPONDENT'] },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: AddressSchema, required: true }
});

const DisputeSchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ['CONTRACT', 'TORT', 'COMMERCIAL'] }
});

const ContractSchema = new Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  clauses: [{
    number: { type: Number, required: true },
    text: { type: String, required: true }
  }]
});

const ClaimDetailsSchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  breachedClauses: [{ type: Number }],
  supportingEvidence: [{ type: String }]
});

const CaseSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
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
    enum: ['FILED', 'PENDING_INITIAL_EVALUATION', 'EVALUATION', 'RESPONSE_PENDING', 'IN_PROGRESS', 'CONCLUDED', 'DISMISSED']
  },
  claimant: { type: PartySchema, required: true },
  dispute: { type: DisputeSchema, required: true },
  contract: { type: ContractSchema, required: true },
  claimDetails: { type: ClaimDetailsSchema, required: true }
}, { timestamps: true });

export const Case = mongoose.models.Case || mongoose.model('Case', CaseSchema); 