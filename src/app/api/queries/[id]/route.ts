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
    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Update data is required" }, { status: 400 });
    }

    const { updateQuery } = await import("@/services/query");
    const query = await updateQuery(id, body);
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
