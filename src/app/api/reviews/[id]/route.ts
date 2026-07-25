import { NextResponse } from "next/server";
import { updateReviewStatus, deleteReview } from "@/services/review";
import { getSession } from "@/lib/auth";

// PATCH /api/reviews/[id] - update status (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const review = await updateReviewStatus(params.id, status);
    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[id] - delete review (admin only)
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await deleteReview(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete review" },
      { status: 500 }
    );
  }
}
