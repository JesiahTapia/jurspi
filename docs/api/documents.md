# Document Management API

## Endpoints

### Upload Document

POST /api/cases/{caseId}/documents

- Headers: Authorization (JWT)
- Body: multipart/form-data
  - file: File (max 10MB)
  - type: DocumentType
  - title: string
  - description?: string

### Get Document

GET /api/documents/{documentId}

- Headers: Authorization (JWT)
- Response: IDocument

### Update Document Version

POST /api/documents/{documentId}/versions

- Headers: Authorization (JWT)
- Body: multipart/form-data
  - file: File

### Search Documents

GET /api/documents/search

- Headers: Authorization (JWT)
- Query Parameters:
  - caseId?: string
  - type?: DocumentType
  - title?: string
  - uploadedBy?: string
  - startDate?: string
  - endDate?: string
  - page?: number
  - limit?: number

### Delete Document

DELETE /api/documents/{documentId}

- Headers: Authorization (JWT)
- Response: 204 No Content

## Error Responses

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Version Conflict
- 413: Payload Too Large
- 415: Unsupported Media Type
- 500: Internal Server Error
