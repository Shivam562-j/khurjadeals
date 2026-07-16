import connectDB from "@/lib/mongodb";
import Query, { IQuery } from "@/models/Query";
import { QueryStatus } from "@/types/query";

/** Get queries by status (or all if status not provided) */
export async function getQueries(status?: QueryStatus) {
  await connectDB();
  const filter: any = {};
  if (status) filter.status = status;

  const queries = await Query.find(filter).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(queries));
}

/** Create query (public enquiry form) */
export async function createQuery(data: Partial<IQuery>) {
  await connectDB();
  const query = await Query.create(data);
  return JSON.parse(JSON.stringify(query));
}

/** Update query status (admin management) */
export async function updateQueryStatus(id: string, status: QueryStatus) {
  await connectDB();
  const query = await Query.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!query) return null;
  return JSON.parse(JSON.stringify(query));
}

/** Delete query */
export async function deleteQuery(id: string) {
  await connectDB();
  const query = await Query.findByIdAndDelete(id).lean();
  return !!query;
}
