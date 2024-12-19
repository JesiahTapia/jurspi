import mongoose from 'mongoose';
import { IDocument } from '../types/interfaces';

const documentSchema = new mongoose.Schema<IDocument>({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['CLAIM', 'RESPONSE', 'EVIDENCE', 'CONTRACT', 'OTHER'],
    required: true 
  },
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  metadata: {
    size: Number,
    mimeType: String,
    version: { type: Number, default: 1 }
  }
}, { timestamps: true });

documentSchema.index({ caseId: 1, type: 1 });
documentSchema.index({ uploadedAt: -1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ 'metadata.version': 1 });

export default mongoose.models.Document || mongoose.model<IDocument>('Document', documentSchema); 