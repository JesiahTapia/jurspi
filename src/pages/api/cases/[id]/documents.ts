import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { Document } from '@/lib/models/Document';
import { documentMetadataSchema } from '@/lib/utils/documentValidation';
import { generateUploadUrl } from '@/lib/utils/s3';
import { nanoid } from 'nanoid';
import { Case } from '@/lib/models/Case';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validation = documentMetadataSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { title, type, mimeType, size } = req.body;
    const caseId = req.query.id as string;
    const userId = req.user.id;

    // Verify case access
    const case_ = await Case.findOne({
      _id: caseId,
      $or: [
        { claimant: userId },
        { respondent: userId },
        { arbitrator: userId }
      ]
    });

    if (!case_) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const documentId = `doc_${nanoid()}`;
    const key = `cases/${caseId}/${documentId}`;
    const uploadUrl = await generateUploadUrl(key, mimeType);

    const document = await Document.create({
      documentId,
      caseId,
      title,
      type,
      uploadedBy: userId,
      fileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      fileSize: size,
      mimeType,
      metadata: {
        s3Key: key
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        document,
        uploadUrl
      }
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return res.status(500).json({ message: 'Upload failed' });
  }
};

export default authMiddleware(handler); 