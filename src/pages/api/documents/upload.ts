import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { generateUploadUrl } from '@/lib/s3';
import { isValidFileType, MAX_FILE_SIZE, documentMetadataSchema } from '@/lib/documentValidation';
import { nanoid } from 'nanoid';

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

    const { mimeType, size } = req.body;

    if (!isValidFileType(mimeType)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    if (size > MAX_FILE_SIZE) {
      return res.status(400).json({ message: 'File too large' });
    }

    const key = `${session.user.id}/${nanoid()}-${Date.now()}`;
    const uploadUrl = await generateUploadUrl(key, mimeType);

    return res.status(200).json({ uploadUrl, key });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload preparation failed' });
  }
} 