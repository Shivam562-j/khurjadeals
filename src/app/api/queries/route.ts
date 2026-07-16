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

    if (!body.name || !body.phone || !body.message) {
      return NextResponse.json(
        { message: "Name, phone, and message are required" },
        { status: 400 }
      );
    }

    const query = await createQuery({
      name: body.name,
      phone: body.phone,
      email: body.email || "",
      type: body.type || "general",
      message: body.message,
      referenceId: body.referenceId || null,
    });

    return NextResponse.json({ success: true, query }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to submit query" },
      { status: 500 }
    );
  }
}
