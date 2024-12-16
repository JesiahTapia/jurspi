import { NextApiResponse } from 'next';

export const handleError = (res: NextApiResponse, error: any) => {
  console.error(error);
  return res.status(error.statusCode || 500).json({
    error: error.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
}; 