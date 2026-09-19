"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaEnvelopeOpenText,
  FaUserShield,
  FaPhoneAlt,
  FaWhatsapp,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSortAmountDown,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination calculation
  const totalItems = filteredQueries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedQueries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQueries.slice(start, start + itemsPerPage);
  }, [filteredQueries, currentPage, itemsPerPage]);

  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const formatted = cleaned.length === 10 ? `91${cleaned}` : cleaned;
    return `https://wa.me/${formatted}?text=${encodeURIComponent("Hello from Khurja Deals Admin!")}`;
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fff0f0] text-rose-600 border border-rose-200">
            Offline
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            Contacted
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            Online
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
            Closed
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full space-y-6">
      {/* ── 1. KPI SUMMARY CARDS (4 WHITE CARDS SPREAD ACROSS 100% WIDTH) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {/* Card 1: Active Properties */}
        <div className="bg-white border border-gray-200/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                ACTIVE PROPERTIES
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1.5">
                {stats.propertyCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-100 shrink-0">
              <FaHome />
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Verified Listings</span>
            <Link href="/admin/properties" className="text-blue-600 font-bold hover:underline">
              View All ➔
            </Link>
          </div>
        </div>

        {/* Card 2: Bazaar Products */}
        <div className="bg-white border border-gray-200/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                BAZAAR PRODUCTS
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1.5">
                {stats.productCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-100 shrink-0">
              <FaBox />
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Ceramics & Store</span>
            <Link href="/admin/products" className="text-amber-600 font-bold hover:underline">
              View All ➔
            </Link>
          </div>
        </div>

        {/* Card 3: Pending Inquiries */}
        <div className="bg-white border border-gray-200/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                PENDING INQUIRIES
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1.5">
                {stats.pendingQueryCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold border border-rose-100 shrink-0">
              <FaEnvelopeOpenText />
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span className="text-rose-600 font-bold">Needs Action</span>
            <Link href="/admin/queries" className="text-rose-600 font-bold hover:underline">
              Review ➔
            </Link>
          </div>
        </div>

        {/* Card 4: Platform Admins */}
        <div className="bg-white border border-gray-200/90 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                PLATFORM ADMINS
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1.5">
                {stats.userCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-100 shrink-0">
              <FaUserShield />
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>System Access</span>
            <Link href="/admin/users" className="text-emerald-600 font-bold hover:underline">
              Admins ➔
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN DATA TABLE CARD (Exact Screenshot Match: White Card, Light Blue Header, 100% Width) ── */}
      <div className="bg-white border border-gray-200/90 rounded-2xl shadow-sm p-6 sm:p-7 space-y-6 w-full">
        {/* Header Toolbar: Title + Search + Filter + Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
            Select Asset from List
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:bg-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-7 text-xs font-semibold text-gray-700 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <option value="all">Filter: All Status</option>
                <option value="pending">Offline / Pending</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Online / Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <FaFilter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
            </div>

            {/* Export Report Icon Button */}
            <button
              onClick={() => alert("Export report initialized.")}
              className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-colors cursor-pointer"
              title="Export Report"
            >
              <FaDownload className="text-xs" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-gray-200/90 w-full">
          <table className="w-full text-left text-xs text-gray-700">
            <thead>
              <tr className="bg-[#ebf0f5] border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <span>Asset / Customer Name</span>
                    <FaSortAmountDown className="text-emerald-600 text-[11px]" />
                  </div>
                </th>
                <th className="py-3.5 px-4">VIM / Phone</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Message / Organization</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginatedQueries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No data records found.
                  </td>
                </tr>
              ) : (
                paginatedQueries.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                      {q.name}
                    </td>

                    <td className="py-4 px-4 font-mono text-gray-600 whitespace-nowrap">
                      {q.phone}
                    </td>

                    <td className="py-4 px-4 capitalize font-semibold text-gray-700 whitespace-nowrap">
                      {q.type}
                    </td>

                    <td className="py-4 px-4 text-gray-600 max-w-sm truncate">
                      {q.message}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {statusBadge(q.status)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${q.phone}`}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors"
                          title="Call Phone"
                        >
                          <FaPhoneAlt className="text-xs" />
                        </a>
                        <a
                          href={getWhatsAppLink(q.phone)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors"
                          title="WhatsApp Chat"
                        >
                          <FaWhatsapp className="text-xs" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── BOTTOM PAGINATION BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs text-gray-600 font-semibold">
          <div>
            Showing{" "}
            <span className="font-extrabold text-gray-900">
              {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            out of <span className="font-extrabold text-gray-900">{totalItems}</span>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 text-gray-600 cursor-pointer transition-all"
            >
              <FaAngleDoubleLeft className="text-xs" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 text-gray-600 cursor-pointer transition-all"
            >
              <FaChevronLeft className="text-xs" />
            </button>

            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-900 font-extrabold">
              {currentPage}
            </span>
            <span>of {totalPages} pages</span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 text-gray-600 cursor-pointer transition-all"
            >
              <FaChevronRight className="text-xs" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 text-gray-600 cursor-pointer transition-all"
            >
              <FaAngleDoubleRight className="text-xs" />
            </button>
          </div>

          {/* Items Per Page Select */}
          <div className="flex items-center gap-2">
            <span>Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 outline-none cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
