import connectDB from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import { ProductFilter, PaginatedProductResponse } from "@/types/product";

import mongoose from "mongoose";

/** Get paginated and filtered products with cursor & lightweight DTO projection */
export async function getProducts(filters: ProductFilter = {}): Promise<PaginatedProductResponse> {
  await connectDB();

  const {
    category,
    condition,
    status,
    minPrice,
    maxPrice,
    location,
    search,
    sortBy,
    sortOrder,
    isAdmin = false,
    page = 1,
    limit = 15,
    cursor,
  } = filters;

  const query: any = {};

  // Status Filter:
  // - If status provided: filter by those statuses.
  // - If not provided: for public site default to active, for admin show all.
  if (status) {
    const statusArr = typeof status === "string"
      ? status.split(",").map((s) => s.trim()).filter(Boolean)
      : (Array.isArray(status) ? status : [status]);
    if (statusArr.length > 0 && !statusArr.includes("all")) {
      query.status = { $in: statusArr };
    }
  } else if (!isAdmin) {
    query.status = "active";
  }

  if (category) {
    const catArr = typeof category === "string"
      ? category.split(",").map((c) => c.trim()).filter(Boolean)
      : (Array.isArray(category) ? category : [category]);
    if (catArr.length > 0) {
      query.category = { $in: catArr.map((c) => new RegExp(c, "i")) };
    }
  }

  if (condition) {
    const condArr = typeof condition === "string"
      ? condition.split(",").map((c) => c.trim()).filter(Boolean)
      : (Array.isArray(condition) ? condition : [condition]);
    if (condArr.length > 0) {
      query.condition = { $in: condArr.map((c) => new RegExp(c, "i")) };
    }
  }

  if (location) query.location = new RegExp(location, "i");

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  if (search && search.trim()) {
    const s = search.trim();
    const searchRegex = new RegExp(s, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { location: searchRegex },
      { contactName: searchRegex },
      { contactPhone: searchRegex },
    ];
  }

  // Sorting
  let sortObj: any = {};
  if (sortBy) {
    const isAsc = sortOrder === "asc" || sortOrder === true || sortOrder === "true";
    sortObj[sortBy] = isAsc ? 1 : -1;
    if (sortBy !== "_id") {
      sortObj._id = -1;
    }
  } else {
    sortObj = { isFeatured: -1, createdAt: -1, _id: -1 };
  }

  // Cursor pagination filter
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const skip = (page - 1) * limit;

  // Count total matching documents
  const totalCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const productsRaw = await Product.find(query)
    .select("_id title slug price images category condition location contactName contactPhone description isFeatured views status createdAt updatedAt")
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  const hasMore = page * limit < totalCount;
  const nextCursor = hasMore && productsRaw.length > 0 ? (productsRaw[productsRaw.length - 1]._id as any).toString() : null;
  const nextPage = hasMore ? page + 1 : null;

  return {
    products: JSON.parse(JSON.stringify(productsRaw)),
    total: totalCount,
    count: totalCount,
    totalPages,
    page,
    limit,
    nextCursor,
    nextPage,
    hasMore,
  };
}

/** Get product by slug (or _id fallback) and optionally increment view count */
export async function getProductBySlug(slug: string, incViews: boolean = false) {
  await connectDB();
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  const filter = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

  const query = incViews
    ? Product.findOneAndUpdate(filter, { $inc: { views: 1 } }, { returnDocument: "after" })
    : Product.findOne(filter);

  const product = await query.lean();
  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

/** Get product by ID */
export async function getProductById(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

/** Get all products for admin (shows active/sold/inactive) */
export async function getAllProductsAdmin() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

/** Create product */
export async function createProduct(data: Partial<IProduct>) {
  await connectDB();
  const product = await Product.create(data);
  return JSON.parse(JSON.stringify(product));
}

/** Update product */
export async function updateProduct(id: string, data: Partial<IProduct>) {
  await connectDB();
  const product = await Product.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

/** Delete product */
export async function deleteProduct(id: string) {
  await connectDB();
  const product = await Product.findByIdAndDelete(id).lean();
  return !!product;
}
