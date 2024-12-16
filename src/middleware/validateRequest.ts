import { NextApiRequest, NextApiResponse } from 'next';
import { Schema } from 'zod';
import { ApiError } from './errorHandler';

export const validateRequest = (schema: Schema) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      throw new ApiError(400, 'Invalid request data');
    }
  };
}; 