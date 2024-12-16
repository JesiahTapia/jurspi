import { NextApiRequest, NextApiResponse } from 'next';
import { Case } from '../models/Case';
import { Document } from '../models/Document';

export const documentAccessMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    const { documentId } = req.query;
    const userId = req.user.id;

    const document = await Document.findOne({ documentId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const case = await Case.findOne({ caseId: document.caseId });
    if (!case) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Check if user has access to the case
    const hasAccess = 
      case.claimantId === userId ||
      case.respondentId === userId ||
      case.arbitratorId === userId;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  } catch (error) {
    console.error('Access control error:', error);
    return res.status(500).json({ error: 'Access control check failed' });
  }
}; 