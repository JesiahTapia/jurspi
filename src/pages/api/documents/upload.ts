import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import multer from 'multer';
import { DocumentService } from '@/lib/services/documentService';
import { handleDocumentError } from '@/lib/utils/errorHandler';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { caseId, type, title } = req.body;
    const uploadedBy = req.user.id;

    const document = await DocumentService.createDocument({
      file,
      caseId,
      uploadedBy,
      type,
      title
    });

    return res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    const { status, error: errorMessage } = handleDocumentError(error);
    return res.status(status).json({ error: errorMessage });
  }
};

export const config = {
  api: {
    bodyParser: false
  }
};

export default authMiddleware(upload.single('file')(handler)); 