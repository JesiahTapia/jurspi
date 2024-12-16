import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { documentAccessMiddleware } from '@/lib/middleware/documentAccessMiddleware';
import { Document } from '@/lib/models/Document';
import { handleDocumentError } from '@/lib/utils/errorHandler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!['GET', 'PATCH', 'DELETE'].includes(req.method!)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: documentId } = req.query;

    switch (req.method) {
      case 'GET': {
        const document = await Document.findOne({ 
          documentId, 
          isActive: true 
        });
        return res.status(200).json(document);
      }

      case 'PATCH': {
        // Handle version updates
        const { version } = req.body;
        const document = await Document.findOne({ documentId });
        
        if (version && version !== document?.version) {
          return res.status(409).json({ 
            error: 'Version conflict',
            currentVersion: document?.version 
          });
        }

        const updatedDoc = await Document.findOneAndUpdate(
          { documentId },
          { $set: req.body },
          { new: true }
        );
        return res.status(200).json(updatedDoc);
      }

      case 'DELETE': {
        await Document.findOneAndUpdate(
          { documentId },
          { isActive: false }
        );
        return res.status(204).end();
      }
    }
  } catch (error) {
    const { status, error: errorMessage, details } = handleDocumentError(error);
    return res.status(status).json({ error: errorMessage, details });
  }
};

export default authMiddleware(documentAccessMiddleware(handler)); 