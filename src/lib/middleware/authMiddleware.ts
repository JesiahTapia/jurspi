import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';

export const authMiddleware = (handler: Function) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (process.env.NODE_ENV === 'test' && req.user) {
    return handler(req, res);
  }

  const session = await getServerSession(req, res);
  if (!session) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  req.user = session.user;
  return handler(req, res);
}; 