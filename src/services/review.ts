import connectDB from "@/lib/mongodb";
import Review, { IReview } from "@/models/Review";

export async function getApprovedReviews() {
  await connectDB();
  return Review.find({ status: "approved" }).sort({ createdAt: -1 }).lean();
}

export async function getAllReviews() {
  await connectDB();
  return Review.find().sort({ createdAt: -1 }).lean();
}

export async function createReview(data: Partial<IReview>) {
  await connectDB();
  return Review.create(data);
}

export async function updateReviewStatus(id: string, status: "approved" | "rejected" | "pending") {
  await connectDB();
  return Review.findByIdAndUpdate(id, { status }, { new: true });
}

export async function deleteReview(id: string) {
  await connectDB();
  return Review.findByIdAndDelete(id);
}
