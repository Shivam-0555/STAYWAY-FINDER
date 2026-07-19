import { Schema, model, models, Document, Types } from 'mongoose';

export interface IHostelOwner extends Document {
  user: Types.ObjectId; // reference to User
  phone?: string;
  address?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HostelOwnerSchema = new Schema<IHostelOwner>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.HostelOwner || model<IHostelOwner>('HostelOwner', HostelOwnerSchema);
