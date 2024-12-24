import { NextApiRequest, NextApiResponse } from 'next';
import Case from '@/lib/models/Case';

export const caseAccessMiddleware = (handler: Function) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    if (!req.query.id) {
      return res.status(400).json({ success: false, message: 'Case ID required' });
    }

    const caseId = req.query.id as string;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    // Allow access if user is claimant or respondent
    if (caseData.claimant.toString() !== userId && 
        caseData.respondent?.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return handler(req, res);
  } catch (error) {
    console.error('Case access error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}; 