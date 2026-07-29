import connectDB from "@/lib/mongodb";
import Property, { IProperty } from "@/models/Property";
import { PropertyFilter } from "@/types/property";

/** Get paginated and filtered properties */
export async function getProperties(filters: PropertyFilter = {}) {
  await connectDB();

  const {
    type,
    listingType,
    minPrice,
    maxPrice,
    location,
    search,
    page = 1,
    limit = 12,
  } = filters;

  const query: any = { status: "active" };

  if (type) {
    const typesArr = typeof type === "string" ? type.split(",").map((t) => t.trim()).filter(Boolean) : (Array.isArray(type) ? type : [type]);
    if (typesArr.length > 0) {
      query.type = { $in: typesArr };
    }
  }

  if (listingType) {
    const listingArr = typeof listingType === "string" ? listingType.split(",").map((l) => l.trim()).filter(Boolean) : (Array.isArray(listingType) ? listingType : [listingType]);
    if (listingArr.length > 0) {
      query.listingType = { $in: listingArr };
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
      { location: new RegExp(search, "i") },
    ];
  }

  const skip = (page - 1) * limit;

  const [properties, total] = await Promise.all([
    Property.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Property.countDocuments(query),
  ]);

  return {
    properties: JSON.parse(JSON.stringify(properties)),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/** Get property by slug and optionally increment view count */
export async function getPropertyBySlug(slug: string, incViews: boolean = false) {
  await connectDB();
  const query = incViews
    ? Property.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { returnDocument: "after" })
    : Property.findOne({ slug });

  const property = await query.lean();
  if (!property) return null;

  return JSON.parse(JSON.stringify(property));
}

/** Get property by ID */
export async function getPropertyById(id: string) {
  await connectDB();
  const property = await Property.findById(id).lean();
  if (!property) return null;
  return JSON.parse(JSON.stringify(property));
}

/** Get all properties for admin dashboard (shows inactive/sold/rented too) */
export async function getAllPropertiesAdmin() {
  await connectDB();
  const properties = await Property.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(properties));
}

/** Create property */
export async function createProperty(data: Partial<IProperty>) {
  await connectDB();
  const property = await Property.create(data);
  return JSON.parse(JSON.stringify(property));
}

/** Update property */
export async function updateProperty(id: string, data: Partial<IProperty>) {
  await connectDB();
  const property = await Property.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
  if (!property) return null;
  return JSON.parse(JSON.stringify(property));
}

/** Delete property */
export async function deleteProperty(id: string) {
  await connectDB();
  const property = await Property.findByIdAndDelete(id).lean();
  return !!property;
}
