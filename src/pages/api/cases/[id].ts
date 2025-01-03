import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { Case } from '@/models/Case';
import { connectToDatabase } from '@/lib/db';
import { errorHandler } from '@/middleware/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectToDatabase();
    const { id } = req.query;

    if (req.method === 'GET') {
      const case_ = await Case.findById(id);
      if (!case_) {
        return res.status(404).json({ message: 'Case not found' });
      }
      return res.status(200).json({ success: true, data: case_ });
    }

    if (req.method === 'PATCH') {
      const case_ = await Case.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: case_ });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 