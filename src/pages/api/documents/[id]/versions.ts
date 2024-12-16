import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { documentAccessMiddleware } from '@/lib/middleware/documentAccessMiddleware';
import { DocumentService } from '@/lib/services/documentService';
import multer from 'multer';
import { handleDocumentError } from '@/lib/utils/errorHandler';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: documentId } = req.query;
    const file = req.files?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const newVersion = await DocumentService.createNewVersion(
      documentId as string,
      file
    );

    return res.status(201).json(newVersion);
  } catch (error) {
    const { status, error: errorMessage, details } = handleDocumentError(error);
    return res.status(status).json({ error: errorMessage, details });
  }
};

export default authMiddleware(documentAccessMiddleware(handler));

export const config = {
  api: {
    bodyParser: false
  }
}; 