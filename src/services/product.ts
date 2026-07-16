import connectDB from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import { ProductFilter } from "@/types/product";

/** Get paginated and filtered products */
export async function getProducts(filters: ProductFilter = {}) {
  await connectDB();

  const {
    category,
    condition,
    minPrice,
    maxPrice,
    location,
    search,
    page = 1,
    limit = 12,
  } = filters;

  const query: any = { status: "active" };

  if (category) query.category = category;
  if (condition) query.condition = condition;
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

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/** Get product by slug and optionally increment view count */
export async function getProductBySlug(slug: string, incViews: boolean = false) {
  await connectDB();
  const query = incViews
    ? Product.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
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
  const product = await Product.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

/** Delete product */
export async function deleteProduct(id: string) {
  await connectDB();
  const product = await Product.findByIdAndDelete(id).lean();
  return !!product;
}
