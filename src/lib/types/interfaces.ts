import { Document, Types } from 'mongoose';

export interface IBaseModel extends Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IParty extends IBaseModel {
  type: 'CLAIMANT' | 'RESPONDENT';
  name: string;
  email: string;
  phone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  representatives?: Array<{
    name: string;
    email: string;
    phone?: string;
    firm?: string;
  }>;
}

export interface IContract extends IBaseModel {
  title: string;
  fileUrl: string;
  uploadedAt: Date;
  clauses: Array<{
    number: number;
    text: string;
    relevantToDispute?: boolean;
  }>;
}

export interface IEvaluation extends IBaseModel {
  evaluationDate: Date;
  arbitrationRank: number;
  evaluationType: 'INITIAL' | 'SECOND';
  findings: string;
  recommendedAction: string;
  relevantClauses: number[];
}

export interface IArbitrator extends IBaseModel {
  userId: Types.ObjectId;
  specializations: string[];
  availability: boolean;
  cases: Types.ObjectId[];
  rating?: number;
  qualifications: Array<{
    title: string;
    issuer: string;
    dateObtained: Date;
    expiryDate?: Date;
    verificationUrl?: string;
  }>;
  experience: {
    yearsOfPractice: number;
    totalCases: number;
    successRate?: number;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface IDocument {
  title: string;
  type: 'CLAIM' | 'RESPONSE' | 'EVIDENCE' | 'CONTRACT' | 'OTHER';
  fileUrl: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
  metadata?: {
    size?: number;
    mimeType?: string;
    version?: number;
  };
}

export interface ITimelineEvent {
  type: string;
  description: string;
  date: Date;
  createdBy: Types.ObjectId;
  relatedDocuments?: Types.ObjectId[];
}

export interface ICase {
  userId: Types.ObjectId;
  caseNumber: string;
  status: 'FILED' | 'PENDING_INITIAL_EVALUATION' | 'EVALUATION' | 'RESPONSE_PENDING' | 'IN_PROGRESS' | 'CONCLUDED' | 'DISMISSED';
  filingDate: Date;
  claimant: IParty;
  respondent?: IParty;
  arbitrators?: Types.ObjectId[];
  documents?: IDocument[];
  timeline?: ITimelineEvent[];
  arbitrationRank?: number;
  dispute: {
    description: string;
    amount?: number;
    category: string;
  };
  contract: IContract;
  initialEvaluation?: IEvaluation;
  secondEvaluation?: IEvaluation;
  claimDetails: {
    description: string;
    amount: number;
    breachedClauses: number[];
    supportingEvidence?: string[];
  };
  respondentAnswer?: {
    responseDate?: Date;
    accepted?: boolean;
    counterClaims?: Array<{
      description?: string;
      amount?: number;
      supportingEvidence?: string[];
    }>;
  };
}

export interface IFiling {
  filingDate: Date;
  claimantId: Types.ObjectId;
  contractId: Types.ObjectId;
  initialClaim: {
    description: string;
    amount: number;
    breachedClauses: number[];
    industryRules: string[];
  };
  supportingDocuments: Types.ObjectId[];
  initialEvaluation?: {
    evaluationDate?: Date;
    arbitrationRank?: number;
    findings?: string;
    recommendedAction?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
} 