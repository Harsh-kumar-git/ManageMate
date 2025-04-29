import mongoose, { Document } from 'mongoose';

export interface IClient extends Document {
  name: string;
  company_name?: string;
  email: string;
  phone?: string;
  billing_address?: string;
  shipping_address?: string;
  gst_number?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company_name: { type: String, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  phone: { type: String, trim: true },
  billing_address: { type: String, trim: true },
  shipping_address: { type: String, trim: true },
  gst_number: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model<IClient>('Client', clientSchema);
