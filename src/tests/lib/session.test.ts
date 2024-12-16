import { requireAuth, requireRole } from '@/lib/session';
import { createMocks } from 'node-mocks-http';

describe('Session Management', () => {
  it('should redirect unauthenticated users', async () => {
    const context = {
      req: {},
      res: {}
    };

    const result = await requireAuth(context);
    expect(result).toHaveProperty('redirect');
    expect(result.redirect.destination).toBe('/auth/login');
  });

  it('should allow authenticated users with correct role', async () => {
    const context = {
      req: {
        session: {
          user: {
            id: '123',
            role: 'ADMIN'
          }
        }
      },
      res: {}
    };

    const result = await requireRole(context, ['ADMIN']);
    expect(result).toHaveProperty('props');
    expect(result.props).toHaveProperty('session');
  });
}); 