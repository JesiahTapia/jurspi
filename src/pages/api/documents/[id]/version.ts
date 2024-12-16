import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/db';
import Case from '@/lib/models/Case';
import { generateUploadUrl } from '@/lib/s3';

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

    const case_ = await Case.findOne({
      'documents._id': id,
      $or: [
        { claimant: session.user.id },
        { respondent: session.user.id }
      ]
    });

    if (!case_) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = case_.documents.id(id);
    document.version += 1;
    await case_.save();

    const key = `${session.user.id}/${id}/v${document.version}`;
    const uploadUrl = await generateUploadUrl(key, document.metadata.mimeType);

    return res.status(200).json({ uploadUrl, key, version: document.version });
  } catch (error) {
    console.error('Version control error:', error);
    return res.status(500).json({ message: 'Version update failed' });
  }
} 