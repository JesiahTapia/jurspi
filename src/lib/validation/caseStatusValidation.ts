import { z } from 'zod';
import { CaseStatus } from '../models/types';

const statusValidationRules: Record<CaseStatus, z.ZodObject<any>> = {
  [CaseStatus.DRAFT]: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(2000),
    claimAmount: z.number().positive(),
    arbitrationRank: z.number().min(0).max(0.90)
  }),

  [CaseStatus.FILED]: z.object({
    respondentId: z.string().min(1),
    documents: z.array(z.string()).min(1)
  }),

  [CaseStatus.PENDING_RESPONSE]: z.object({
    respondentId: z.string().min(1)
  }),

  [CaseStatus.ARBITRATOR_ASSIGNED]: z.object({
    arbitratorId: z.string().min(1)
  })
};

export const validateStatusRequirements = (
  status: CaseStatus,
  caseData: any
): { valid: boolean; errors?: string[] } => {
  const validationSchema = statusValidationRules[status];
  if (!validationSchema) {
    return { valid: true };
  }

  try {
    validationSchema.parse(caseData);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      errors: error.errors.map((e: any) => e.message)
    };
  }
}; 