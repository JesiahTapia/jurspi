import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { DocumentService } from '@/lib/services/documentService';
import { Case } from '@/models/Case';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: true // Enable body parser for URL-based uploads
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const session = await getServerSession(req);
    if (!session?.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const caseId = req.query.id;
    if (!caseId || Array.isArray(caseId)) {
      return res.status(400).json({ success: false, message: 'Invalid case ID' });
    }

    const case_ = await Case.findById(caseId);
    console.log('Found Case:', case_);
    
    if (!case_) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (!case_.userId) {
      return res.status(500).json({ success: false, message: 'Case is missing userId' });
    }

    if (case_.userId.toString() !== session.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, type } = req.body;
    const file = (req as any).file;

    if (!file || !title || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const doc = await DocumentService.createDocument({
      file,
      caseId: caseId.toString(),
      uploadedBy: session.user.id,
      type,
      title
    });

    return res.status(201).json({
      success: true,
      data: doc
    });

  } catch (err) {
    console.error('Error in document upload:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
} 