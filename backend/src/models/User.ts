import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'STAFF';
  businessId?: mongoose.Types.ObjectId; // Null for SUPER_ADMIN
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['SUPER_ADMIN', 'BUSINESS_OWNER', 'STAFF'],
    default: 'STAFF'
  },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: false }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
