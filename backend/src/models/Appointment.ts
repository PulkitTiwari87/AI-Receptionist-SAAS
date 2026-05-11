import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  businessId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  date: Date;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema({
  businessId: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  type: { type: String, default: 'General Consultation' },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled' 
  },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
