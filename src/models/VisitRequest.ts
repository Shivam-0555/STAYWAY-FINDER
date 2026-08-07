import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVisitRequest extends Document {
  hostelId: mongoose.Types.ObjectId;
  hostelName: string;
  studentName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  message?: string;
  status: "Pending" | "Accepted" | "Rejected" | "Rescheduled" | "Completed" | "Checked In";
  ownerId?: mongoose.Types.ObjectId;
  checkInTime?: Date;
  completedTime?: Date;
  passId: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitRequestSchema = new Schema<IVisitRequest>(
  {
    hostelId: { type: Schema.Types.ObjectId, ref: "Place", required: true },
    hostelName: { type: String, required: true },
    studentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Rescheduled", "Completed", "Checked In"],
      default: "Pending",
    },
    ownerId: { type: Schema.Types.ObjectId },
    checkInTime: { type: Date },
    completedTime: { type: Date },
    passId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const VisitRequest: Model<IVisitRequest> =
  mongoose.models.VisitRequest || mongoose.model<IVisitRequest>("VisitRequest", VisitRequestSchema);
