import { Schema, model, models, Document, Types } from 'mongoose';

export interface IHostel extends Document {
  owner: Types.ObjectId;
  name: string;
  description: string;
  address: string;
  city: Types.ObjectId;
  images: string[];
  rooms: {
    type: string;
    capacity: number;
    pricePerMonth: number;
    available: number;
  }[];
  pricePerNight?: number;
  amenities: string[];
  location?: {
    type: string;
    coordinates: number[]; // [lng, lat]
  };
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const HostelSchema = new Schema<IHostel>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    images: [{ type: String }],
    rooms: [
      {
        type: { type: String }, // e.g., '1 Seater', '2 Seater'
        capacity: { type: Number },
        pricePerMonth: { type: Number },
        available: { type: Number },
      },
    ],
    pricePerNight: { type: Number },
    amenities: [{ type: String }],
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Hostel || model<IHostel>('Hostel', HostelSchema);
