import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { Case } from '@/lib/models/Case';
import { validateCaseUpdate } from '@/lib/validation/caseValidation';
import { handleError } from '@/lib/utils/errorHandler';
import { caseAccessMiddleware } from '@/lib/middleware/caseAccessMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!['GET', 'PATCH'].includes(req.method!)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: caseId } = req.query;

    switch (req.method) {
      case 'GET': {
        const caseData = await Case.findOne({ caseId })
          .populate('documents')
          .lean();
          
        if (!caseData) {
          return res.status(404).json({ error: 'Case not found' });
        }
        
        return res.status(200).json(caseData);
      }

      case 'PATCH': {
        const validationResult = validateCaseUpdate(req.body);
        if (!validationResult.success) {
          return res.status(400).json({ errors: validationResult.errors });
        }

        const updatedCase = await Case.findOneAndUpdate(
          { caseId },
          { 
            $set: req.body,
            $push: {
              timeline: {
                event: 'CASE_UPDATED',
                date: new Date(),
                description: 'Case details updated'
              }
            }
          },
          { new: true }
        );

        return res.status(200).json(updatedCase);
      }
    }
  } catch (error) {
    return handleError(error, res);
  }
};

export default authMiddleware(caseAccessMiddleware(handler)); 