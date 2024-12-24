import { NextApiRequest, NextApiResponse } from 'next';
import Case from '@/lib/models/Case';
import { Types } from 'mongoose';

export const caseAccessMiddleware = (handler: Function) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const caseId = req.query.id as string;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const claimantId = Types.ObjectId.isValid(caseData.claimant) 
      ? caseData.claimant.toString()
      : caseData.claimant._id?.toString();

    if (claimantId !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.case = caseData;
    return handler(req, res);
  } catch (error) {
    console.error('Case access error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}; 