import connectDB from "@/lib/mongodb";
import Property, { IProperty } from "@/models/Property";
import { PropertyFilter, PaginatedPropertyResponse } from "@/types/property";

/** Get paginated and filtered properties with cursor & lightweight DTO projection */
export async function getProperties(filters: PropertyFilter = {}): Promise<PaginatedPropertyResponse> {
  await connectDB();

  const {
    type,
    listingType,
    minPrice,
    maxPrice,
    location,
    search,
    page = 1,
    limit = 15,
    cursor,
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

  // Cursor pagination filter
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const skip = (page - 1) * limit;
  const fetchLimit = limit + 1; // Fetch 1 extra item to check if hasMore exists without countDocuments

  const propertiesRaw = await Property.find(query)
    .select("_id title slug price area areaUnit images type listingType location address features isFeatured views status createdAt")
    .sort({ isFeatured: -1, createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(fetchLimit)
    .lean();

  const hasMore = propertiesRaw.length > limit;
  const properties = hasMore ? propertiesRaw.slice(0, limit) : propertiesRaw;
  const nextCursor = hasMore && properties.length > 0 ? (properties[properties.length - 1]._id as any).toString() : null;
  const nextPage = hasMore ? page + 1 : null;

  return {
    properties: JSON.parse(JSON.stringify(properties)),
    page,
    limit,
    nextCursor,
    nextPage,
    hasMore,
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
