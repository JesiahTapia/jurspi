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