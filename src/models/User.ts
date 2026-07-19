import { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'owner' | 'admin';
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'owner', 'admin'], default: 'student' },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', UserSchema);
