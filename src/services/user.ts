import connectDB from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

/** Get all admin/moderator users */
export async function getUsers() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(users));
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
