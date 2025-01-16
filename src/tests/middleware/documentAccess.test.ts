import { createMocks } from 'node-mocks-http';
import { documentAccessMiddleware } from '@/lib/middleware/documentAccessMiddleware';
import { 
  setupMongoDb, 
  teardownMongoDb, 
  clearMongoDb, 
  createTestUser, 
  createTestCase,
  s3Mock 
} from '@/tests/utils/testUtils';
import { Document } from '@/lib/models/Document';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { hash } from 'bcryptjs';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import User from '@/lib/models/User';
import { Case } from '@/models/Case';

describe('Document Access Middleware', () => {
  beforeAll(async () => await setupMongoDb());
  afterAll(async () => await teardownMongoDb());
  beforeEach(async () => await clearMongoDb());

  const mockHandler = jest.fn((req, res) => {
    return res.status(200).json({ success: true });
  });

  it('should grant access to case participants', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id);
    const document = await createTestDocument(case_._id.toString(), user._id.toString());

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: document.documentId },
      user: { id: user._id.toString() }
    });

    const handler = documentAccessMiddleware(mockHandler);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockHandler).toHaveBeenCalled();
  });

  it('should deny access to unauthorized users', async () => {
    const user = await createTestUser();
    const unauthorizedUser = await createTestUser();
    const case_ = await createTestCase(user._id);
    const document = await createTestDocument(case_._id.toString(), user._id.toString());

    const { req, res } = createMocks({
      method: 'GET',
      query: { id: document.documentId },
      user: { id: unauthorizedUser._id.toString() }
    });

    const handler = documentAccessMiddleware(mockHandler);
    await handler(req, res);

    expect(res._getStatusCode()).toBe(403);
    expect(mockHandler).not.toHaveBeenCalled();
  });
});

export async function createTestDocument(caseId: string, userId: string) {
  return Document.create({
    title: 'Test Document',
    type: 'EVIDENCE',
    fileUrl: 'https://example.com/test.pdf',
    uploadedBy: userId,
    caseId: caseId,
    documentId: new mongoose.Types.ObjectId().toString(),
    metadata: {
      size: 1024,
      mimeType: 'application/pdf'
    }
  });
} 