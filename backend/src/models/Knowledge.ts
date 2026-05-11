import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledge extends Document {
  businessId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: 'faq' | 'procedure' | 'pricing' | 'general';
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeSchema: Schema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['faq', 'procedure', 'pricing', 'general'],
    default: 'general' 
  },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IKnowledge>('Knowledge', KnowledgeSchema);
