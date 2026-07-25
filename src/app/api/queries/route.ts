import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getQueries, createQuery } from "@/services/query";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;

    const queries = await getQueries(status as any);
    return NextResponse.json(queries);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch queries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.phone) {
      return NextResponse.json(
        { message: "Name and phone number are required" },
        { status: 400 }
      );
    }

    // Map sub-types to valid enum ["property", "product", "general"]
    let validEnum: "property" | "product" | "general" = "general";
    const rawType = String(body.type || "").toLowerCase();

    if (rawType.includes("property")) {
      validEnum = "property";
    } else if (rawType.includes("product") || rawType.includes("appliance") || rawType.includes("vehicle")) {
      validEnum = "product";
    }

    const locationText = body.location ? ` [Location: ${body.location}]` : "";
    const typeLabel = body.type ? ` [Type: ${body.type}]` : "";
    const rawMessage = body.message && String(body.message).trim() ? String(body.message).trim() : "Ad Listing Submission Inquiry";
    const fullMessage = `${rawMessage}${locationText}${typeLabel}`;

    const queryData: any = {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: body.email ? String(body.email).trim() : "",
      type: validEnum,
      message: fullMessage,
    };

    if (body.referenceId) {
      queryData.referenceId = String(body.referenceId);
    }

    const query = await createQuery(queryData);

    return NextResponse.json({ success: true, query }, { status: 201 });
  } catch (error: any) {
    console.error("Query submission error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to submit query" },
      { status: 500 }
    );
  }
}
