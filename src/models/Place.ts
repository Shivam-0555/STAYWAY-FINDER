import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview {
  user: string;
  comment: string;
  rating: number;
}

export interface IPlace extends Document {
  name: string;
  category: "hostel" | "food" | "bus" | "atm" | "clinic" | "safe-route" | "emergency";
  lat: number;
  lng: number;
  budget?: number;
  rating?: number;
  address: string;
  description?: string;
  reviews?: IReview[];
}

const ReviewSchema = new Schema<IReview>({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const PlaceSchema = new Schema<IPlace>({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["hostel", "food", "bus", "atm", "clinic", "safe-route", "emergency"]
  },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  budget: { type: Number },
  rating: { type: Number },
  address: { type: String, required: true },
  description: { type: String },
  reviews: [ReviewSchema],
});

export const Place: Model<IPlace> = mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);
