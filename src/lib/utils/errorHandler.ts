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