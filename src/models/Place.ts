import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview {
  user: string;
  comment: string;
  rating: number;
}

export interface IPlace extends Document {
  name: string;
  category: "hostel" | "food" | "bus" | "atm" | "clinic" | "safe-route" | "emergency";
  city: string;
  lat: number;
  lng: number;
  budget?: number;
  rating?: number;
  address: string;
  description?: string;
  verified?: boolean;
  website?: string;
  phone?: string;
  imageUrl?: string;
  owner?: string;
  type?: string;
  reviews?: IReview[];
  // New Owner Portal Fields
  availableRooms?: number;
  totalRooms?: number;
  rent?: number;
  wifi?: boolean;
  laundry?: boolean;
  parking?: boolean;
  mess?: boolean;
  ac?: boolean;
  images?: string[];
  hostelType?: "boys" | "girls" | "coed";
  lastUpdated?: Date;
}

const ReviewSchema = new Schema<IReview>({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["hostel", "food", "bus", "atm", "clinic", "safe-route", "emergency"],
    },
    city: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    budget: { type: Number },
    rating: { type: Number },
    address: { type: String, required: true },
    description: { type: String },
    verified: { type: Boolean, default: false },
    website: { type: String },
    phone: { type: String },
    imageUrl: { type: String },
    owner: { type: String },
    type: { type: String },
    reviews: [ReviewSchema],
    // New fields
    availableRooms: { type: Number },
    totalRooms: { type: Number },
    rent: { type: Number },
    wifi: { type: Boolean },
    laundry: { type: Boolean },
    parking: { type: Boolean },
    mess: { type: Boolean },
    ac: { type: Boolean },
    images: [{ type: String }],
    hostelType: { type: String, enum: ["boys", "girls", "coed"] },
    lastUpdated: { type: Date, default: Date.now },
  },
  // strict:false allows category-specific extra fields (amenities, medicalServices,
  // popularDishes, cashWithdrawal, stationType, etc.) to be stored without
  // needing explicit schema declarations for each one.
  { strict: false }
);

// Indexes for fast search
PlaceSchema.index({ name: "text", address: "text", description: "text" });
PlaceSchema.index({ category: 1 });
PlaceSchema.index({ city: 1 });

export const Place: Model<IPlace> =
  mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);
