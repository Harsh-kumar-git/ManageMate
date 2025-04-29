import mongoose, { Document } from 'mongoose';

export interface ISale extends Document {
  invoice_number: string;
  client: mongoose.Types.ObjectId;
  date: Date;
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new mongoose.Schema({
  invoice_number: { type: String, required: true, trim: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  date: { type: Date, required: true },
  items: [
    {
      name: { type: String, required: true },
      sku: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      total: { type: Number, required: true },
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'cancelled'], default: 'draft' },
}, { timestamps: true });

export default mongoose.model<ISale>('Sale', saleSchema);
