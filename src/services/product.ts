import connectDB from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import { ProductFilter, PaginatedProductResponse } from "@/types/product";

/** Get paginated and filtered products with cursor & lightweight DTO projection */
export async function getProducts(filters: ProductFilter = {}): Promise<PaginatedProductResponse> {
  await connectDB();

  const {
    category,
    condition,
    minPrice,
    maxPrice,
    location,
    search,
    page = 1,
    limit = 15,
    cursor,
  } = filters;

  const query: any = { status: "active" };

  if (category) {
    const catArr = typeof category === "string" ? category.split(",").map((c) => c.trim()).filter(Boolean) : (Array.isArray(category) ? category : [category]);
    if (catArr.length > 0) {
      query.category = { $in: catArr.map((c) => new RegExp(c, "i")) };
    }
  }

  if (condition) {
    const condArr = typeof condition === "string" ? condition.split(",").map((c) => c.trim()).filter(Boolean) : (Array.isArray(condition) ? condition : [condition]);
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

  if (search) {
    query.$or = [
      { title: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { category: new RegExp(search, "i") },
      { location: new RegExp(search, "i") },
    ];
  }

  // Cursor pagination filter
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const skip = (page - 1) * limit;
  const fetchLimit = limit + 1; // Fetch 1 extra item to check if hasMore exists without countDocuments

  const productsRaw = await Product.find(query)
    .select("_id title slug price images category condition location isFeatured views status createdAt")
    .sort({ isFeatured: -1, createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(fetchLimit)
    .lean();

  const hasMore = productsRaw.length > limit;
  const products = hasMore ? productsRaw.slice(0, limit) : productsRaw;
  const nextCursor = hasMore && products.length > 0 ? (products[products.length - 1]._id as any).toString() : null;
  const nextPage = hasMore ? page + 1 : null;

  return {
    products: JSON.parse(JSON.stringify(products)),
    page,
    limit,
    nextCursor,
    nextPage,
    hasMore,
  };
}

/** Get product by slug and optionally increment view count */
export async function getProductBySlug(slug: string, incViews: boolean = false) {
  await connectDB();
  const query = incViews
    ? Product.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { returnDocument: "after" })
    : Product.findOne({ slug });

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
