import { createMocks } from 'node-mocks-http';
import documentHandler from '@/pages/api/cases/[id]/documents';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase } from './setup';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Documents API', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => {
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
        title: 'Test Document',
        type: 'EVIDENCE',
        fileUrl: 'https://example.com/document.pdf',
        metadata: {
          size: 1024,
          mimeType: 'application/pdf',
          version: 1
        }
      }
    });

    await documentHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toHaveProperty('success', true);
  });
}); 