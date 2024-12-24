import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { Case } from '@/lib/models/Case';
import { validateCaseUpdate } from '@/lib/validation/caseValidation';
import { handleError } from '@/lib/utils/errorHandler';
import { caseAccessMiddleware } from '@/lib/middleware/caseAccessMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ success: true, data: req.case });
    }

    if (req.method === 'PATCH') {
      const validationResult = validateCaseUpdate(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.errors });
      }

      Object.assign(req.case, req.body);
      await req.case.save();
      return res.status(200).json({ success: true, data: req.case });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return handleError(error, res);
  }
};

export default authMiddleware(caseAccessMiddleware(handler)); 