export interface IParty {
  id: string;
  type: 'CLAIMANT' | 'RESPONDENT';
  userId: string;
  representatives?: string[];
  contactDetails: {
    email: string;
    phone?: string;
    address?: string;
  };
}

export interface IArbitrator {
  id: string;
  userId: string;
  qualifications: string[];
  specializations: string[];
  availability: {
    startDate: Date;
    endDate?: Date;
  };
  cases: string[];
}

export interface IDocument {
  id: string;
  caseId: string;
  type: 'CONTRACT' | 'EVIDENCE' | 'MOTION' | 'AWARD' | 'OTHER';
  title: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

export interface ITimelineEvent {
  id: string;
  caseId: string;
  type: string;
  description: string;
  date: Date;
  createdBy: string;
  relatedDocuments?: string[];
}

export interface ICase {
  id: string;
  caseNumber: string;
  status: 'PENDING_INITIAL_EVALUATION' | 'ARBITRATOR_SELECTION' | 'DISCOVERY' | 'HEARING' | 'DELIBERATION' | 'CLOSED';
  filingDate: Date;
  claimant: IParty;
  respondent: IParty;
  arbitrators?: IArbitrator[];
  contract: {
    title: string;
    fileUrl: string;
    clauses: Array<{
      number: number;
      text: string;
    }>;
  };
  claimDetails: {
    description: string;
    amount: number;
    breachedClauses: number[];
    supportingEvidence: string[];
  };
  documents: IDocument[];
  timeline: ITimelineEvent[];
} 