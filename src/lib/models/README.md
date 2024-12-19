# Database Schema Relationships

## Core Models

1. Case
2. Party (Claimant/Respondent)
3. Arbitrator
4. Document
5. TimelineEvent

## Relationships

### Case Model

- Has one Claimant (Party)
- Has one Respondent (Party)
- Has many Arbitrators
- Has many Documents
- Has many TimelineEvents
- Has one Contract
- Has optional Evaluations

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
- Uploaded by one User
- Can be referenced by TimelineEvents
- Supports versioning and metadata

References:

- caseId -> Case.caseId
- uploadedBy -> UserId (Party.userId or Arbitrator.arbitratorId)

### TimelineEvent Model

- Belongs to one Case
- Created by one User (Party/Arbitrator)
- Can reference multiple Documents

References:

- caseId -> Case.caseId
- createdBy -> UserId (Party.userId or Arbitrator.arbitratorId)
- relatedDocuments -> Document.\_id

## Indexes

Key indexes are maintained on:

### Case Indexes

- caseNumber (unique)
- status, filingDate
- arbitrationRank
- claimant.email, respondent.email
- dispute.category

### Document Indexes

- caseId, type
- uploadedAt
- uploadedBy

### Arbitrator Indexes

- userId (unique)
- specializations
- rating
- status

### Party Indexes

- userId
- email
- type

### TimelineEvent Indexes

- caseId, date
- type, date

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

## Validation Rules

### Case

- Unique case number
- Valid status transitions
- Required claimant information
- Valid monetary amounts

### Document

- Valid file types
- Maximum file size
- Version control

### TimelineEvent

- Chronological order
- Valid event types

### Party

- Valid email format
- Required contact information

### Arbitrator

- Qualification verification
- Case load limits
