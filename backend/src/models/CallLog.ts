import mongoose, { Schema, Document } from 'mongoose';

export interface ICallLog extends Document {
  businessId: mongoose.Types.ObjectId;
  customerPhone: string;
  customerName?: string;
  duration: number; // in seconds
  status: 'completed' | 'missed' | 'transferred' | 'voicemail';
  transcript?: string;
  summary?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  recordingUrl?: string;
  actionTaken?: string;
  createdAt: Date;
}

const CallLogSchema: Schema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  customerPhone: { type: String, required: true },
  customerName: { type: String },
  duration: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['completed', 'missed', 'transferred', 'voicemail'],
    default: 'completed' 
  },
  transcript: { type: String },
  summary: { type: String },
  sentiment: { 
    type: String, 
    enum: ['positive', 'neutral', 'negative'],
    default: 'neutral'
  },
  recordingUrl: { type: String },
  actionTaken: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<ICallLog>('CallLog', CallLogSchema);
