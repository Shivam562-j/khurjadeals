import connectDB from "@/lib/mongodb";
import Property, { IProperty } from "@/models/Property";
import { PropertyFilter, PaginatedPropertyResponse } from "@/types/property";

/** Get paginated and filtered properties with cursor & lightweight DTO projection */
export async function getProperties(filters: PropertyFilter = {}): Promise<PaginatedPropertyResponse> {
  await connectDB();

  const {
    type,
    listingType,
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
  // If status is provided, filter by specified status(es).
  // If status is not provided:
  // - For public website (isAdmin === false): default to active properties only.
  // - For admin (isAdmin === true): show all statuses.
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

  // Type Filter
  if (type) {
    const typesArr = typeof type === "string"
      ? type.split(",").map((t) => t.trim()).filter(Boolean)
      : (Array.isArray(type) ? type : [type]);
    if (typesArr.length > 0) {
      query.type = { $in: typesArr };
    }
  }

  // Listing Purpose Filter
  if (listingType) {
    const listingArr = typeof listingType === "string"
      ? listingType.split(",").map((l) => l.trim()).filter(Boolean)
      : (Array.isArray(listingType) ? listingType : [listingType]);
    if (listingArr.length > 0) {
      query.listingType = { $in: listingArr };
    }
  }

  // Location Filter
  if (location) query.location = new RegExp(location, "i");

  // Min / Max Price Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  // Search keyword across title, description, location, contactName, contactPhone
  if (search && search.trim()) {
    const s = search.trim();
    const searchRegex = new RegExp(s, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
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

  // Cursor pagination filter for infinite scrolling
  if (cursor) {
    query._id = { $lt: cursor };
  }

  const skip = (page - 1) * limit;

  // Count total documents matching query
  const totalCount = await Property.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const propertiesRaw = await Property.find(query)
    .select("_id title slug price area areaUnit images type listingType location address features isFeatured views status contactName contactPhone createdAt updatedAt")
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  const hasMore = page * limit < totalCount;
  const nextCursor = hasMore && propertiesRaw.length > 0 ? (propertiesRaw[propertiesRaw.length - 1]._id as any).toString() : null;
  const nextPage = hasMore ? page + 1 : null;

  return {
    properties: JSON.parse(JSON.stringify(propertiesRaw)),
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

import mongoose from "mongoose";

/** Get property by slug (or _id fallback) and optionally increment view count */
export async function getPropertyBySlug(slug: string, incViews: boolean = false) {
  await connectDB();
  const isObjectId = mongoose.Types.ObjectId.isValid(slug);
  const filter = isObjectId ? { $or: [{ slug }, { _id: slug }] } : { slug };

  const query = incViews
    ? Property.findOneAndUpdate(filter, { $inc: { views: 1 } }, { returnDocument: "after" })
    : Property.findOne(filter);

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
