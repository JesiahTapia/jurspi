import { createMocks } from 'node-mocks-http';
import registerHandler from '@/pages/api/auth/register';
import loginHandler from '@/pages/api/auth/login';
import resetPasswordHandler from '@/pages/api/auth/reset-password';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../utils/testDb';

describe('Authentication API', () => {
  beforeAll(async () => await connectTestDb());
  afterAll(async () => await disconnectTestDb());
  afterEach(async () => await clearTestDb());

  describe('Registration', () => {
    it('should register a new user successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!',
          role: 'USER'
        }
      });

      await registerHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toHaveProperty('user');
    });

    it('should reject invalid email format', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'invalid-email',
          password: 'Password123!'
        }
      });

      await registerHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe('Login', () => {
    it('should login user with correct credentials', async () => {
      // First register a user
      const { req: regReq, res: regRes } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      await registerHandler(regReq, regRes);

      // Then try to login
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });

      await loginHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('token');
    });
  });
}); 