import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProperties, createProperty } from "@/services/property";
import { toUniqueSlug } from "@/utils/slug";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || undefined;
    const listingType = searchParams.get("listingType") || undefined;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const location = searchParams.get("location") || undefined;
    const search = searchParams.get("search") || undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 15;
    const cursor = searchParams.get("cursor") || undefined;

    const data = await getProperties({
      type: type as any,
      listingType: listingType as any,
      minPrice,
      maxPrice,
      location,
      search,
      page,
      limit,
      cursor,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch properties" },
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
    if (!body.title || !body.price || !body.location || !body.contactName || !body.contactPhone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = toUniqueSlug(body.title);
    const propertyData = { ...body, slug };

    const property = await createProperty(propertyData);
    return NextResponse.json({ success: true, property }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create property" },
      { status: 500 }
    );
  }
}
