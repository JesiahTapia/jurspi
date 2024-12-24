import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/db';
import Case from '@/lib/models/Case';
import { validateRequest } from '@/middleware/validateRequest';
import { errorHandler } from '@/middleware/errorHandler';
import { z } from 'zod';

const updateCaseSchema = z.object({
  status: z.enum(['PENDING_INITIAL_EVALUATION', 'PENDING_RESPONSE', 'UNDER_REVIEW', 'ARBITRATION_PHASE']).optional(),
  respondentAnswer: z.object({
    accepted: z.boolean(),
    counterClaims: z.array(z.object({
      description: z.string(),
      amount: z.number(),
      supportingEvidence: z.array(z.string())
    })).optional()
  }).optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    await connectToDatabase();

    if (req.method === 'GET') {
      const case_ = await Case.findOne({
        _id: id,
        claimant: session.user.id
      });

      if (!case_) {
        return res.status(404).json({ message: 'Case not found' });
      }

      return res.status(200).json({ success: true, data: case_ });
    }

    if (req.method === 'PATCH') {
      await validateRequest(updateCaseSchema)(req, res, () => {});

      const case_ = await Case.findOneAndUpdate(
        {
          _id: id,
          claimant: session.user.id
        },
        { $set: req.body },
        { new: true }
      );

      if (!case_) {
        return res.status(404).json({ message: 'Case not found' });
      }

      return res.status(200).json({ success: true, data: case_ });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 