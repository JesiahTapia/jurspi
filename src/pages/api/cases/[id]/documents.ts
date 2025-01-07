import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { DocumentService } from '@/lib/services/documentService';
import { Case } from '@/models/Case';
import multer from 'multer';
import { runMiddleware } from '@/lib/middleware/runMiddleware';
import { authOptions } from '../../auth/[...nextauth]';

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false // Disable body parser to let multer handle the form data
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    // Apply multer middleware
    await runMiddleware(req, res, upload.single('file'));

    const session = await getServerSession(req, res, authOptions);
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

    // Convert both IDs to strings before comparison
    const sessionUserId = session.user.id.toString();
    const caseUserId = case_.userId.toString();

    console.log('Session User ID (string):', sessionUserId);
    console.log('Case User ID (string):', caseUserId);
    console.log('Are IDs equal?:', sessionUserId === caseUserId);

    if (sessionUserId !== caseUserId) {
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