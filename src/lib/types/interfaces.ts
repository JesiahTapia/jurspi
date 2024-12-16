export interface IParty {
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
  representatives?: {
    name: string;
    email: string;
    phone?: string;
    firm?: string;
  }[];
}

export interface IDocument {
  title: string;
  type: 'CLAIM' | 'RESPONSE' | 'EVIDENCE' | 'CONTRACT' | 'OTHER';
  fileUrl: string;
  uploadedBy: string; // User ID
  uploadedAt: Date;
  metadata: {
    size: number;
    mimeType: string;
    version: number;
  };
}

export interface ITimelineEvent {
  type: string;
  description: string;
  date: Date;
  createdBy: string; // User ID
  relatedDocuments?: string[]; // Document IDs
}

export interface IArbitrator {
  userId: string;
  specializations: string[];
  availability: boolean;
  cases: string[]; // Case IDs
  rating?: number;
}

export interface IContract {
  title: string;
  fileUrl: string;
  uploadedAt: Date;
  clauses: {
    number: number;
    text: string;
    relevantToDispute?: boolean;
  }[];
}

export interface IEvaluation {
  evaluationDate: Date;
  arbitrationRank: number; // 0.00 - 0.90
  evaluationType: 'INITIAL' | 'SECOND';
  findings: string;
  recommendedAction: string;
  relevantClauses?: number[]; // Reference to contract clauses
}

export interface ICase {
  caseNumber: string;
  status: 'FILED' | 'EVALUATION' | 'RESPONSE_PENDING' | 'IN_PROGRESS' | 'CONCLUDED' | 'DISMISSED';
  filingDate: Date;
  claimant: IParty;
  respondent?: IParty;
  arbitrators?: string[]; // Arbitrator IDs
  documents: IDocument[];
  timeline: ITimelineEvent[];
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
    supportingEvidence: string[];
  };
  respondentAnswer?: {
    responseDate: Date;
    accepted: boolean;
    counterClaims?: {
      description: string;
      amount: number;
      supportingEvidence: string[];
    }[];
  };
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IRepresentative {
  name: string;
  email: string;
  phone?: string;
  firm?: string;
  barNumber?: string;
}

export interface IMetadata {
  size: number;
  mimeType: string;
  version: number;
  lastModified: Date;
  isArchived: boolean;
}

export interface IDispute {
  description: string;
  amount: number;
  category: string;
  industryRules: string[];
  expectedResolution: string;
}

export interface IHearing {
  date: Date;
  type: 'VIRTUAL' | 'IN_PERSON' | 'DOCUMENT_ONLY';
  location?: string;
  participants: string[];
  notes?: string;
}

export interface IFiling {
  filingDate: Date;
  claimantId: string;
  contractId: string;
  initialClaim: {
    description: string;
    amount: number;
    breachedClauses: number[];
    industryRules: string[];
  };
  supportingDocuments: string[]; // Document IDs
  initialEvaluation?: {
    evaluationDate: Date;
    arbitrationRank: number;
    findings: string;
    recommendedAction: string;
  };
} 