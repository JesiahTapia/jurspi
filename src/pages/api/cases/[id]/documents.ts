import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { Case } from '@/lib/models/Case';
import { handleError } from '@/lib/utils/errorHandler';
import { caseAccessMiddleware } from '@/lib/middleware/caseAccessMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const document = {
      ...req.body,
      uploadedBy: req.user?.id || req.session?.user?.id,
      uploadedAt: new Date()
    };

    req.case.documents = req.case.documents || [];
    req.case.documents.push(document);
    await req.case.save();

    return res.status(201).json({ success: true, data: req.case });
  } catch (error) {
    return handleError(error, res);
  }
};

export default authMiddleware(caseAccessMiddleware(handler)); 