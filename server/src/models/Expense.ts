import mongoose, { Document } from 'mongoose';

export interface IExpense extends Document {
  expense_number: string;
  vendor: string;
  date: Date;
  category: string;
  amount: number;
  notes?: string;
  status: 'pending' | 'approved' | 'reimbursed';
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new mongoose.Schema({
  expense_number: { type: String, required: true, trim: true, unique: true },
  vendor: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  category: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'reimbursed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<IExpense>('Expense', expenseSchema);
