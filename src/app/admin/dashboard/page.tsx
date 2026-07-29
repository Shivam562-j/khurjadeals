import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaEnvelope,
  FaUsers,
  FaPlus,
  FaFileAlt,
} from "react-icons/fa";
import Property from "@/models/Property";
import Product from "@/models/Product";
import Query from "@/models/Query";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await connectDB();

  // Fetch counts
  const [propertyCount, productCount, queryCount, userCount, recentQueries] =
    await Promise.all([
      Property.countDocuments(),
      Product.countDocuments(),
      Query.countDocuments({ status: "pending" }),
      User.countDocuments(),
      Query.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  const stats = [
    { label: "Active Properties", count: propertyCount, icon: <FaHome />, color: "text-blue-500" },
    { label: "Bazaar Products", count: productCount, icon: <FaBox />, color: "text-amber-500" },
    { label: "Pending Inquiries", count: queryCount, icon: <FaEnvelope />, color: "text-rose-500" },
    { label: "Platform Admins", count: userCount, icon: <FaUsers />, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Dashboard</h1>
        <p className="text-sm text-neutral-400">
          Overview of listings, enquiries, and management operations.
        </p>
      </div>

      {/* Stats Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-center justify-between shadow"
          >
            <div className="space-y-1">
              <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                {stat.label}
              </span>
              <p className="text-3xl font-black text-white">{stat.count}</p>
            </div>
            <div className={`text-2xl ${stat.color} flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Queries & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Queries (Left 2 columns) */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-850 rounded-2xl p-6 space-y-4 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Recent Queries & Enquiries
            </h3>
            <Link
              href="/admin/queries"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Manage All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr className="border-b border-neutral-850 text-xs text-neutral-500 uppercase font-bold tracking-wider">
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Phone</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850/50">
                {recentQueries.map((query: any) => {
                  const statusColors: any = {
                    pending: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
                    contacted: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
                    resolved: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                    closed: "bg-neutral-800 text-neutral-400 border border-neutral-750",
                  };

                  return (
                    <tr key={query._id} className="hover:bg-neutral-950/20">
                      <td className="py-3.5 px-2 font-semibold text-white">
                        {query.name}
                      </td>
                      <td className="py-3.5 px-2">{query.phone}</td>
                      <td className="py-3.5 px-2 capitalize text-xs">
                        {query.type}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${statusColors[query.status]}`}>
                          {query.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right text-xs text-neutral-500">
                        {new Intl.DateTimeFormat("en-IN").format(query.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions (Right 1 column) */}
        <div className="lg:col-span-1 bg-neutral-900 border border-neutral-850 rounded-2xl p-6 space-y-4 shadow">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              href="/admin/properties?add=true"
              className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all text-sm font-semibold group"
            >
              <span className="flex items-center gap-2">
                <FaPlus className="text-xs text-[var(--primary)]" /> Add Property
              </span>
              <span className="text-neutral-500 group-hover:text-white transition-colors">
                ➔
              </span>
            </Link>

            <Link
              href="/admin/products?add=true"
              className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all text-sm font-semibold group"
            >
              <span className="flex items-center gap-2">
                <FaPlus className="text-xs text-[var(--primary)]" /> Add Bazaar Product
              </span>
              <span className="text-neutral-500 group-hover:text-white transition-colors">
                ➔
              </span>
            </Link>

            <Link
              href="/submit-query"
              target="_blank"
              className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all text-sm font-semibold group"
            >
              <span className="flex items-center gap-2">
                <FaFileAlt className="text-xs text-[var(--primary)]" /> Submit Query (Form)
              </span>
              <span className="text-neutral-500 group-hover:text-white transition-colors">
                ➔
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
