import { Schema, model, models, Document, Types } from 'mongoose';

export interface IEmergencyService extends Document {
  city: Types.ObjectId;
  type: 'hospital' | 'police' | 'fire';
  name: string;
  phone: string;
  location?: {
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyServiceSchema = new Schema<IEmergencyService>(
  {
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    type: { type: String, enum: ['hospital', 'police', 'fire'], required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
  },
  { timestamps: true }
);

export default models.EmergencyService || model<IEmergencyService>('EmergencyService', EmergencyServiceSchema);
