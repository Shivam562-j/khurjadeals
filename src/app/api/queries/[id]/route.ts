import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateQueryStatus, deleteQuery } from "@/services/query";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const query = await updateQueryStatus(id, status);
    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, query });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update query" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteQuery(id);
    if (!success) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Query deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete query" },
      { status: 500 }
    );
  }
}
