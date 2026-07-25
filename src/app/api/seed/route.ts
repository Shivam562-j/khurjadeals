import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { seedDatabase } from "@/lib/seed";
import Property from "@/models/Property";
import Product from "@/models/Product";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    await seedDatabase(force);

    const propertyCount = await Property.countDocuments();
    const productCount = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Database successfully seeded!",
      propertyCount,
      productCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
