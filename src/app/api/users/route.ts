import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUsers, createUser } from "@/services/user";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const user = await createUser(body);
    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
