"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, useReducer } from "react";
import Link from "next/link";
import {
  FaHome,
  FaBox,
  FaEnvelopeOpenText,
  FaUserShield,
} from "react-icons/fa";
import {
  MdEdit,
  MdDeleteOutline,
  MdOpenInNew,
  MdPhone,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import {
  Table,
  TopHeader,
  TableColumn,
  FilterFormData,
  FilterSection,
} from "./Tables";
import { toast } from "react-toastify";
import {
  initialSearchState,
  searchActions,
  searchReducer,
} from "@/reducer/searchReducer";
import { RightDrawer, QueryDrawerDetails } from "@/components/admin/Drawer";
import { CreateQueryModal } from "@/components/admin/Forms";
import { DeleteModal } from "@/components/admin/Modal";
import { Query, QueryStatus } from "@/types/query";

interface DashboardStats {
  propertyCount: number;
  productCount: number;
  pendingQueryCount: number;
  totalQueryCount: number;
  userCount: number;
}

interface DashboardViewProps {
  stats: DashboardStats;
  recentQueries: Query[];
}

const queryFilterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    gridCols: 2,
    options: [
      { label: "Pending", value: "pending" },
      { label: "Contacted", value: "contacted" },
      { label: "Resolved", value: "resolved" },
      { label: "Closed", value: "closed" },
    ],
  },
  {
    id: "type",
    title: "Enquiry Type",
    gridCols: 3,
    options: [
      { label: "Property", value: "property" },
      { label: "Product", value: "product" },
      { label: "General", value: "general" },
    ],
  },
];

