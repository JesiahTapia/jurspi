import { createMocks } from 'node-mocks-http';
import { withAuth } from '@/middleware';
import { NextResponse } from 'next/server';

describe('Auth Middleware', () => {
  it('should block unauthorized access to protected routes', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/cases'
    });

    const response = await withAuth(req);
    expect(response instanceof NextResponse).toBeTruthy();
    expect(response.status).toBe(401);
  });

  it('should allow access with valid token', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/cases',
      headers: {
        authorization: `Bearer ${validToken}` // You'll need to create a valid token for testing
      }
    });

    const response = await withAuth(req);
    expect(response instanceof NextResponse).toBeTruthy();
    expect(response.status).toBe(200);
  });
}); 