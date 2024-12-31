import { NextApiRequest, NextApiResponse } from 'next';
import { Document } from '@/lib/models/Document';
import { Case } from '@/lib/models/Case';w

export const documentAccessMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const documentId = req.query.id as string;
    const userId = req.user?.id;

    const document = await Document.findOne({ documentId });
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const case_ = await Case.findById(document.caseId);
    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const hasAccess = [
      case_.claimant.toString(),
      case_.respondent?.toString(),
      ...(case_.arbitrators || []).map(a => a.toString())
    ].includes(userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    req.document = document;
    return handler(req, res);
  } catch (error) {
    console.error('Document access error:', error);
    return res.status(500).json({ message: 'Access check failed' });
  }
}; 