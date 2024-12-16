# Arbitration API Documentation

## Authentication

All endpoints require JWT authentication via Authorization header.

## Base URL

`/api`

## Endpoints

### Cases

#### Create Case

- **POST** `/cases`
- **Headers**: Authorization
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "claimAmount": "number",
    "arbitrationRank": "number",
    "contractDate": "string (optional)",
    "respondentId": "string (optional)"
  }
  ```
- **Response**: 201 Created

#### List Cases

- **GET** `/cases`
- **Query Parameters**:
  - page (default: 1)
  - limit (default: 10)
  - status (optional)
- **Response**: 200 OK

#### Get Case Details

- **GET** `/cases/{caseId}`
- **Response**: 200 OK

#### Update Case

- **PATCH** `/cases/{caseId}`
- **Body**: Partial case object
- **Response**: 200 OK

#### Upload Document

- **POST** `/cases/{caseId}/documents`
- **Body**: multipart/form-data
- **Response**: 201 Created

## Error Responses

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
