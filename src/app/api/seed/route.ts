import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { seedDatabase } from "@/lib/seed";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    await seedDatabase(force);

    const userCount = await User.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Admin seed verified.",
      userCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
