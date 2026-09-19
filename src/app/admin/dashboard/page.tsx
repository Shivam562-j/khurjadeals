import React from "react";
import Property from "@/models/Property";
import Product from "@/models/Product";
import Query from "@/models/Query";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import DashboardView from "@/components/admin/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connectDB();

  // Fetch counts & recent inquiries concurrently
  const [
    propertyCount,
    productCount,
    pendingQueryCount,
    totalQueryCount,
    userCount,
    recentQueriesRaw,
  ] = await Promise.all([
    Property.countDocuments(),
    Product.countDocuments(),
    Query.countDocuments({ status: "pending" }),
    Query.countDocuments(),
    User.countDocuments(),
    Query.find().sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  // Serialize Mongoose Lean Documents to plain objects for Client Component
  const recentQueries = JSON.parse(JSON.stringify(recentQueriesRaw));

  return (
    <DashboardView
      stats={{
        propertyCount,
        productCount,
        pendingQueryCount,
        totalQueryCount,
        userCount,
      }}
      recentQueries={recentQueries}
    />
  );
}
