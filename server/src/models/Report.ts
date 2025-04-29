import mongoose, { Document } from 'mongoose';

export interface IReport extends Document {
  type: string;
  date_from: Date;
  date_to: Date;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  date_from: { type: Date, required: true },
  date_to: { type: Date, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

export default mongoose.model<IReport>('Report', reportSchema);
