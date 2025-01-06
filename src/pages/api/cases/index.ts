import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/db';
import Case from '@/lib/models/Case';
import { validateCase, createCaseSchema } from '@/lib/middleware/validation';
import { errorHandler } from '@/middleware/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();

    if (req.method === 'POST') {
      try {
        const validatedData = await createCaseSchema.parseAsync(req.body);
        const newCase = await Case.create({
          ...validatedData,
          userId: session.user.id,
          claimant: validatedData.claimant
        });
        return res.status(201).json({ success: true, data: newCase });
      } catch (error) {
        return errorHandler(error, req, res);
      }
    }

    if (req.method === 'GET') {
      const cases = await Case.find({
        'claimant.userId': session.user.id
      });
      return res.status(200).json({ success: true, data: cases });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 