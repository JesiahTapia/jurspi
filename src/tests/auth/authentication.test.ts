import { createMocks } from 'node-mocks-http';
import { setupTestDB, closeTestDB, clearTestDB } from '../setup';
import registerHandler from '@/pages/api/auth/register';
import resetPasswordHandler from '@/pages/api/auth/reset-password';
import { getServerSession } from 'next-auth/next';
import User from '@/lib/models/User';

jest.mock('next-auth/next');

describe('Authentication System', () => {
  beforeAll(async () => await setupTestDB());
  afterAll(async () => await closeTestDB());
  beforeEach(async () => {
    await clearTestDB();
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should register new user with valid data', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        }
      });

      await registerHandler(req, res);
      expect(res._getStatusCode()).toBe(201);
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
    });

    it('should reject duplicate email', async () => {
      await User.create({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User'
        }
      });

      await registerHandler(req, res);
      expect(res._getStatusCode()).toBe(400);
    });
  });

  describe('Password Reset', () => {
    it('should handle password reset request', async () => {
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

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.resetToken).toBeTruthy();
      expect(updatedUser.resetTokenExpiry).toBeTruthy();
    });

    it('should reset password with valid token', async () => {
      const resetToken = 'valid-token';
      const user = await User.create({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000)
      });

      const { req, res } = createMocks({
        method: 'PUT',
        body: {
          token: resetToken,
          password: 'NewPassword123!'
        }
      });

      await resetPasswordHandler(req, res);
      expect(res._getStatusCode()).toBe(200);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.resetToken).toBeUndefined();
      expect(updatedUser.resetTokenExpiry).toBeUndefined();
    });
  });
}); 