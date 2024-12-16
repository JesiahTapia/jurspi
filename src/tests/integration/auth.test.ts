import { createMocks } from 'node-mocks-http';
import { UserRole } from '@/lib/types/enums';
import registerHandler from '@/pages/api/auth/register';

describe('Authentication', () => {
  it('should register a new user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER
      }
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });
}); 