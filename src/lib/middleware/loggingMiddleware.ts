import { NextApiRequest, NextApiResponse } from 'next';

export const loggingMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log({
    requestId,
    method: req.method,
    url: req.url,
    query: req.query,
    timestamp: new Date().toISOString(),
  });

  try {
    await handler(req, res);
  } catch (error) {
    console.error({
      requestId,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  } finally {
    console.log({
      requestId,
      duration: Date.now() - startTime,
      status: res.statusCode,
    });
  }
}; 