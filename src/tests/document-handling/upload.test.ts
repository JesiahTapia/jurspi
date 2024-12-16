import { createMocks } from 'node-mocks-http';
import uploadHandler from '@/pages/api/documents/upload';
import { setupTestDB, createTestUser } from './setup';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Document Upload', () => {
  let mongod;

  beforeAll(async () => {
    mongod = await setupTestDB();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  it('should validate file type', async () => {
    const user = await createTestUser();
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id }
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        mimeType: 'invalid/type',
        size: 1024
      }
    });

    await uploadHandler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should validate file size', async () => {
    const user = await createTestUser();
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: user._id }
    });

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        mimeType: 'application/pdf',
        size: 20 * 1024 * 1024 // 20MB (too large)
      }
    });

    await uploadHandler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });
}); 