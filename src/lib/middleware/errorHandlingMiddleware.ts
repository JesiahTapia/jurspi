import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { MongoError } from 'mongodb';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandlingMiddleware = (handler: any) => async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    await handler(req, res);
  } catch (error) {
    console.error(`[${req.method}] ${req.url} Error:`, error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        error: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        path: req.url
      });
    }

    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
        timestamp: new Date().toISOString(),
        path: req.url
      });
    }

    if (error instanceof MongoError) {
      if (error.code === 11000) {
        return res.status(409).json({
          error: 'Duplicate entry',
          details: error.keyValue,
          timestamp: new Date().toISOString(),
          path: req.url
        });
      }
    }

    return res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: req.url,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 