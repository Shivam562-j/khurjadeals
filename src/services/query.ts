import connectDB from "@/lib/mongodb";
import Query, { IQuery } from "@/models/Query";
import { QueryFilter, QueryStatus, PaginatedQueryResponse } from "@/types/query";

/** Get single query by ID */
export async function getQueryById(id: string) {
  await connectDB();
  const query = await Query.findById(id).lean();
  if (!query) return null;
  return JSON.parse(JSON.stringify(query));
}

/** Get queries with backend pagination, search, filter, and dynamic sorting */
export async function getQueries(
  options?: QueryFilter | QueryStatus
): Promise<PaginatedQueryResponse | any[]> {
  await connectDB();

  // Backward compatibility if called with just status string
  if (typeof options === "string") {
    const filter: any = {};
    if (options) filter.status = options;
    const queries = await Query.find(filter).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(queries));
  }

  const {
    type,
    status,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = options || {};

  const query: any = {};

  // Status filter (support single or comma-separated / array)
  if (status) {
    if (Array.isArray(status)) {
      query.status = { $in: status };
    } else if (typeof status === "string" && status.includes(",")) {
      query.status = { $in: status.split(",").map((s) => s.trim()) };
    } else {
      query.status = status;
    }
  }

  // Type filter (support single or comma-separated / array)
  if (type) {
    if (Array.isArray(type)) {
      query.type = { $in: type };
    } else if (typeof type === "string" && type.includes(",")) {
      query.type = { $in: type.split(",").map((t) => t.trim()) };
    } else {
      query.type = type;
    }
  }

  // Search filter
  if (search && typeof search === "string" && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    query.$or = [
      { name: regex },
      { phone: regex },
      { email: regex },
      { message: regex },
    ];
  }

  // Sort direction
  const isAsc = sortOrder === "asc" || sortOrder === true || sortOrder === "true";
  const direction = isAsc ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortBy]: direction };

  // Always secondary sort by createdAt desc for consistency
  if (sortBy !== "createdAt") {
    sortOptions.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  const [queries, total] = await Promise.all([
    Query.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    Query.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    queries: JSON.parse(JSON.stringify(queries)),
    total,
    count: total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  };
}

/** Create query (public enquiry form or admin manual entry) */
export async function createQuery(data: Partial<IQuery>) {
  await connectDB();
  const query = await Query.create(data);
  return JSON.parse(JSON.stringify(query));
}

/** Update query status (admin management) */
export async function updateQueryStatus(id: string, status: QueryStatus) {
  await connectDB();
  const query = await Query.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after" }
  ).lean();
  if (!query) return null;
  return JSON.parse(JSON.stringify(query));
}

/** Update entire query (admin edit) */
export async function updateQuery(id: string, data: Partial<IQuery>) {
  await connectDB();
  const query = await Query.findByIdAndUpdate(
    id,
    { $set: data },
    { returnDocument: "after" }
  ).lean();
  if (!query) return null;
  return JSON.parse(JSON.stringify(query));
}

/** Delete query */
export async function deleteQuery(id: string) {
  await connectDB();
  const query = await Query.findByIdAndDelete(id).lean();
  return !!query;
}
