import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/db';
import Case from '@/lib/models/Case';
import { deleteFile } from '@/lib/s3';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;
    await connectToDatabase();

    const case_ = await Case.findOneAndUpdate(
      {
        'documents._id': id,
        $or: [
          { claimant: session.user.id },
          { respondent: session.user.id }
        ]
      },
      {
        $set: {
          'documents.$.archived': true,
          'documents.$.archivedAt': new Date(),
          'documents.$.archivedBy': session.user.id
        }
      },
      { new: true }
    );

    if (!case_) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = case_.documents.id(id);
    await deleteFile(document.key);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Archive error:', error);
    return res.status(500).json({ message: 'Archive failed' });
  }
} 