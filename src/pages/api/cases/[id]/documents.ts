import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
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

    if (req.method === 'POST') {
      const case_ = await Case.findById(id);
      if (!case_) {
        return res.status(404).json({ message: 'Case not found' });
      }

      // Verify user has access to this case
      if (case_.claimant.userId.toString() !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const document = {
        ...req.body,
        uploadedBy: session.user.id,
        uploadedAt: new Date()
      };

      case_.documents.push(document);
      await case_.save();

      return res.status(201).json({ success: true, data: document });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 