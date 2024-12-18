export interface IUser {
  id: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN' | 'ARBITRATOR';
}

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
  representatives?: Array<{
    name: string;
    email: string;
    phone?: string;
    firm?: string;
  }>;
}

export interface IArbitrator {
  userId: string;
  specializations: string[];
  availability: boolean;
  cases: string[];
  rating?: number;
}

export interface IDocument {
  title: string;
  type: 'CLAIM' | 'RESPONSE' | 'EVIDENCE' | 'CONTRACT' | 'OTHER';
  fileUrl: string;
  uploadedBy: string;
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
  createdBy: string;
  relatedDocuments?: string[];
}

export interface ICase {
  caseNumber: string;
  status: 'FILED' | 'EVALUATION' | 'RESPONSE_PENDING' | 'IN_PROGRESS' | 'CONCLUDED' | 'DISMISSED';
  filingDate: Date;
  claimant: IParty;
  respondent?: IParty;
  arbitrators?: string[];
  documents: IDocument[];
  timeline: ITimelineEvent[];
  arbitrationRank?: number;
  dispute: {
    description: string;
    amount?: number;
    category: string;
  };
  contract: {
    title: string;
    fileUrl: string;
    uploadedAt: Date;
    clauses: Array<{
      number: number;
      text: string;
      relevantToDispute?: boolean;
    }>;
  };
  claimDetails: {
    description: string;
    amount: number;
    breachedClauses: number[];
    supportingEvidence: string[];
  };
  respondentAnswer?: {
    responseDate?: Date;
    accepted?: boolean;
    counterClaims?: Array<{
      description: string;
      amount?: number;
      supportingEvidence?: string[];
    }>;
  };
} 