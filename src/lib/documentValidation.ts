import { z } from 'zod';

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const documentMetadataSchema = z.object({
  originalName: z.string(),
  size: z.number().max(MAX_FILE_SIZE),
  mimeType: z.enum(ALLOWED_FILE_TYPES),
  version: z.number().default(1)
});

export const isValidFileType = (mimeType: string) => {
  return ALLOWED_FILE_TYPES.includes(mimeType as any);
}; 