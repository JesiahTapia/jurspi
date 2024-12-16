import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@/lib/middleware/authMiddleware';
import { loggingMiddleware } from '@/lib/middleware/loggingMiddleware';
import { Document } from '@/lib/models/Document';
import { handleDocumentError } from '@/lib/utils/errorHandler';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      caseId,
      type,
      title,
      uploadedBy,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query: any = { isActive: true };
    
    if (caseId) query.caseId = caseId;
    if (type) query.type = type;
    if (title) query.title = { $regex: title, $options: 'i' };
    if (uploadedBy) query.uploadedBy = uploadedBy;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [documents, total] = await Promise.all([
      Document.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Document.countDocuments(query)
    ]);

    return res.status(200).json({
      documents,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    const { status, error: errorMessage, details } = handleDocumentError(error);
    return res.status(status).json({ error: errorMessage, details });
  }
};

export default authMiddleware(loggingMiddleware(handler)); 