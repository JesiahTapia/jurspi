import mongoose from 'mongoose';
import { DocumentType, DocumentId, CaseId, UserId } from './types';

export interface IDocument {
  documentId: DocumentId;
  caseId: CaseId;
  uploadedBy: UserId;
  type: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new mongoose.Schema<IDocument>({
  documentId: { type: String, required: true, unique: true },
  caseId: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(DocumentType),
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  version: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  metadata: { type: Map, of: mongoose.Schema.Types.Mixed }
}, {
  timestamps: true
});

// Add indexes for common queries
DocumentSchema.index({ documentId: 1 }, { unique: true });
DocumentSchema.index({ caseId: 1, type: 1 });
DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ isActive: 1 });
DocumentSchema.index({ version: 1 });

export const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema); 