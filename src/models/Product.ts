import mongoose, { Schema, Document, Model } from "mongoose";
import { deleteImagesByUrls } from "@/lib/cloudinary";

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

// Clean up Cloudinary images when a single product is deleted via findOneAndDelete / findByIdAndDelete
ProductSchema.post("findOneAndDelete", async function (doc) {
  if (doc && Array.isArray(doc.images) && doc.images.length > 0) {
    try {
      await deleteImagesByUrls(doc.images);
    } catch (error) {
      console.error("Cloudinary cleanup error on Product findOneAndDelete:", error);
    }
  }
});

// Clean up Cloudinary images when a product document is deleted via doc.deleteOne()
ProductSchema.post("deleteOne", { document: true, query: false }, async function (doc: any) {
  const images = doc?.images || (this as any)?.images;
  if (Array.isArray(images) && images.length > 0) {
    try {
      await deleteImagesByUrls(images);
    } catch (error) {
      console.error("Cloudinary cleanup error on Product deleteOne:", error);
    }
  }
});

// Clean up Cloudinary images when products are deleted in bulk via Product.deleteMany(...)
ProductSchema.pre("deleteMany", async function () {
  try {
    const filter = this.getFilter();
    const docs = await this.model.find(filter).select("images").lean();
    const allImages = docs.flatMap((d: any) => (Array.isArray(d.images) ? d.images : []));
    if (allImages.length > 0) {
      await deleteImagesByUrls(allImages);
    }
  } catch (error) {
    console.error("Cloudinary cleanup error on Product deleteMany:", error);
  }
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
