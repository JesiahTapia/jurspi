import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/db';
import Case from '@/lib/models/Case';
import { validateRequest } from '@/middleware/validateRequest';
import { errorHandler } from '@/middleware/errorHandler';
import { z } from 'zod';

const createCaseSchema = z.object({
  contract: z.object({
    title: z.string(),
    fileUrl: z.string().url(),
    clauses: z.array(z.object({
      number: z.number(),
      text: z.string()
    }))
  }),
  claimDetails: z.object({
    description: z.string(),
    amount: z.number(),
    breachedClauses: z.array(z.number()),
    supportingEvidence: z.array(z.string())
  })
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

    if (req.method === 'POST') {
      await validateRequest(createCaseSchema)(req, res, () => {});
      await connectToDatabase();

      const newCase = await Case.create({
        ...req.body,
        claimant: session.user.id,
        status: 'PENDING_INITIAL_EVALUATION'
      });

      return res.status(201).json({ success: true, data: newCase });
    }

    if (req.method === 'GET') {
      await connectToDatabase();
      const cases = await Case.find({
        $or: [
          { claimant: session.user.id },
          { respondent: session.user.id }
        ]
      });

      return res.status(200).json({ success: true, data: cases });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 