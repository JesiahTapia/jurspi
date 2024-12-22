import { NextApiRequest, NextApiResponse } from 'next';
import Case from '@/lib/models/Case';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { caseAccessMiddleware } from '@/lib/middleware/caseAccessMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;
  const { title, type, fileUrl, metadata } = req.body;

  try {
    const case_ = await Case.findById(id);
    if (!case_) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    case_.documents.push({ title, type, fileUrl, metadata });
    await case_.save();

    return res.status(201).json({ 
      success: true, 
      data: case_.documents[case_.documents.length - 1] 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default authMiddleware(caseAccessMiddleware(handler)); 