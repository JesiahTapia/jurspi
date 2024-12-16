import { NextApiRequest, NextApiResponse } from 'next';

declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string;
      email: string;
    };
  }
}

export const authMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Mock authentication for tests
  if (process.env.NODE_ENV === 'test') {
    req.user = { id: 'test-user-id', email: 'test@example.com' };
    return handler(req, res);
  }
  
  // Add actual auth logic here
  return handler(req, res);
}; 