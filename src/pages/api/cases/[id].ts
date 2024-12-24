import { NextApiRequest, NextApiResponse } from 'next';
import { caseAccessMiddleware } from '@/lib/middleware/caseAccessMiddleware';
import Case from '@/lib/models/Case';

const VALID_STATUSES = [
  'FILED',
  'PENDING_INITIAL_EVALUATION',
  'EVALUATION',
  'RESPONSE_PENDING',
  'IN_PROGRESS',
  'CONCLUDED',
  'DISMISSED'
];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ success: true, data: req.case });
      
    case 'PATCH':
      const { status } = req.body;
      
      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid status' 
        });
      }

      const updatedCase = await Case.findByIdAndUpdate(
        req.case._id,
        { status },
        { new: true }
      );

      return res.status(200).json({ 
        success: true, 
        data: updatedCase 
      });

    default:
      return res.status(405).json({ 
        success: false, 
        message: 'Method not allowed' 
      });
  }
};

export default caseAccessMiddleware(handler); 