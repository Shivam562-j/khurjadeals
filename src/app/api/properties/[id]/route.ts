import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPropertyById, updateProperty, deleteProperty } from "@/services/property";
import { toUniqueSlug } from "@/utils/slug";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);
    if (!property) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch property" },
      { status: 500 }
    );
  }
}

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

    const existing = await getPropertyById(id);
    if (!existing) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    // Regenerate slug if title changed and no new slug is provided
    if (body.title && body.title !== existing.title && !body.slug) {
      body.slug = toUniqueSlug(body.title);
    }

    const property = await updateProperty(id, body);
    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update property" },
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
    const success = await deleteProperty(id);
    if (!success) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Property deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete property" },
      { status: 500 }
    );
  }
}
