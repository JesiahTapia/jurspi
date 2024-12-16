# Database Schema Relationships

## Core Models

1. Case
2. Party (Claimant/Respondent)
3. Arbitrator
4. Document

## Relationships

### Case Model

- Has one Claimant (Party)
- Has one Respondent (Party)
- Has one or more Arbitrators
- Has many Documents
- Contains timeline events

References:

- claimantId -> Party.userId
- respondentId -> Party.userId
- arbitratorId -> Arbitrator.arbitratorId
- documents -> Document.\_id

### Party Model

- Can be involved in multiple cases
- Can have multiple representatives
- Can be either Claimant or Respondent

References:

- userId -> unique identifier

### Arbitrator Model

- Can handle multiple cases
- Tracks both current and completed cases

References:

- currentCases -> Case.\_id
- completedCases -> Case.\_id

### Document Model

- Belongs to one Case
- Uploaded by one Party or Arbitrator
- Supports versioning

References:

- caseId -> Case.caseId
- uploadedBy -> UserId (Party.userId or Arbitrator.arbitratorId)

## Indexes

Key indexes are maintained on:

- Case: caseId, caseNumber
- Party: userId, email
- Arbitrator: arbitratorId, email
- Document: documentId, caseId

## Notes

- All models include timestamps (createdAt, updatedAt)
- Documents support soft deletion via isActive flag
- Arbitrator availability is tracked in real-time
- Case status follows AAA arbitration process workflow
- Compound indexes support common query patterns
- Unique constraints on critical fields prevent duplicates
- All references maintain referential integrity
- Version control implemented for documents
- Support for metadata and custom fields
- Optimized for read-heavy operations
