import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { loggingMiddleware } from '@/lib/middleware/loggingMiddleware';
import { DocumentService } from '@/lib/services/documentService';
import { handleDocumentError } from '@/lib/utils/errorHandler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { operation, documentIds } = req.body;

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({ error: 'Invalid documentIds' });
    }

    switch (operation) {
      case 'delete':
        await Promise.all(
          documentIds.map(id => DocumentService.softDelete(id))
        );
        return res.status(204).end();

      case 'archive':
        await Promise.all(
          documentIds.map(id => 
            DocumentService.updateStatus(id, { isActive: false })
          )
        );
        return res.status(200).json({ 
          message: `${documentIds.length} documents archived` 
        });

      case 'restore':
        await Promise.all(
          documentIds.map(id => 
            DocumentService.updateStatus(id, { isActive: true })
          )
        );
        return res.status(200).json({ 
          message: `${documentIds.length} documents restored` 
        });

      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
  } catch (error) {
    const { status, error: errorMessage, details } = handleDocumentError(error);
    return res.status(status).json({ error: errorMessage, details });
  }
};

export default authMiddleware(loggingMiddleware(handler)); 