import { z } from 'zod';
import { CaseStatus } from '../models/types';

const caseSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  claimAmount: z.number()
    .positive('Claim amount must be positive')
    .max(1000000000, 'Claim amount cannot exceed 1 billion'),
  arbitrationRank: z.number()
    .min(0, 'Arbitration rank must be between 0 and 0.90')
    .max(0.90, 'Arbitration rank must be between 0 and 0.90'),
  contractDate: z.string()
    .datetime()
    .optional(),
  respondentId: z.string()
    .min(1, 'Respondent ID is required')
    .optional(),
  arbitratorId: z.string()
    .min(1, 'Arbitrator ID is required')
    .optional(),
  documents: z.array(z.string()).optional(),
  status: z.nativeEnum(CaseStatus).optional()
});

export const validateCase = (data: unknown) => {
  try {
    const result = caseSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
};

export const validateCaseUpdate = (data: unknown) => {
  try {
    const result = caseSchema.partial().parse(data);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, errors: error.errors };
  }
}; 