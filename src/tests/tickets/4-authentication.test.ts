import { createMocks } from 'node-mocks-http';
import { setupTestDB, closeTestDB, clearTestDB } from '../shared/setup';
import registerHandler from '@/pages/api/auth/register';
import loginHandler from '@/pages/api/auth/login';
import resetPasswordHandler from '@/pages/api/auth/reset-password';
import { getServerSession } from 'next-auth/next';
import User from '@/lib/models/User';
import { UserRole } from '@/lib/types/enums';
import { withRole } from '@/lib/middleware/roleMiddleware';
import { sendEmail } from '@/lib/services/emailService';
import { setupMongoDb, teardownMongoDb, clearMongoDb } from '../utils/testUtils';
import { Case } from '@/models/Case';
import mongoose from 'mongoose';

jest.mock('next-auth/next');
jest.mock('@/lib/services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue({ messageId: 'test-id' })
}));

describe('Ticket #4: Authentication System', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => {
    await clearTestDB();
    jest.clearAllMocks();
  });

  describe('User Registration & Login', () => {
    it('should register new user with valid data', async () => {
      // Reference existing test from auth.test.ts
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!',
          role: UserRole.USER
        }
      });

      await registerHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toHaveProperty('user');
    });

    it('should login with valid credentials', async () => {
      // Reference existing test from auth.test.ts
      const { req: regReq, res: regRes } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!'
        }
      });
      await registerHandler(regReq, regRes);

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

  describe('Password Reset', () => {
    beforeEach(() => {
      (sendEmail as jest.Mock).mockClear();
    });

    it('should complete password reset flow', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: { email: 'test@example.com' }
      });

      await resetPasswordHandler(req, res);
      expect(res._getStatusCode()).toBe(200);
      expect(sendEmail).toHaveBeenCalled();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.resetToken).toBeTruthy();
      expect(updatedUser.resetTokenExpiry).toBeTruthy();
    });
  });

  describe('Protected Routes & Role Access', () => {
    const mockHandler = jest.fn((req, res) => {
      return res.status(200).json({ success: true });
    });

    beforeEach(() => {
      mockHandler.mockClear();
      (getServerSession as jest.Mock).mockClear();
    });

    it('should enforce authentication', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);
      const { req, res } = createMocks({ method: 'GET' });
      
      const protectedHandler = withRole([UserRole.USER])(mockHandler);
      await protectedHandler(req, res);
      
      expect(res._getStatusCode()).toBe(403);
      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should enforce role-based access', async () => {
      (getServerSession as jest.Mock).mockResolvedValue({
        user: { id: '123', role: UserRole.USER }
      });
      
      const { req, res } = createMocks({ method: 'GET' });
      req.user = { role: UserRole.USER };
      
      const protectedHandler = withRole([UserRole.ADMIN])(mockHandler);
      await protectedHandler(req, res);
      
      expect(res._getStatusCode()).toBe(403);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
}); 