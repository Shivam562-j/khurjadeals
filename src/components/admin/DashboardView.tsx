"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaEnvelopeOpenText,
  FaUserShield,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { Table, TopHeader, TableColumn, FilterFormData } from "./Tables";

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
  const [filterFormData, setFilterFormData] = useState<FilterFormData>({
    status: [],
    type: [],
  });
  const [page, setPage] = useState(0); // 0-indexed for table
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<boolean>(false); // false = desc (newest first)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Automatically reset page to first page when search or filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, filterFormData]);

  // Count active filters
  const filterCount =
    (filterFormData.status?.length || 0) + (filterFormData.type?.length || 0);

  // Filter queries based on search query, status array, and type array
  const filteredQueries = useMemo(() => {
    return recentQueries.filter((q) => {
      const qSearch = searchQuery.trim().toLowerCase();
      const matchesSearch =
        qSearch === "" ||
        (q.name && q.name.toLowerCase().includes(qSearch)) ||
        (q.phone && q.phone.includes(qSearch)) ||
        (q.email && q.email.toLowerCase().includes(qSearch)) ||
        (q.message && q.message.toLowerCase().includes(qSearch));

      // Status matching: handle "pending"/"offline", "resolved"/"online", "contacted", "closed"
      let matchesStatus = true;
      if (filterFormData.status && filterFormData.status.length > 0) {
        const itemStatus = String(q.status || "").toLowerCase();
        matchesStatus = filterFormData.status.some((selected) => {
          const sel = selected.toLowerCase();
          if (sel === "pending" || sel === "offline") {
            return itemStatus === "pending" || itemStatus === "offline";
          }
          if (sel === "resolved" || sel === "online") {
            return itemStatus === "resolved" || itemStatus === "online";
          }
          return itemStatus === sel;
        });
      }

      // Type matching: "property", "product", "general"
      let matchesType = true;
      if (filterFormData.type && filterFormData.type.length > 0) {
        const itemType = String(q.type || "").toLowerCase();
        matchesType = filterFormData.type.some(
          (selected) => selected.toLowerCase() === itemType
        );
      }

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [recentQueries, searchQuery, filterFormData]);

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

  // CSV Export Function
  const handleExportCSV = () => {
    if (!filteredQueries.length) {
      alert("No inquiries to export.");
      return;
    }
    const headers = [
      "Customer Name",
      "Phone",
      "Email",
      "Type",
      "Status",
      "Message",
      "Created At",
    ];
    const rows = filteredQueries.map((q) => [
      `"${(q.name || "").replace(/"/g, '""')}"`,
      `"${q.phone || ""}"`,
      `"${q.email || ""}"`,
      `"${q.type || ""}"`,
      `"${q.status || ""}"`,
      `"${(q.message || "").replace(/"/g, '""')}"`,
      `"${q.createdAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `inquiries_list_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Define Columns for CustomTable
  const columns: TableColumn<QueryItem>[] = [
    {
      id: "name",
      label: "Customer Name",
      key1: "name",
      isSortable: true,
      minWidth: "200px",
      render: (item) => (
        <span className="font-bold text-gray-900">{item.name}</span>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      key1: "phone",
      isSortable: true,
      minWidth: "140px",
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
      minWidth: "110px",
      render: (item) => (
        <span className="capitalize font-semibold text-gray-700">
          {item.type}
        </span>
      ),
    },
    {
      id: "message",
      label: "Message",
      key1: "message",
      minWidth: "260px",
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
        {/* TopHeader: Title: Inquiries List, Expandable Search, Filter Popover, Export CSV */}
        <TopHeader
          title="Inquiries List"
          searchText={searchQuery}
          setSearchText={setSearchQuery}
          handleSearchEnter={setSearchQuery}
          filterFormData={filterFormData}
          handleFilterFormDataChange={(key, value) => {
            setFilterFormData((prev) => ({
              ...prev,
              [key]: value,
            }));
          }}
          setFilterFormData={setFilterFormData}
          filterCount={filterCount}
          handleExportClick={handleExportCSV}
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

