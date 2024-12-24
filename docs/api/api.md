# Arbitration API Documentation

## Authentication

All endpoints require authentication via NextAuth session.

## Endpoints

### Cases

#### POST /api/cases

Create new arbitration case.

Request:

- Headers: Authorization
- Body: Case creation payload

Response:

- 201: Case created
- 400: Invalid data
- 401: Unauthorized

#### GET /api/cases

List user's cases.

Response:

- 200: Array of cases
- 401: Unauthorized

#### GET /api/cases/[id]

Get case details.

Response:

- 200: Case details
- 401: Unauthorized
- 404: Case not found

#### PATCH /api/cases/[id]

Update case status.

Request:

- Body: Updated fields

Response:

- 200: Updated case
- 400: Invalid data
- 401: Unauthorized
- 404: Case not found

#### POST /api/cases/[id]/documents

Upload case document.

Request:

- Body: Document metadata and URL

Response:

- 201: Document added
- 400: Invalid document
- 401: Unauthorized
- 404: Case not found
