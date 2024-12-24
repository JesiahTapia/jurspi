import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string()
});

const claimantSchema = z.object({
  type: z.enum(['CLAIMANT', 'RESPONDENT']),
  name: z.string(),
  email: z.string().email(),
  address: addressSchema
});

const disputeSchema = z.object({
  description: z.string(),
  amount: z.number(),
  category: z.enum(['CONTRACT', 'TORT', 'COMMERCIAL'])
});

const contractSchema = z.object({
  title: z.string(),
  fileUrl: z.string().url(),
  clauses: z.array(z.object({
    number: z.number(),
    text: z.string()
  }))
});

const claimDetailsSchema = z.object({
  description: z.string(),
  amount: z.number(),
  breachedClauses: z.array(z.number()),
  supportingEvidence: z.array(z.string())
});

export const createCaseSchema = z.object({
  caseNumber: z.string(),
  status: z.enum([
    'FILED',
    'PENDING_INITIAL_EVALUATION',
    'EVALUATION',
    'RESPONSE_PENDING',
    'IN_PROGRESS',
    'CONCLUDED',
    'DISMISSED'
  ]),
  claimant: claimantSchema,
  dispute: disputeSchema,
  contract: contractSchema,
  claimDetails: claimDetailsSchema
});

export const validateCase = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  try {
    await createCaseSchema.parseAsync(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid case data',
        details: error.errors 
      });
    }
    return res.status(400).json({ error: 'Invalid case data' });
  }
}; 