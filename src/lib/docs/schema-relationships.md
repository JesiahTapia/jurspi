# Database Schema Relationships

## Core Entities

- User
- Case
- Arbitrator
- Document
- Party (embedded in Case)
- Timeline (embedded in Case)

## Relationships

1. User -> Cases

   - One-to-Many: A user can be involved in multiple cases
   - Referenced by: claimantId, respondentId in Case

2. User -> Arbitrator

   - One-to-One: A user can be an arbitrator
   - Referenced by: userId in Arbitrator

3. Case -> Documents

   - One-to-Many: A case can have multiple documents
   - Embedded documents array in Case

4. Case -> Timeline Events

   - One-to-Many: A case has multiple timeline events
   - Embedded timeline array in Case

5. Case -> Arbitrators

   - Many-to-Many: Cases can have multiple arbitrators, arbitrators can handle multiple cases
   - Referenced by: arbitrators array in Case and cases array in Arbitrator

6. Case -> Parties
   - One-to-Many: A case has one claimant and one respondent
   - Embedded party objects in Case
