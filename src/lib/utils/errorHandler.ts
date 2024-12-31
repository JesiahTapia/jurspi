import { NextApiResponse } from 'next';

export const handleError = (res: NextApiResponse, error: any) => {
  console.error(error);
  
  // Check if res is a mock response
  if (typeof res.status !== 'function') {
    res.statusCode = error.statusCode || 500;
    return res.json({
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(error.statusCode || 500).json({
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
};

export const handleDocumentError = (error: any) => {
  if (error.message === 'Document not found') {
    return { status: 404, error: 'Document not found' };
  }
  if (error.message === 'File size exceeds limit') {
    return { status: 400, error: 'File too large' };
  }
  if (error.message === 'File type not allowed') {
    return { status: 400, error: 'Invalid file type' };
  }
  if (error.message === 'File failed virus scan') {
    return { status: 400, error: 'File failed security check' };
  }
  
  console.error('Unhandled document error:', error);
  return { status: 500, error: 'Internal server error' };
}; 