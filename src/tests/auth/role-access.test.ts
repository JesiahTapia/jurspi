import { createMocks } from 'node-mocks-http';
import { withRole } from '@/lib/middleware/roleMiddleware';
import { UserRole } from '@/lib/types/enums';

describe('Role-Based Access Control', () => {
  const mockHandler = jest.fn((req, res) => {
    return res.status(200).json({ success: true });
  });

  beforeEach(() => {
    mockHandler.mockClear();
  });

  it('should allow access with correct role', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });
    
    req.user = { role: UserRole.ADMIN };
    const protectedHandler = withRole([UserRole.ADMIN])(mockHandler);
    
    await protectedHandler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(mockHandler).toHaveBeenCalled();
  });

  it('should deny access with incorrect role', async () => {
    const { req, res } = createMocks({
      method: 'GET'
    });
    
    req.user = { role: UserRole.USER };
    const protectedHandler = withRole([UserRole.ADMIN])(mockHandler);
    
    await protectedHandler(req, res);
    expect(res._getStatusCode()).toBe(403);
    expect(mockHandler).not.toHaveBeenCalled();
  });
}); 