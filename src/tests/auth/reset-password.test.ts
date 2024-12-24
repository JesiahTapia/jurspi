import { createMocks } from 'node-mocks-http';
import resetPasswordHandler from '@/pages/api/auth/reset-password';
import User from '@/lib/models/User';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../utils/testDb';

describe('Password Reset', () => {
  beforeAll(async () => await connectTestDb());
  afterAll(async () => await disconnectTestDb());
  beforeEach(async () => await clearTestDb());

  it('should generate reset token', async () => {
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
  });
}); 