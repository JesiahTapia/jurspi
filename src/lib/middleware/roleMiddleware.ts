import { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '@/lib/types/enums';

export const withRole = (allowedRoles: UserRole[]) => {
  return (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    return handler(req, res);
  };
}; 