import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProducts, createProduct } from "@/services/product";
import { toUniqueSlug } from "@/utils/slug";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || undefined;
    const condition = searchParams.get("condition") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const location = searchParams.get("location") || undefined;
    const search = searchParams.get("search") || searchParams.get("searchKey") || undefined;
    const status = searchParams.get("status") || undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = searchParams.get("sortOrder") || undefined;
    const isAdmin = searchParams.get("isAdmin") === "true";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : searchParams.get("size")
      ? Number(searchParams.get("size"))
      : 15;
    const cursor = searchParams.get("cursor") || undefined;

    const data = await getProducts({
      category,
      condition: condition as any,
      status: status as any,
      minPrice,
      maxPrice,
      location,
      search,
      sortBy,
      sortOrder,
      isAdmin,
      page,
      limit,
      cursor,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.title || !body.price || !body.category || !body.condition || !body.location || !body.contactName || !body.contactPhone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = toUniqueSlug(body.title);
    const productData = { ...body, slug };

    const product = await createProduct(productData);
    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isAll = searchParams.get("all") === "true";

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Body may be empty if query params used
    }

    if (isAll || body.all === true) {
      const { dropAllProducts } = await import("@/services/product");
      const result = await dropAllProducts();
      return NextResponse.json({
        success: true,
        message: `Successfully dropped all products and cleaned up ${result.deletedImages} attached Cloudinary images.`,
        ...result,
      });
    }

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      const { deleteProductsByIds } = await import("@/services/product");
      const deletedCount = await deleteProductsByIds(body.ids);
      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedCount} products and their attached Cloudinary images.`,
        deletedCount,
      });
    }

    return NextResponse.json(
      { message: "Specify 'ids' array or 'all: true' to delete products." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete products" },
      { status: 500 }
    );
  }
}

