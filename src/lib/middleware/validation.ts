import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const caseSchema = z.object({
  caseNumber: z.string(),
  status: z.enum(['FILED', 'EVALUATION', 'RESPONSE_PENDING', 'IN_PROGRESS', 'CONCLUDED', 'DISMISSED']),
  claimant: z.object({
    type: z.enum(['CLAIMANT', 'RESPONDENT']),
    name: z.string(),
    email: z.string().email(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string()
    })
  }),
  dispute: z.object({
    description: z.string(),
    amount: z.number(),
    category: z.string()
  })
});

export const validateCase = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    await caseSchema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid case data' });
  }
}; 