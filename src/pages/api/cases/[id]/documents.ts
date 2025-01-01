import { getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import Case from '@/lib/models/Case';
import { DocumentService } from '@/lib/services/documentService';

export default async function documentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req);
    if (!session?.user?.id) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const caseId = req.query.id as string;
    const case_ = await Case.findById(caseId);
    
    if (!case_) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Check if user has access to the case
    if (case_.claimant.toString() !== session.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized access to case' });
    }

    if (req.method === 'POST') {
      const { title, type } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, error: 'No file provided' });
      }

      const document = await DocumentService.createDocument({
        file,
        caseId: case_._id.toString(),
        uploadedBy: session.user.id,
        type,
        title
      });

      return res.status(201).json({ success: true, data: document });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
    
  } catch (error) {
    console.error('Document handler error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
} 