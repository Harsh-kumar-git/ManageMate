import mongoose, { Document } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  lastRestocked: Date;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  createdAt: Date;
  updatedAt: Date;
}

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, trim: true, unique: true },
  category: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  reorderPoint: { type: Number, required: true },
  lastRestocked: { type: Date, required: true },
  status: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'], required: true },
}, { timestamps: true });

export default mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);
