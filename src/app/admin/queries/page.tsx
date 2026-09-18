"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Query, QueryStatus } from "@/types/query";
import Loader from "@/components/common/Loader";
import {
  FaSearch,
  FaFilter,
  FaPhoneAlt,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaTrash,
} from "react-icons/fa";

export default function QueriesManager() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/queries");
      if (res.ok) {
        const data = await res.json();
        setQueries(data || []);
      }
    } catch {}
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleStatusChange = async (id: string, status: QueryStatus) => {
    try {
      const res = await fetch(`/api/queries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setQueries(
          queries.map((q) => (q._id === id ? { ...q, status } : q))
        );
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      const res = await fetch(`/api/queries/${id}`, { method: "DELETE" });
      if (res.ok) {
        setQueries(queries.filter((q) => q._id !== id));
      }
    } catch {}
  };

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      const matchesSearch =
        searchQuery === "" ||
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.phone.includes(searchQuery) ||
        (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === "all" || q.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [queries, searchQuery, selectedStatus]);

  const totalItems = filteredQueries.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedQueries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredQueries.slice(start, start + itemsPerPage);
  }, [filteredQueries, currentPage, itemsPerPage]);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Contacted", value: "contacted" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Customer Queries & Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Review, update status, and respond to user lead submissions.
          </p>
        </div>
      </div>

      {isLoading ? (
        <Loader size="lg" />
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6 space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-extrabold text-gray-800">
              Select Enquiry from List
            </h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-800 outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-semibold text-gray-700 outline-none cursor-pointer hover:bg-gray-100"
                >
                  <option value="all">Filter: All Status</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <FaFilter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-gray-200/80">
            <table className="w-full text-left text-xs text-gray-700">
              <thead>
                <tr className="bg-[#ebf0f5] border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4">User Details</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedQueries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      No queries found.
                    </td>
                  </tr>
                ) : (
                  paginatedQueries.map((q) => (
                    <tr key={q._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        <div>{q.name}</div>
                        <a href={`tel:${q.phone}`} className="text-xs text-emerald-600 hover:underline block font-mono mt-0.5">
                          📞 {q.phone}
                        </a>
                        {q.email && <span className="text-[11px] text-gray-500 block font-normal">{q.email}</span>}
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold">
                        {q.type}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">
                        {q.message}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={q.status}
                          onChange={(e) => handleStatusChange(q._id, e.target.value as any)}
                          className={`text-xs font-extrabold rounded-lg border px-2.5 py-1 outline-none bg-white cursor-pointer ${
                            q.status === "pending"
                              ? "border-rose-300 text-rose-600 bg-rose-50"
                              : q.status === "contacted"
                              ? "border-amber-300 text-amber-700 bg-amber-50"
                              : q.status === "resolved"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                              : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        {q.type === "property" && (
                          <Link
                            href={`/admin/properties?add=true&title=${encodeURIComponent("Listing from " + q.name)}&description=${encodeURIComponent(q.message)}&contactName=${encodeURIComponent(q.name)}&contactPhone=${encodeURIComponent(q.phone)}`}
                            className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block transition"
                          >
                            Convert to Property
                          </Link>
                        )}
                        {q.type === "product" && (
                          <Link
                            href={`/admin/products?add=true&title=${encodeURIComponent("Listing from " + q.name)}&description=${encodeURIComponent(q.message)}&contactName=${encodeURIComponent(q.name)}&contactPhone=${encodeURIComponent(q.phone)}`}
                            className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded border border-blue-200 inline-block transition"
                          >
                            Convert to Product
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded border border-rose-200 inline-block transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-gray-600 font-semibold border-t border-gray-100">
            <div>
              Showing <span className="font-extrabold text-gray-900">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)}</span> out of <span className="font-extrabold text-gray-900">{totalItems}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 cursor-pointer"
              >
                <FaAngleDoubleLeft className="text-xs" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 cursor-pointer"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-900 font-extrabold">
                {currentPage}
              </span>
              <span>of {totalPages} pages</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 cursor-pointer"
              >
                <FaChevronRight className="text-xs" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 border border-gray-200 cursor-pointer"
              >
                <FaAngleDoubleRight className="text-xs" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-800 outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
