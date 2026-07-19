import { Schema, model, models, Document, Types } from 'mongoose';

export interface ISavedPlace extends Document {
  student: Types.ObjectId;
  hostel: Types.ObjectId;
  savedAt: Date;
}

const SavedPlaceSchema = new Schema<ISavedPlace>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hostel: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
    savedAt: { type: Date, default: Date.now },
  }
);

export default models.SavedPlace || model<ISavedPlace>('SavedPlace', SavedPlaceSchema);
