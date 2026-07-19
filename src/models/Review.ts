import { Schema, model, models, Document, Types } from 'mongoose';

export interface IReview extends Document {
  hostel: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

export default models.Review || model<IReview>('Review', ReviewSchema);
