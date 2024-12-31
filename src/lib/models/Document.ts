import mongoose, { Schema } from 'mongoose';

export interface IDocument {
  documentId: string;
  caseId: string;
  title: string;
  type: 'EVIDENCE' | 'CONTRACT' | 'CLAIM' | 'RESPONSE';
  fileUrl: string;
  uploadedBy: string;
  version: number;
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  metadata: {
    originalName: string;
    s3Key: string;
  };
  archived?: boolean;
  archivedAt?: Date;
  archivedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  documentId: { type: String, required: true, unique: true },
  caseId: { type: String, required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['EVIDENCE', 'CONTRACT', 'CLAIM', 'RESPONSE']
  },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  version: { type: Number, default: 1 },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  metadata: {
    originalName: String,
    s3Key: String
  },
  archived: { type: Boolean, default: false },
  archivedAt: Date,
  archivedBy: String
}, { timestamps: true });

export const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema); 