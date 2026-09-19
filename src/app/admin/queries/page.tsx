"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, useReducer } from "react";
import Link from "next/link";
import { Query, QueryStatus } from "@/types/query";
import {
  initialSearchState,
  searchActions,
  searchReducer,
} from "@/reducer/searchReducer";
import {
  Table,
  TopHeader,
  TableColumn,
  FilterFormData,
  FilterSection,
} from "@/components/admin/Tables";
import { RightDrawer, QueryDrawerDetails } from "@/components/admin/Drawer";
import { CreateQueryModal } from "@/components/admin/Forms";
import { DeleteModal } from "@/components/admin/Modal";
import {
  MdEdit,
  MdDeleteOutline,
  MdOpenInNew,
  MdHome,
  MdShoppingBag,
} from "react-icons/md";

// Filter configuration for Customer Queries
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

export default function QueriesManager() {
  // Data State (backend paginated & filtered)
  const [queries, setQueries] = useState<Query[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Search input state with reducer (onEnter search execution)
  const [searchState, dispatchSearch] = useReducer(searchReducer, {
    ...initialSearchState,
    searchText: "",
  });
  const { searchInput, searchText, cacheSearchText } = searchState;
  const [activeSearch, setActiveSearch] = useState("");
  const [filterFormData, setFilterFormData] = useState<FilterFormData>({});

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<boolean>(false); // false = desc
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Drawer State
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Modal State (Create / Edit)
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
        console.error("Failed to fetch queries:", err);
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

  // Fetch data when pagination, sorting, activeSearch (onEnter), or filters change
  useEffect(() => {
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

  // Open modal for Adding
  const handleNewQueryClick = () => {
    setEditQuery(null);
    setOpenForm(true);
  };

  // Open modal for Editing
  const handleEditClick = (item: Query) => {
    setEditQuery(item);
    setOpenForm(true);
  };

  // Open delete modal
  const handleOpenDelete = (item: Query) => {
    setQueryToDelete(item);
    setDeleteOpen(true);
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
      }
    } catch (err) {
      console.error("Failed to update status:", err);
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
        if (selectedQuery?._id === queryToDelete._id) {
          setIsDrawerOpen(false);
          setSelectedQuery(null);
        }
        fetchQueriesData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
      }
    } catch (err) {
      console.error("Failed to delete query:", err);
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
      setQueryToDelete(null);
    }
  };

  // CSV Export
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
        alert("No queries to export.");
        return;
      }
      const headers = [
        "Customer Name",
        "Phone",
        "Email",
        "Type",
        "Status",
        "Message",
        "Date",
      ];

      const rows = exportList.map((item) => [
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${item.phone || ""}"`,
        `"${(item.email || "").replace(/"/g, '""')}"`,
        `"${item.type || ""}"`,
        `"${item.status || ""}"`,
        `"${(item.message || "").replace(/"/g, '""')}"`,
        `"${item.createdAt || ""}"`,
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `customer_queries_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export error:", e);
    }
  };

  // Table Columns Definition matching Vecmocon design
  const columns: TableColumn<Query>[] = [
    {
      id: "name",
      label: "Customer",
      key1: "name",
      isSortable: true,
      minWidth: "200px",
      render: (item) => (
        <div className="truncate py-0.5">
          <span
            className="font-semibold text-gray-900 block truncate"
            title={item.name}
          >
            {item.name}
          </span>
          {item.email && (
            <span className="text-[11px] text-gray-500 block truncate">
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
          className="font-mono text-xs text-[#008761] hover:underline font-semibold"
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
      minWidth: "120px",
      render: (item) => (
        <span className="capitalize font-semibold text-xs px-2.5 py-1 rounded bg-[#F3F5F8] border border-[#D8DDE7] text-gray-800">
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
          className="text-xs text-gray-600 block truncate max-w-sm"
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DAF5ED] text-[#006C4D]">
              Resolved
            </span>
          );
        }
        if (s === "contacted") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E5EBFD] text-[#1249ED]">
              Contacted
            </span>
          );
        }
        if (s === "pending") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309]">
              Pending
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D8DDE7] text-[#565F70]">
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
      minWidth: "190px",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          {/* Quick Convert link if property */}
          {item.type === "property" && (
            <Link
              href={`/admin/properties?add=true&title=${encodeURIComponent("Listing from " + item.name)}&description=${encodeURIComponent(item.message)}&contactName=${encodeURIComponent(item.name)}&contactPhone=${encodeURIComponent(item.phone)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold text-[#008761] bg-[#DAF5ED] hover:bg-[#c2edd0] px-2 py-1 rounded transition-colors"
              title="Convert to Property Listing"
            >
              + Property
            </Link>
          )}

          {/* Quick Convert link if product */}
          {item.type === "product" && (
            <Link
              href={`/admin/products?add=true&title=${encodeURIComponent("Listing from " + item.name)}&description=${encodeURIComponent(item.message)}&contactName=${encodeURIComponent(item.name)}&contactPhone=${encodeURIComponent(item.phone)}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-bold text-blue-600 bg-[#E5EBFD] hover:bg-[#d0ddfc] px-2 py-1 rounded transition-colors"
              title="Convert to Bazaar Product"
            >
              + Product
            </Link>
          )}

          {/* View Details in Drawer (External Click) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedQuery(item);
              setIsDrawerOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#E5E9F0] hover:text-[#008761] transition-colors cursor-pointer"
            title="View Details in Drawer"
          >
            <MdOpenInNew className="text-base" />
          </button>

          {/* Edit Action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#E5E9F0] hover:text-[#008761] transition-colors cursor-pointer"
            title="Edit Query"
          >
            <MdEdit className="text-base" />
          </button>

          {/* Delete Action */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDelete(item);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#FDE9E7] hover:text-[#D51D10] transition-colors cursor-pointer"
            title="Delete Query"
          >
            <MdDeleteOutline className="text-base" />
          </button>
        </div>
      ),
    },
  ];

  // Empty text based on whether search/filter or database is empty
  const isFilteredOrSearched = Boolean(activeSearch.trim()) || filterCount > 0;
  const emptyText =
    isFilteredOrSearched
      ? "No queries or status found."
      : "No queries found. Click '+ New Query' to log an enquiry!";

  return (
    <div className="p-4 sm:p-6 bg-[#f3f5f8] h-full w-full flex flex-col min-h-0">
      {/* ── MAIN DATA TABLE CARD (Exact layout: bg-[#fcfcfc] flex flex-col h-full rounded-lg) ── */}
      <div className="bg-[#fcfcfc] flex flex-col h-[600px] lg:h-full lg:flex-1 min-h-0 rounded-lg border border-[#E5E9F0] overflow-hidden shadow-xs">
        {/* TopHeader with title: Customer Queries, search onEnter, filters, green 'New Query' button, and CSV Export */}
        <TopHeader
          title="Customer Queries"
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
          handleActionClick={handleNewQueryClick}
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
            handleEditClick(selectedQuery);
          }
        }}
        handleDeleteClick={() => {
          if (selectedQuery) {
            handleOpenDelete(selectedQuery);
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
