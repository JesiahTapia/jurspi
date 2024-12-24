import { createMocks } from 'node-mocks-http';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { getServerSession } from 'next-auth/next';

jest.mock('next-auth/next');

describe('Protected Routes', () => {
  const mockHandler = jest.fn((req, res) => {
    return res.status(200).json({ success: true });
  });

  beforeEach(() => {
    mockHandler.mockClear();
    (getServerSession as jest.Mock).mockClear();
  });

  it('should block unauthenticated access', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'GET'
    });

    const protectedHandler = authMiddleware(mockHandler);
    await protectedHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should allow authenticated access', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: '123', email: 'test@example.com' }
    });

    const { req, res } = createMocks({
      method: 'GET'
    });

    const protectedHandler = authMiddleware(mockHandler);
    await protectedHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(mockHandler).toHaveBeenCalled();
  });
}); 