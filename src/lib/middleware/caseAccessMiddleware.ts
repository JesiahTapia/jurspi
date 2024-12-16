import { NextApiRequest, NextApiResponse } from 'next';
import { Case } from '../models/Case';
import { ApiError } from './errorHandlingMiddleware';

export const caseAccessMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const { id: caseId } = req.query;
    const userId = req.user.id;

    const caseData = await Case.findOne({ caseId });
    if (!caseData) {
      throw new ApiError(404, 'Case not found');
    }

    const hasAccess = 
      caseData.claimantId === userId ||
      caseData.respondentId === userId ||
      caseData.arbitratorId === userId;

    if (!hasAccess) {
      throw new ApiError(403, 'Access denied');
    }

    next();
  } catch (error) {
    throw error;
  }
}; 