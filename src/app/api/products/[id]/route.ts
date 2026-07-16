import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/services/product";
import { toUniqueSlug } from "@/utils/slug";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
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

    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Regenerate slug if title changed
    if (body.title && body.title !== existing.title && !body.slug) {
      body.slug = toUniqueSlug(body.title);
    }

    const product = await updateProduct(id, body);
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update product" },
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
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
