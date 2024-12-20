import { createMocks } from 'node-mocks-http';
import { getServerSession } from 'next-auth/next';
import documentHandler from '@/pages/api/cases/[id]/documents';
import { createTestUser, createTestCase, setupTestDB, closeTestDB, clearTestDB } from '../setup';

jest.mock('next-auth/next');

describe('Case Documents API', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => {
    await clearTestDB();
    jest.clearAllMocks();
  });

  it('should upload document to case', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id);
    
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id, email: user.email }
    });

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: case_._id.toString() },
      body: {
        title: 'Evidence Document',
        type: 'EVIDENCE',
        fileUrl: 'https://example.com/evidence.pdf',
        metadata: {
          size: 1024,
          mimeType: 'application/pdf'
        }
      }
    });

    await documentHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.data.title).toBe('Evidence Document');
  });

  it('should reject invalid document type', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id);
    
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id, email: user.email }
    });

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: case_._id.toString() },
      body: {
        title: 'Invalid Doc',
        type: 'INVALID_TYPE',
        fileUrl: 'https://example.com/doc.pdf'
      }
    });

    await documentHandler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should reject unauthorized users', async () => {
    const user = await createTestUser();
    const case_ = await createTestCase(user._id);
    const otherUser = await createTestUser();
    
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: otherUser._id, email: otherUser.email }
    });

    const { req, res } = createMocks({
      method: 'POST',
      query: { id: case_._id.toString() },
      body: {
        title: 'Evidence',
        type: 'EVIDENCE',
        fileUrl: 'https://example.com/evidence.pdf'
      }
    });

    await documentHandler(req, res);
    expect(res._getStatusCode()).toBe(403);
  });
}); 