import { NextResponse } from "next/server";
import { getApprovedReviews, createReview, getAllReviews } from "@/services/review";
import { getSession } from "@/lib/auth";

// Public GET - only returns approved reviews
// Admin GET (with ?all=true + session) - returns all reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      const reviews = await getAllReviews();
      return NextResponse.json(reviews);
    }

    const reviews = await getApprovedReviews();
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// Public POST - submit a new review (goes to pending)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.message || !body.rating) {
      return NextResponse.json(
        { message: "Name, rating, and message are required" },
        { status: 400 }
      );
    }

    const rating = Number(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const review = await createReview({
      name: String(body.name).trim(),
      location: body.location ? String(body.location).trim() : "Khurja",
      rating,
      category: body.category || "general",
      message: String(body.message).trim(),
      status: "pending",
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}
