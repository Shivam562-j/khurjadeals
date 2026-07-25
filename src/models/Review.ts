import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  name: string;
  location: string;
  rating: number; // 1-5
  category: "property" | "product" | "general";
  message: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    name:     { type: String, required: true, trim: true },
    location: { type: String, default: "Khurja" },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, enum: ["property", "product", "general"], default: "general" },
    message:  { type: String, required: true, trim: true },
    status:   { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

ReviewSchema.index({ status: 1, createdAt: -1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
