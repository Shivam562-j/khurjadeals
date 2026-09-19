import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User";
import { UserFilter, PaginatedUserResponse } from "@/types/user";

/** Get single user by ID */
export async function getUserById(id: string) {
  await connectDB();
  const user = await User.findById(id).lean();
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}

/** Get all admin/moderator users with pagination, filtering, searching, and sorting */
export async function getUsers(
  options?: UserFilter
): Promise<PaginatedUserResponse | any[]> {
  await connectDB();

  if (!options) {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(users));
  }

  const {
    role,
    status,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = options;

  const query: any = {};

  // Role filter
  if (role) {
    if (Array.isArray(role)) {
      query.role = { $in: role };
    } else if (typeof role === "string" && role.includes(",")) {
      query.role = { $in: role.split(",").map((r) => r.trim()) };
    } else {
      query.role = role;
    }
  }

  // Status filter
  if (status) {
    if (Array.isArray(status)) {
      query.status = { $in: status };
    } else if (typeof status === "string" && status.includes(",")) {
      query.status = { $in: status.split(",").map((s) => s.trim()) };
    } else {
      query.status = status;
    }
  }

  // Search filter (name or email)
  if (search && typeof search === "string" && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    query.$or = [{ name: regex }, { email: regex }];
  }

  // Sort direction
  const isAsc = sortOrder === "asc" || sortOrder === true || sortOrder === "true";
  const direction = isAsc ? 1 : -1;
  const sortOptions: Record<string, 1 | -1> = { [sortBy]: direction };

  if (sortBy !== "createdAt") {
    sortOptions.createdAt = -1;
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    users: JSON.parse(JSON.stringify(users)),
    total,
    count: total,
    page,
    limit,
    totalPages,
    hasMore: page < totalPages,
  };
}

/** Create a new admin or moderator */
export async function createUser(data: Partial<IUser>) {
  await connectDB();
  const user = await User.create(data);
  return JSON.parse(JSON.stringify(user));
}

/** Update user (role, status, name, etc.) */
export async function updateUser(id: string, data: Partial<IUser>) {
  await connectDB();

  // If password is being updated, we retrieve the mongoose document to trigger pre-save hook
  if (data.password) {
    const doc = await User.findById(id);
    if (!doc) return null;
    doc.name = data.name || doc.name;
    doc.email = data.email || doc.email;
    doc.password = data.password;
    if (data.role) doc.role = data.role;
    if (data.status) doc.status = data.status;
    await doc.save();
    return JSON.parse(JSON.stringify(doc.toObject()));
  }

  const user = await User.findByIdAndUpdate(id, data, { returnDocument: "after" }).lean();
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}

/** Delete user */
export async function deleteUser(id: string) {
  await connectDB();
  const user = await User.findByIdAndDelete(id).lean();
  return !!user;
}

/** Validate login credentials */
export async function validateCredentials(email: string, passwordString: string) {
  await connectDB();

  // We explicitly select +password because it is excluded by default in schema definition
  const user = await User.findOne({ email, status: "active" }).select("+password");
  if (!user) return null;

  const isMatch = await user.comparePassword(passwordString);
  if (!isMatch) return null;

  // return profile object without password field
  const profileObj = user.toObject();
  const { password, ...profileWithoutPassword } = profileObj;

  return JSON.parse(JSON.stringify(profileWithoutPassword));
}
