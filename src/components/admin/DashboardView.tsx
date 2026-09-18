"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaEnvelopeOpenText,
  FaUserShield,
  FaPlus,
  FaArrowRight,
  FaGlobe,
  FaPhoneAlt,
  FaWhatsapp,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaChartPie,
  FaExternalLinkAlt,
} from "react-icons/fa";

interface QueryItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  type: "property" | "product" | "general";
  message: string;
  status: "pending" | "contacted" | "resolved" | "closed";
  referenceId?: string;
  createdAt: string;
}

interface DashboardStats {
  propertyCount: number;
  productCount: number;
  pendingQueryCount: number;
  totalQueryCount: number;
  userCount: number;
}

interface DashboardViewProps {
  stats: DashboardStats;
  recentQueries: QueryItem[];
}

export default function DashboardView({ stats, recentQueries }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Calculate resolution rate
  const resolvedCount = useMemo(() => {
    return recentQueries.filter((q) => q.status === "resolved" || q.status === "closed").length;
  }, [recentQueries]);

  const resolutionPercentage = useMemo(() => {
    if (stats.totalQueryCount === 0) return 100;
    const resolvedEstimate = Math.max(0, stats.totalQueryCount - stats.pendingQueryCount);
    return Math.round((resolvedEstimate / stats.totalQueryCount) * 100);
  }, [stats]);

  // Filter queries based on search query and status filter
  const filteredQueries = useMemo(() => {
    return recentQueries.filter((q) => {
      const matchesSearch =
        searchQuery === "" ||
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.phone.includes(searchQuery) ||
        (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "all" || q.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [recentQueries, searchQuery, selectedStatus]);

  // Clean phone number for WhatsApp link
  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const formatted = cleaned.length === 10 ? `91${cleaned}` : cleaned;
    return `https://wa.me/${formatted}?text=${encodeURIComponent("Hello from Khurja Deals Admin!")}`;
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Pending
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Contacted
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-neutral-800 text-neutral-400 border border-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />
            Closed
          </span>
        );
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-10 selection:bg-[#E8590C] selection:text-white">
      {/* ── 1. WELCOME HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181210] via-[#151318] to-[#121216] border border-[#E8590C]/25 p-6 sm:p-8 shadow-2xl">
        {/* Background glow circle decorative graphics */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#E8590C]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-widest text-[#E8590C]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8590C]/15 border border-[#E8590C]/30 text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                System Active
              </span>
              <span className="text-neutral-500">•</span>
              <span className="inline-flex items-center gap-1.5 text-neutral-400">
                <FaCalendarAlt className="text-neutral-500 text-xs" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Khurja Deals Hub <span className="text-[#E8590C]">👋</span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-medium leading-relaxed">
              Real-time overview of active real estate listings, bazaar ceramic products, customer inquiry requests, and administrative tools.
            </p>
          </div>

          {/* Quick Action Buttons Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/admin/properties?add=true"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E8590C] to-[#f59e0b] hover:from-[#d14d0a] hover:to-[#e08e00] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-[#E8590C]/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FaPlus className="text-xs" /> Add Property
            </Link>

            <Link
              href="/admin/products?add=true"
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs sm:text-sm font-extrabold border border-neutral-700/80 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <FaBox className="text-xs text-amber-400" /> Add Product
            </Link>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs sm:text-sm font-bold border border-neutral-800 flex items-center gap-2 transition-all"
              title="Preview Website"
            >
              <FaGlobe className="text-xs text-[#E8590C]" /> Site <FaExternalLinkAlt className="text-[10px] opacity-70" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. METRIC STAT CARDS GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Properties */}
        <div className="group relative bg-[#121216] border border-neutral-800/80 hover:border-blue-500/40 p-5 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/10 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Active Properties
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-blue-400 transition-colors">
                {stats.propertyCount}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <FaHome />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-400 font-medium">Real Estate Listings</span>
            <Link
              href="/admin/properties"
              className="text-blue-400 font-bold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              Manage <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>

        {/* Card 2: Products */}
        <div className="group relative bg-[#121216] border border-neutral-800/80 hover:border-amber-500/40 p-5 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-amber-500/10 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Bazaar Products
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-amber-400 transition-colors">
                {stats.productCount}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <FaBox />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-400 font-medium">Ceramics & Items</span>
            <Link
              href="/admin/products"
              className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              Manage <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>

        {/* Card 3: Pending Inquiries */}
        <div className="group relative bg-[#121216] border border-neutral-800/80 hover:border-rose-500/40 p-5 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-rose-500/10 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Pending Inquiries
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-rose-400 transition-colors">
                {stats.pendingQueryCount}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <FaEnvelopeOpenText />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            {stats.pendingQueryCount > 0 ? (
              <span className="text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                <FaExclamationCircle className="text-[11px]" /> Follow-up Required
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <FaCheckCircle className="text-[11px]" /> All Clear
              </span>
            )}
            <Link
              href="/admin/queries"
              className="text-rose-400 font-bold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              View All <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>

        {/* Card 4: Platform Admins */}
        <div className="group relative bg-[#121216] border border-neutral-800/80 hover:border-emerald-500/40 p-5 sm:p-6 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10 flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Platform Admins
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white group-hover:text-emerald-400 transition-colors">
                {stats.userCount}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
              <FaUserShield />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-400 font-medium">System Security</span>
            <Link
              href="/admin/users"
              className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              Admins <FaArrowRight className="text-[10px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 3. VISUAL ANALYTICS & DISTRIBUTION SUMMARY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column (2 Cols): Recent Queries & Enquiries */}
        <div className="lg:col-span-2 bg-[#121216] border border-neutral-800/80 rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2 tracking-wide">
                <FaEnvelopeOpenText className="text-[#E8590C]" /> Recent Customer Enquiries
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                Live customer lead submissions from website contact forms.
              </p>
            </div>

            <Link
              href="/admin/queries"
              className="text-xs font-bold text-[#E8590C] hover:text-white hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
            >
              View All Enquiries <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs" />
              <input
                type="text"
                placeholder="Search by name, phone, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-[#E8590C] focus:ring-1 focus:ring-[#E8590C] transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {["all", "pending", "contacted", "resolved", "closed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                    selectedStatus === st
                      ? "bg-[#E8590C] text-white shadow-md shadow-[#E8590C]/30"
                      : "bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Queries List / View */}
          {filteredQueries.length === 0 ? (
            <div className="text-center py-12 px-4 bg-neutral-900/50 border border-dashed border-neutral-800 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 text-neutral-400 flex items-center justify-center text-xl mx-auto border border-neutral-700">
                <FaEnvelopeOpenText />
              </div>
              <p className="text-sm font-bold text-neutral-300">No matching inquiries found</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Try adjusting your search keywords or filter status.
              </p>
            </div>
          ) : (
            <>
              {/* ── DESKTOP TABLE VIEW (md:block) ── */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-neutral-800/80 bg-neutral-950/40">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-900/80 text-[11px] text-neutral-400 uppercase font-black tracking-wider">
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Date</th>
                      <th className="py-3.5 px-4 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {filteredQueries.map((q) => (
                      <tr key={q._id} className="hover:bg-neutral-900/50 transition-colors group">
                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E8590C]/20 to-amber-500/20 text-[#E8590C] font-black flex items-center justify-center text-xs shrink-0 border border-[#E8590C]/30">
                              {q.name ? q.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate max-w-[140px] group-hover:text-[#E8590C] transition-colors">
                                {q.name}
                              </p>
                              {q.email && (
                                <p className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                                  {q.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-neutral-300 whitespace-nowrap">
                          {q.phone}
                        </td>

                        {/* Type */}
                        <td className="py-3.5 px-4 capitalize">
                          <span className="px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">
                            {q.type}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4">{statusBadge(q.status)}</td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-right text-neutral-400 whitespace-nowrap font-medium">
                          {new Date(q.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Quick Contact Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Call Button */}
                            <a
                              href={`tel:${q.phone}`}
                              className="p-2 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 transition-all"
                              title={`Call ${q.phone}`}
                            >
                              <FaPhoneAlt className="text-xs" />
                            </a>

                            {/* WhatsApp Button */}
                            <a
                              href={getWhatsAppLink(q.phone)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp className="text-xs" />
                            </a>

                            {/* View / Manage link */}
                            <Link
                              href="/admin/queries"
                              className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-[#E8590C] text-neutral-300 hover:text-white text-[11px] font-bold border border-neutral-800 transition-all"
                            >
                              Manage
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE TOUCH CARDS VIEW (md:hidden) ── */}
              <div className="md:hidden space-y-3">
                {filteredQueries.map((q) => (
                  <div
                    key={q._id}
                    className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E8590C]/20 to-amber-500/20 text-[#E8590C] font-black flex items-center justify-center text-xs shrink-0 border border-[#E8590C]/30">
                          {q.name ? q.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-white text-sm truncate">{q.name}</h4>
                          <span className="text-[10px] text-neutral-400 capitalize block">
                            Type: {q.type}
                          </span>
                        </div>
                      </div>

                      {statusBadge(q.status)}
                    </div>

                    {/* Message Snippet */}
                    <p className="text-xs text-neutral-300 line-clamp-2 bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-850">
                      "{q.message}"
                    </p>

                    {/* Footer Info & Quick Touch Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {new Date(q.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${q.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FaPhoneAlt className="text-[10px]" /> Call
                        </a>

                        <a
                          href={getWhatsAppLink(q.phone)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FaWhatsapp className="text-[11px]" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column (1 Col): Platform Analytics & Quick Actions Panel */}
        <div className="space-y-6">
          {/* Analytics Summary Widget */}
          <div className="bg-[#121216] border border-neutral-800/80 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2 tracking-wide uppercase">
                <FaChartPie className="text-[#E8590C]" /> System Analytics
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Live Data
              </span>
            </div>

            {/* Inquiry Resolution Rate Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-300">Lead Resolution Rate</span>
                <span className="font-black text-[#E8590C]">{resolutionPercentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-900 overflow-hidden p-0.5 border border-neutral-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E8590C] via-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${resolutionPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400">
                Percentage of customer inquiries handled or resolved.
              </p>
            </div>

            <hr className="border-t border-neutral-800/60" />

            {/* Breakdown Ratios */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Active Properties
                </span>
                <span className="font-bold text-white">{stats.propertyCount}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Bazaar Products
                </span>
                <span className="font-bold text-white">{stats.productCount}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Pending Inquiries
                </span>
                <span className="font-bold text-rose-400">{stats.pendingQueryCount}</span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Admin Users
                </span>
                <span className="font-bold text-white">{stats.userCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="bg-[#121216] border border-neutral-800/80 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
              Quick Admin Actions
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              <Link
                href="/admin/properties?add=true"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-[#E8590C]/50 hover:bg-neutral-900 transition-all text-xs font-extrabold text-white group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E8590C]/15 text-[#E8590C] flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                    <FaHome />
                  </div>
                  <span>Add Property Listing</span>
                </div>
                <FaArrowRight className="text-neutral-500 group-hover:text-[#E8590C] group-hover:translate-x-1 transition-all text-xs" />
              </Link>

              <Link
                href="/admin/products?add=true"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-900 transition-all text-xs font-extrabold text-white group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                    <FaBox />
                  </div>
                  <span>Add Bazaar Product</span>
                </div>
                <FaArrowRight className="text-neutral-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all text-xs" />
              </Link>

              <Link
                href="/admin/queries"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-rose-500/50 hover:bg-neutral-900 transition-all text-xs font-extrabold text-white group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                    <FaEnvelopeOpenText />
                  </div>
                  <span>Review Lead Queries</span>
                </div>
                <FaArrowRight className="text-neutral-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all text-xs" />
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-900 transition-all text-xs font-extrabold text-white group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                    <FaUserShield />
                  </div>
                  <span>Manage Platform Admins</span>
                </div>
                <FaArrowRight className="text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
