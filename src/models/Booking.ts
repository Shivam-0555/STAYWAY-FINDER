import { Schema, model, models, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  hostel: Types.ObjectId;
  student: Types.ObjectId;
  visitDate: Date;
  status: 'requested' | 'accepted' | 'rejected' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    visitDate: { type: Date, required: true },
    status: { type: String, enum: ['requested', 'accepted', 'rejected', 'canceled'], default: 'requested' },
  },
  { timestamps: true }
);

export default models.Booking || model<IBooking>('Booking', BookingSchema);
