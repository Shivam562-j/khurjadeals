import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title:        string;
  slug:         string;
  description:  string;
  category:     string;
  condition:    "new" | "used" | "refurbished";
  status:       "active" | "sold" | "inactive";
  price:        number;
  images:       string[];
  location:     string;
  contactName:  string;
  contactPhone: string;
  isFeatured:   boolean;
  views:        number;
  createdAt:    Date;
  updatedAt:    Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true },
    description:  { type: String, required: true },
    category:     { type: String, required: true },
    condition:    { type: String, enum: ["new", "used", "refurbished"], required: true },
    status:       { type: String, enum: ["active", "sold", "inactive"], default: "active" },
    price:        { type: Number, required: true, min: 0 },
    images:       [{ type: String }],
    location:     { type: String, required: true },
    contactName:  { type: String, required: true },
    contactPhone: { type: String, required: true },
    isFeatured:   { type: Boolean, default: false },
    views:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, condition: 1, status: 1, createdAt: -1 });
ProductSchema.index({ _id: -1, createdAt: -1 });
ProductSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
