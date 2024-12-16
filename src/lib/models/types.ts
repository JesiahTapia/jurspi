// Common Types
export type UserId = string;
export type CaseId = string;
export type DocumentId = string;

export enum CaseStatus {
  DRAFT = 'DRAFT',
  FILED = 'FILED',
  INITIAL_REVIEW = 'INITIAL_REVIEW',
  RESPONDENT_NOTIFIED = 'RESPONDENT_NOTIFIED',
  RESPONSE_RECEIVED = 'RESPONSE_RECEIVED',
  SECOND_REVIEW = 'SECOND_REVIEW',
  ARBITRATOR_SELECTION = 'ARBITRATOR_SELECTION',
  HEARING_SCHEDULED = 'HEARING_SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIBERATION = 'DELIBERATION',
  CLOSED = 'CLOSED'
}

export enum PartyType {
  CLAIMANT = 'CLAIMANT',
  RESPONDENT = 'RESPONDENT'
}

export enum DocumentType {
  CLAIM = 'CLAIM',
  RESPONSE = 'RESPONSE',
  EVIDENCE = 'EVIDENCE',
  CONTRACT = 'CONTRACT',
  AWARD = 'AWARD',
  OTHER = 'OTHER'
} 