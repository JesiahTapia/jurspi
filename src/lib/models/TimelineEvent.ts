import mongoose from 'mongoose';
import { ITimelineEvent } from '../types/interfaces';

const timelineEventSchema = new mongoose.Schema<ITimelineEvent>({
  type: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case', required: true },
  relatedDocuments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
}, { timestamps: true });

timelineEventSchema.index({ caseId: 1, date: -1 });
timelineEventSchema.index({ type: 1, date: -1 });

export default mongoose.models.TimelineEvent || mongoose.model<ITimelineEvent>('TimelineEvent', timelineEventSchema); 