export default function DashboardView({
  stats,
  recentQueries = [],
}: DashboardViewProps) {
  // Backend Queries state
  const [queries, setQueries] = useState<Query[]>(recentQueries);
  const [totalCount, setTotalCount] = useState<number>(stats.totalQueryCount || recentQueries.length);
  const [isLoading, setIsLoading] = useState(false);

  // Search input state with reducer (onEnter search execution)
  const [searchState, dispatchSearch] = useReducer(searchReducer, {
    ...initialSearchState,
    searchText: "",
  });
  const { searchInput, searchText, cacheSearchText } = searchState;
  const [activeSearch, setActiveSearch] = useState("");
  const [filterFormData, setFilterFormData] = useState<FilterFormData>({});

  // Pagination & Sorting State
  const [page, setPage] = useState(0); // 0-indexed for table
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<boolean>(false); // false = desc (newest first)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Drawer & Modal State
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editQuery, setEditQuery] = useState<Query | null>(null);

  // Fetch queries from backend with server-side pagination, search, filter, and sorting
  const fetchQueriesData = useCallback(
    async (
      targetPage = page,
      targetLimit = rowsPerPage,
      targetSortBy = sortBy,
      targetSortOrder = sortOrder,
      targetSearch = activeSearch,
      targetFilters = filterFormData
    ) => {
      setIsLoading(true);
      try {
        const q = new URLSearchParams();
        q.set("page", String(targetPage + 1));
        q.set("limit", String(targetLimit));
        if (targetSortBy) q.set("sortBy", targetSortBy);
        q.set("sortOrder", targetSortOrder ? "asc" : "desc");

        if (targetSearch && targetSearch.trim()) {
          q.set("search", targetSearch.trim());
        }

        if (targetFilters?.status && targetFilters.status.length > 0) {
          q.set("status", targetFilters.status.join(","));
        }

        if (targetFilters?.type && targetFilters.type.length > 0) {
          q.set("type", targetFilters.type.join(","));
        }

        const res = await fetch(`/api/queries?${q.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setQueries(data);
            setTotalCount(data.length);
          } else {
            setQueries(data.queries || []);
            setTotalCount(data.total ?? data.count ?? (data.queries?.length || 0));
          }
        } else {
          setQueries([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard queries:", err);
        setQueries([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData]
  );

  const prevFilterRef = useRef(filterFormData);
  const prevSearchRef = useRef(activeSearch);
  const isInitialMount = useRef(true);

  // Fetch data when pagination, sorting, activeSearch (onEnter), or filters change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const filterChanged =
      JSON.stringify(prevFilterRef.current.status) !== JSON.stringify(filterFormData.status) ||
      JSON.stringify(prevFilterRef.current.type) !== JSON.stringify(filterFormData.type);

    const searchChanged = prevSearchRef.current !== activeSearch;

    if (filterChanged || searchChanged) {
      prevFilterRef.current = filterFormData;
      prevSearchRef.current = activeSearch;
      if (page !== 0) {
        setPage(0);
        return;
      }
    }

    fetchQueriesData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
  }, [page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData, fetchQueriesData]);

  // Handle search when user presses Enter key
  const handleSearchEnter = (searchValue: string) => {
    setPage(0);
    setActiveSearch(searchValue.trim());
    if (!searchValue.trim()) {
      dispatchSearch({ type: searchActions.RESET_SEARCH });
    }
  };

  // Active filters count
  const filterCount = useMemo(() => {
    return Object.values(filterFormData).reduce(
      (acc, arr) => acc + (arr?.length || 0),
      0
    );
  }, [filterFormData]);

  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    const formatted = cleaned.length === 10 ? `91${cleaned}` : cleaned;
    return `https://wa.me/${formatted}?text=${encodeURIComponent(
      "Hello from Khurja Deals Admin!"
    )}`;
  };

  // Status Change directly from row or drawer
  const handleStatusChange = async (id: string, newStatus: QueryStatus) => {
    try {
      const res = await fetch(`/api/queries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setQueries((prev) =>
          prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q))
        );
        if (selectedQuery?._id === id) {
          setSelectedQuery((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        toast.success(`Inquiry status updated to ${newStatus}.`);
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status.");
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!queryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/queries/${queryToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Inquiry deleted successfully.");
        if (selectedQuery?._id === queryToDelete._id) {
          setIsDrawerOpen(false);
          setSelectedQuery(null);
        }
        fetchQueriesData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to delete query.");
      }
    } catch (err) {
      console.error("Failed to delete query:", err);
      toast.error("Failed to delete query.");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
      setQueryToDelete(null);
    }
  };

  // CSV Export Function (fetching all matching backend records)
  const handleExportCSV = async () => {
    try {
      const q = new URLSearchParams();
      q.set("page", "1");
      q.set("limit", "1000");
      if (sortBy) q.set("sortBy", sortBy);
      q.set("sortOrder", sortOrder ? "asc" : "desc");
      if (activeSearch.trim()) q.set("search", activeSearch.trim());
      if (filterFormData?.status?.length) q.set("status", filterFormData.status.join(","));
      if (filterFormData?.type?.length) q.set("type", filterFormData.type.join(","));

      const res = await fetch(`/api/queries?${q.toString()}`);
      const data = await res.json();
      const exportList: Query[] = Array.isArray(data) ? data : data.queries || queries;

      if (!exportList.length) {
        toast.warning("No inquiries found to export.");
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
      const rows = exportList.map((q) => [
        `"${(q.name || "").replace(/"/g, '""')}"`,
        `"${q.phone || ""}"`,
        `"${(q.email || "").replace(/"/g, '""')}"`,
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
      toast.success(`${exportList.length} inquiries exported successfully.`);
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Failed to export inquiries.");
    }
  };

  // Define Columns for CustomTable matching pure admin panel
  const columns: TableColumn<Query>[] = [
    {
      id: "name",
      label: "Customer Name",
      key1: "name",
      isSortable: true,
      minWidth: "200px",
      render: (item) => (
        <div className="truncate py-0.5">
          <span className="font-semibold text-white block truncate" title={item.name}>
            {item.name}
          </span>
          {item.email && (
            <span className="text-[11px] text-[#a3a3a3] block truncate">
              {item.email}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      key1: "phone",
      minWidth: "140px",
      render: (item) => (
        <a
          href={`tel:${item.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="font-mono text-xs text-[#f59e0b] hover:underline font-semibold"
        >
          {item.phone}
        </a>
      ),
    },
    {
      id: "type",
      label: "Type",
      key1: "type",
      isSortable: true,
      minWidth: "110px",
      render: (item) => (
        <span className="capitalize font-semibold text-xs px-2.5 py-1 rounded-full bg-[#262626] border border-[#333333] text-white">
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
          className="text-xs text-[#d4d4d4] block max-w-sm truncate"
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
      minWidth: "130px",
      render: (item) => {
        const s = String(item.status || "").toLowerCase();
        if (s === "resolved") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              Resolved
            </span>
          );
        }
        if (s === "contacted") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950/60 text-blue-400 border border-blue-800/60">
              Contacted
            </span>
          );
        }
        if (s === "pending") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/60 text-amber-400 border border-amber-800/60">
              Pending
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
            {item.status || "Closed"}
          </span>
        );
      },
    },
    {
      id: "action",
      label: "Actions",
      key1: "_id",
      type: "action",
      minWidth: "180px",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          {/* Quick Call */}
          <a
            href={`tel:${item.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#1a2234] hover:text-blue-400 transition-colors"
            title="Call Customer"
          >
            <MdPhone className="text-base" />
          </a>

          {/* Quick WhatsApp */}
          <a
            href={getWhatsAppLink(item.phone)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-emerald-950/40 hover:text-emerald-400 transition-colors"
            title="WhatsApp Customer"
          >
            <FaWhatsapp className="text-base" />
          </a>

          {/* View in Drawer */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedQuery(item);
              setIsDrawerOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#262626] hover:text-[#f59e0b] transition-colors cursor-pointer"
            title="View Details in Drawer"
          >
            <MdOpenInNew className="text-base" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setEditQuery(item);
              setOpenForm(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#262626] hover:text-[#f59e0b] transition-colors cursor-pointer"
            title="Edit Query"
          >
            <MdEdit className="text-base" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQueryToDelete(item);
              setDeleteOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-red-950/50 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete Query"
          >
            <MdDeleteOutline className="text-base" />
          </button>
        </div>
      ),
    },
  ];

  const isFilteredOrSearched = Boolean(activeSearch.trim()) || filterCount > 0;
  const emptyText =
    isFilteredOrSearched
      ? "No queries or status found."
      : "No customer queries found.";

  return (
    <div className="space-y-6 p-6 flex flex-col h-full min-h-0 bg-[#0d0d0d]">
      {/* ── 1. KPI STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Card 1: Total Properties */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-2xl shadow-xl hover:border-[#e8590c]/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider">
                TOTAL PROPERTIES
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                {stats.propertyCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#2a170d] text-[#f59e0b] flex items-center justify-center text-lg font-bold border border-[#e8590c]/30 shadow-[0_0_12px_rgba(232,89,12,0.2)] shrink-0">
              <FaHome />
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#262626] flex items-center justify-between text-xs text-[#a3a3a3] font-medium">
            <span>Active Listings</span>
            <Link
              href="/admin/properties"
              className="text-[#f59e0b] font-bold hover:underline"
            >
              Manage ➔
            </Link>
          </div>
        </div>

        {/* Card 2: Bazaar Items */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-2xl shadow-xl hover:border-[#e8590c]/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider">
                BAZAAR PRODUCTS
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                {stats.productCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#2a170d] text-[#f59e0b] flex items-center justify-center text-lg font-bold border border-[#e8590c]/30 shadow-[0_0_12px_rgba(232,89,12,0.2)] shrink-0">
              <FaBox />
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#262626] flex items-center justify-between text-xs text-[#a3a3a3] font-medium">
            <span>Ceramics & Store</span>
            <Link
              href="/admin/products"
              className="text-[#f59e0b] font-bold hover:underline"
            >
              View All ➔
            </Link>
          </div>
        </div>

        {/* Card 3: Pending Inquiries */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-2xl shadow-xl hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider">
                PENDING INQUIRIES
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                {stats.pendingQueryCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-rose-950/40 text-rose-400 flex items-center justify-center text-lg font-bold border border-rose-800/40 shadow-[0_0_12px_rgba(244,63,94,0.15)] shrink-0">
              <FaEnvelopeOpenText />
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#262626] flex items-center justify-between text-xs text-[#a3a3a3] font-medium">
            <span className="text-rose-400 font-bold">Needs Action</span>
            <Link
              href="/admin/queries"
              className="text-rose-400 font-bold hover:underline"
            >
              Review ➔
            </Link>
          </div>
        </div>

        {/* Card 4: Platform Admins */}
        <div className="bg-[#171717] border border-[#262626] p-5 rounded-2xl shadow-xl hover:border-[#e8590c]/40 transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider">
                PLATFORM ADMINS
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                {stats.userCount}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#2a170d] text-[#f59e0b] flex items-center justify-center text-lg font-bold border border-[#e8590c]/30 shadow-[0_0_12px_rgba(232,89,12,0.2)] shrink-0">
              <FaUserShield />
            </div>
          </div>
          <div className="pt-2.5 border-t border-[#262626] flex items-center justify-between text-xs text-[#a3a3a3] font-medium">
            <span>System Access</span>
            <Link
              href="/admin/users"
              className="text-[#f59e0b] font-bold hover:underline"
            >
              Admins ➔
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN DATA TABLE CARD ── */}
      <div className="bg-[#171717] flex flex-col h-[600px] lg:h-full lg:flex-1 min-h-0 rounded-xl border border-[#262626] overflow-hidden shadow-2xl">
        {/* TopHeader: Title: Customer Queries List, search onEnter, filters, New Query action, and Export CSV */}
        <TopHeader
          title="Customer Queries List"
          searchInput={searchInput}
          searchText={searchText}
          cacheSearchText={cacheSearchText}
          dispatchSearch={dispatchSearch}
          searchActions={searchActions}
          handleSearchEnter={handleSearchEnter}
          filterFormData={filterFormData}
          handleFilterFormDataChange={(key, value) => {
            setPage(0);
            setFilterFormData((prev) => ({
              ...prev,
              [key]: value,
            }));
          }}
          setFilterFormData={(updater) => {
            setPage(0);
            setFilterFormData(updater);
          }}
          filterCount={filterCount}
          filterSections={queryFilterSections}
          refetch={() => setPage(0)}
          actionButtonText="New Query"
          actionButtonColor="green"
          handleActionClick={() => {
            setEditQuery(null);
            setOpenForm(true);
          }}
          handleExportClick={handleExportCSV}
          exportTitle="Export Queries (CSV)"
        />

        {/* Custom Table Component (Connected directly to backend-paginated data) */}
        <Table
          columns={columns}
          tableData={queries}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          handleChangePage={(newPage) => setPage(newPage)}
          handleChangeRowsPerPage={(newRows) => {
            setRowsPerPage(newRows);
            setPage(0);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={(newSort) => {
            setSortBy(newSort);
            setPage(0);
          }}
          setSortOrder={(newOrder) => {
            setSortOrder(newOrder);
            setPage(0);
          }}
          isCheckBox={true}
          isSno={false}
          handleItemClick={(item) => {
            setSelectedQuery(item);
            setIsDrawerOpen(true);
          }}
          selectedRows={selectedRows}
          handleRowSelect={(id) => {
            setSelectedRows((prev) =>
              prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
            );
          }}
          handleSelectAllClick={() => {
            if (selectedRows.length === queries.length) {
              setSelectedRows([]);
            } else {
              setSelectedRows(queries.map((q) => q._id));
            }
          }}
          loading={isLoading}
          emptyText={emptyText}
        />
      </div>

      {/* ── CREATE / EDIT QUERY MODAL (Vecmocon 2-column layout) ── */}
      <CreateQueryModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditQuery(null);
        }}
        editQuery={editQuery}
        onSuccess={() => {
          fetchQueriesData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
        }}
      />

      {/* ── DELETE CONFIRMATION MODAL (Matching Vecmocon style) ── */}
      <DeleteModal
        deleteOpenModal={deleteOpen}
        headerTitle="Query"
        deleteTextname={queryToDelete ? `${queryToDelete.name} (${queryToDelete.phone})` : ""}
        handleCloseClick={() => {
          setDeleteOpen(false);
          setQueryToDelete(null);
        }}
        handleDeleteClick={handleConfirmDelete}
        loading={isDeleting}
      />

      {/* ── RIGHT DRAWER DETAILS (No tabs, module-specific) ── */}
      <RightDrawer
        openModal={isDrawerOpen}
        handleCloseRightModal={() => setIsDrawerOpen(false)}
        headingText={selectedQuery?.name || "Customer Query"}
        subheadingText={selectedQuery?.phone}
        badgeText={selectedQuery?.status}
        badgeBgColor={
          selectedQuery?.status === "resolved"
            ? "#DAF5ED"
            : selectedQuery?.status === "contacted"
              ? "#E5EBFD"
              : selectedQuery?.status === "pending"
                ? "#FEF3C7"
                : "#D8DDE7"
        }
        badgeTextColor={
          selectedQuery?.status === "resolved"
            ? "#006C4D"
            : selectedQuery?.status === "contacted"
              ? "#1249ED"
              : selectedQuery?.status === "pending"
                ? "#B45309"
                : "#565F70"
        }
        isMoreViewEdit={true}
        isMoreViewDelete={true}
        handleEditClick={() => {
          if (selectedQuery) {
            setIsDrawerOpen(false);
            setEditQuery(selectedQuery);
            setOpenForm(true);
          }
        }}
        handleDeleteClick={() => {
          if (selectedQuery) {
            setQueryToDelete(selectedQuery);
            setDeleteOpen(true);
          }
        }}
      >
        <QueryDrawerDetails
          query={selectedQuery}
          onStatusChange={handleStatusChange}
        />
      </RightDrawer>
    </div>
  );
}
