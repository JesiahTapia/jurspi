import mongoose from 'mongoose';
import Document from '@/lib/models/Document';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase } from '@/tests/api/setup';

describe('Document Model', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('should create a document with valid data', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id.toString());
    
    const documentData = {
      title: 'Test Document',
      type: 'EVIDENCE',
      fileUrl: 'https://example.com/test.pdf',
      uploadedBy: user._id,
      caseId: case_._id,
      metadata: {
        size: 1024,
        mimeType: 'application/pdf'
      }
    };

    const document = await Document.create(documentData);
    expect(document.title).toBe('Test Document');
    expect(document.type).toBe('EVIDENCE');
  });

  it('should require mandatory fields', async () => {
    const invalidDocument = {
      title: 'Test Document'
    };

    await expect(Document.create(invalidDocument)).rejects.toThrow();
  });

  it('should validate document type', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id.toString());
    
    const invalidType = {
      title: 'Test Document',
      type: 'INVALID_TYPE',
      fileUrl: 'https://example.com/test.pdf',
      uploadedBy: user._id,
      caseId: case_._id
    };

    await expect(Document.create(invalidType)).rejects.toThrow();
  });
}); 