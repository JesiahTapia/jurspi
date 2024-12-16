# Case Management API

## Endpoints

### Create Case

POST /api/cases

- Headers: Authorization (JWT)
- Body:
  - title: string
  - description: string
  - claimAmount: number
  - arbitrationRank: number (0-0.90)
  - contractDate?: string (ISO date)
  - respondentId?: string

### List Cases

GET /api/cases

- Headers: Authorization (JWT)
- Query Parameters:
  - page?: number
  - limit?: number
  - status?: CaseStatus

### Get Case Details

GET /api/cases/{caseId}

- Headers: Authorization (JWT)
- Response: ICase (populated documents)

### Update Case

PATCH /api/cases/{caseId}

- Headers: Authorization (JWT)
- Body: Partial<ICase>

### Upload Case Document

POST /api/cases/{caseId}/documents

- Headers: Authorization (JWT)
- Body: multipart/form-data
  - file: File
  - type: DocumentType
  - title: string
  - description?: string

## Error Responses

- 400: Bad Request / Validation Error
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error
