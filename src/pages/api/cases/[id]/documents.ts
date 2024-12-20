import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/db';
import Case from '@/lib/models/Case';
import { validateRequest } from '@/middleware/validateRequest';
import { errorHandler } from '@/middleware/errorHandler';
import { z } from 'zod';

const documentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['CLAIM', 'RESPONSE', 'EVIDENCE', 'CONTRACT', 'OTHER']),
  fileUrl: z.string().url(),
  metadata: z.object({
    size: z.number(),
    mimeType: z.string(),
    version: z.number().optional()
  }).optional()
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

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
    await validateRequest(documentSchema)(req, res, () => {});

    const case_ = await Case.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { claimant: session.user.id },
          { respondent: session.user.id }
        ]
      },
      {
        $push: {
          documents: {
            ...req.body,
            uploadedBy: session.user.id,
            uploadedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!case_) {
      return res.status(404).json({ message: 'Case not found' });
    }

    return res.status(201).json({ 
      success: true, 
      data: case_.documents[case_.documents.length - 1] 
    });
  } catch (error) {
    return errorHandler(error, req, res);
  }
} 