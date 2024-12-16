import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { DocumentService } from '@/lib/services/documentService';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { Case } from '@/lib/models/Case';
import { DocumentType } from '@/lib/models/types';

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: caseId } = req.query;
    const { type, title, description } = req.body;

    // Validate case exists and user has access
    const case = await Case.findOne({ caseId });
    if (!case) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const file = req.files?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const document = await DocumentService.createDocument({
      file,
      caseId: caseId as string,
      uploadedBy: req.user.id,
      type: type as DocumentType,
      title,
      description
    });

    // Update case documents array
    await Case.findOneAndUpdate(
      { caseId },
      { $push: { documents: document._id } }
    );

    return res.status(201).json(document);
  } catch (error) {
    console.error('Document upload error:', error);
    return res.status(500).json({ error: 'Failed to upload document' });
  }
};

export default authMiddleware(handler);

export const config = {
  api: {
    bodyParser: false // Disable built-in bodyParser for multer
  }
}; 