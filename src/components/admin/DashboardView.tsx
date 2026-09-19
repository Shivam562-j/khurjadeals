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
} from "react-icons/fa";
import { Table, TopHeader, TableColumn } from "./Tables";

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

export default function DashboardView({
  stats,
  recentQueries,
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(0); // 0-indexed for table
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<boolean>(false); // false = desc (newest first)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter queries based on search query and status filter
  const filteredQueries = useMemo(() => {
    return recentQueries.filter((q) => {
      const matchesSearch =
        searchQuery === "" ||
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.phone.includes(searchQuery) ||
        (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || q.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [recentQueries, searchQuery, selectedStatus]);

  // Sort queries based on sortBy and sortOrder
  const sortedQueries = useMemo(() => {
    return [...filteredQueries].sort((a, b) => {
      let valA = (a as any)[sortBy] || "";
      let valB = (b as any)[sortBy] || "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder ? -1 : 1;
      if (valA > valB) return sortOrder ? 1 : -1;
      return 0;
    });
  }, [filteredQueries, sortBy, sortOrder]);

  // Pagination calculation
  const totalItems = sortedQueries.length;
  const paginatedQueries = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedQueries.slice(start, start + rowsPerPage);
  }, [sortedQueries, page, rowsPerPage]);

  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const formatted = cleaned.length === 10 ? `91${cleaned}` : cleaned;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(
      "Hello from Khurja Deals Admin!"
    )}`;
  };

  // Define Columns for CustomTable matching user design & requirement
  const columns: TableColumn<QueryItem>[] = [
    {
      id: "name",
      label: "Asset / Customer Name",
      key1: "name",
      isSortable: true,
      minWidth: "220px",
      render: (item) => (
        <span className="font-bold text-gray-900">{item.name}</span>
      ),
    },
    {
      id: "phone",
      label: "VIM / Phone",
      key1: "phone",
      isSortable: true,
      minWidth: "150px",
      render: (item) => (
        <span className="font-mono text-gray-600 font-medium tracking-wide">
          {item.phone}
        </span>
      ),
    },
    {
      id: "type",
      label: "Type",
      key1: "type",
      isSortable: true,
      minWidth: "120px",
      render: (item) => (
        <span className="capitalize font-semibold text-gray-700">
          {item.type}
        </span>
      ),
    },
    {
      id: "message",
      label: "Message / Organization",
      key1: "message",
      minWidth: "280px",
      render: (item) => (
        <span
          className="text-gray-600 block max-w-sm truncate"
          title={item.message}
        >
          {item.message}
        </span>
      ),
    },
    {
      id: "status",
      label: "Status",
      key1: "status",
      isSortable: true,
      type: "status",
      minWidth: "130px",
    },
    {
      id: "action",
      label: "Quick Contact",
      key1: "phone",
      type: "action",
      minWidth: "140px",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <a
            href={`tel:${item.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 transition-colors"
            title="Call Phone"
          >
            <FaPhoneAlt className="text-xs" />
          </a>
          <a
            href={getWhatsAppLink(item.phone)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors"
            title="WhatsApp Chat"
          >
            <FaWhatsapp className="text-xs" />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#f3f5f8] h-full w-full flex flex-col min-h-0 space-y-6">
      {/* ── 1. KPI SUMMARY CARDS (Top cards take natural height) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full shrink-0">
        {/* Card 1: Active Properties */}
        <div className="bg-white border border-gray-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                ACTIVE PROPERTIES
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">
                {stats.propertyCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold border border-blue-100 shrink-0">
              <FaHome />
            </div>
          </div>
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Verified Listings</span>
            <Link
              href="/admin/properties"
              className="text-blue-600 font-bold hover:underline"
            >
              View All ➔
            </Link>
          </div>
        </div>

        {/* Card 2: Bazaar Products */}
        <div className="bg-white border border-gray-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                BAZAAR PRODUCTS
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">
                {stats.productCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold border border-amber-100 shrink-0">
              <FaBox />
            </div>
          </div>
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Ceramics & Store</span>
            <Link
              href="/admin/products"
              className="text-amber-600 font-bold hover:underline"
            >
              View All ➔
            </Link>
          </div>
        </div>

        {/* Card 3: Pending Inquiries */}
        <div className="bg-white border border-gray-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                PENDING INQUIRIES
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">
                {stats.pendingQueryCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg font-bold border border-rose-100 shrink-0">
              <FaEnvelopeOpenText />
            </div>
          </div>
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span className="text-rose-600 font-bold">Needs Action</span>
            <Link
              href="/admin/queries"
              className="text-rose-600 font-bold hover:underline"
            >
              Review ➔
            </Link>
          </div>
        </div>

        {/* Card 4: Platform Admins */}
        <div className="bg-white border border-gray-200/90 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                PLATFORM ADMINS
              </p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">
                {stats.userCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold border border-emerald-100 shrink-0">
              <FaUserShield />
            </div>
          </div>
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>System Access</span>
            <Link
              href="/admin/users"
              className="text-emerald-600 font-bold hover:underline"
            >
              Admins ➔
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN DATA TABLE CARD (Exact layout: bg-[#fcfcfc] flex flex-col h-full rounded-lg) ── */}
      <div className="bg-[#fcfcfc] flex flex-col h-[600px] lg:h-full lg:flex-1 min-h-0 rounded-lg border border-[#E5E9F0] overflow-hidden shadow-xs">
        {/* TopHeader with title, expandable search, filter popover with count, action button, alert button */}
        <TopHeader
          title="Select Asset from List"
          searchText={searchQuery}
          setSearchText={(val) => {
            setSearchQuery(val);
            setPage(0);
          }}
          handleSearchEnter={(val) => {
            setSearchQuery(val);
            setPage(0);
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(status) => {
            setSelectedStatus(status);
            setPage(0);
          }}
          filterCount={selectedStatus !== "all" ? 1 : 0}
          statusOptions={[
            { label: "All Status", value: "all" },
            { label: "Offline / Pending", value: "pending" },
            { label: "Contacted", value: "contacted" },
            { label: "Online / Resolved", value: "resolved" },
            { label: "Closed", value: "closed" },
          ]}
          actionButtonText="New Asset"
          handleActionClick={() => alert("New Asset action clicked.")}
          handleAlertRepeat={() => alert("Notification alerts checked.")}
        />

        {/* Custom Table Component */}
        <Table
            columns={columns}
            tableData={paginatedQueries}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalItems}
            handleChangePage={(newPage) => setPage(newPage)}
            handleChangeRowsPerPage={(newRows) => {
              setRowsPerPage(newRows);
              setPage(0);
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            isCheckBox={true}
            isSno={false}
            selectedRows={selectedRows}
            handleRowSelect={(id) => {
              setSelectedRows((prev) =>
                prev.includes(id)
                  ? prev.filter((r) => r !== id)
                  : [...prev, id]
              );
            }}
            handleSelectAllClick={() => {
              if (selectedRows.length === paginatedQueries.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(paginatedQueries.map((q) => q._id));
              }
            }}
          />
      </div>
    </div>
  );
}

