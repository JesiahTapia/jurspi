import { createMocks } from 'node-mocks-http';
import { documentAccessMiddleware } from '@/lib/middleware/documentAccessMiddleware';
import { setupTestDB, closeTestDB, clearTestDB, createTestUser, createTestCase, createTestDocument } from '../api/setup';

describe('Document Access Middleware', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => await clearTestDB());

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