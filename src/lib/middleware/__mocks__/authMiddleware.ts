import { NextApiRequest, NextApiResponse } from 'next';

export const authMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  req.user = { id: 'test-user-id', email: 'test@example.com' };
  return handler(req, res);
}; 