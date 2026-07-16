import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProperty extends Document {
  title:        string;
  slug:         string;
  description:  string;
  type:         "residential" | "commercial" | "plot" | "agricultural";
  listingType:  "sell" | "rent" | "lease";
  status:       "active" | "sold" | "rented" | "inactive";
  price:        number;
  area:         number;
  areaUnit:     "sqft" | "sqyd" | "acre" | "bigha";
  location:     string;
  address:      string;
  images:       string[];
  features:     string[];
  contactName:  string;
  contactPhone: string;
  isFeatured:   boolean;
  views:        number;
  createdAt:    Date;
  updatedAt:    Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true },
    description:  { type: String, required: true },
    type:         { type: String, enum: ["residential", "commercial", "plot", "agricultural"], required: true },
    listingType:  { type: String, enum: ["sell", "rent", "lease"], required: true },
    status:       { type: String, enum: ["active", "sold", "rented", "inactive"], default: "active" },
    price:        { type: Number, required: true, min: 0 },
    area:         { type: Number, required: true, min: 0 },
    areaUnit:     { type: String, enum: ["sqft", "sqyd", "acre", "bigha"], default: "sqft" },
    location:     { type: String, required: true },
    address:      { type: String, default: "" },
    images:       [{ type: String }],
    features:     [{ type: String }],
    contactName:  { type: String, required: true },
    contactPhone: { type: String, required: true },
    isFeatured:   { type: Boolean, default: false },
    views:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

PropertySchema.index({ slug: 1 });
PropertySchema.index({ status: 1, isFeatured: -1, createdAt: -1 });

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
