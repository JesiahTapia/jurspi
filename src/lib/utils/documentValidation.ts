import { z } from 'zod';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

export const documentMetadataSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['EVIDENCE', 'CONTRACT', 'CLAIM', 'RESPONSE']),
  mimeType: z.string().refine(type => ALLOWED_FILE_TYPES.includes(type), {
    message: 'Invalid file type'
  }),
  size: z.number().max(MAX_FILE_SIZE, 'File too large')
});

export const isValidFileType = (mimeType: string) => ALLOWED_FILE_TYPES.includes(mimeType); 