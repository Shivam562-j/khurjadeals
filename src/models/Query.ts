import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuery extends Document {
  name:         string;
  phone:        string;
  email?:       string;
  type:         "property" | "product" | "general";
  message:      string;
  status:       "pending" | "contacted" | "resolved" | "closed";
  referenceId?: string;
  createdAt:    Date;
  updatedAt:    Date;
}

const QuerySchema = new Schema<IQuery>(
  {
    name:        { type: String, required: true, trim: true },
    phone:       { type: String, required: true },
    email:       { type: String, default: "" },
    type:        { type: String, enum: ["property", "product", "general"], default: "general" },
    message:     { type: String, required: true },
    status:      { type: String, enum: ["pending", "contacted", "resolved", "closed"], default: "pending" },
    referenceId: { type: String, default: null },
  },
  { timestamps: true }
);

QuerySchema.index({ status: 1, createdAt: -1 });

const Query: Model<IQuery> =
  mongoose.models.Query || mongoose.model<IQuery>("Query", QuerySchema);

export default Query;
