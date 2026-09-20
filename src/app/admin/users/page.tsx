"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, useReducer } from "react";
import { User, UserRole, UserStatus } from "@/types/user";
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
import { RightDrawer, UserDrawerDetails } from "@/components/admin/Drawer";
import { CreateUserModal } from "@/components/admin/Forms";
import { DeleteModal } from "@/components/admin/Modal";
import {
  MdEdit,
  MdDeleteOutline,
  MdOpenInNew,
  MdShield,
} from "react-icons/md";
import { toast } from "react-toastify";

// Filter configuration for Administrators
const userFilterSections: FilterSection[] = [
  {
    id: "role",
    title: "System Role",
    gridCols: 2,
    options: [
      { label: "Administrator", value: "admin" },
      { label: "Moderator", value: "moderator" },
    ],
  },
  {
    id: "status",
    title: "Account Status",
    gridCols: 2,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
];

export default function UsersManager() {
  // Data State (backend paginated & filtered)
  const [users, setUsers] = useState<User[]>([]);
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Modal State (Create / Edit)
  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Fetch users from backend with server-side pagination, search, filter, and sorting
  const fetchUsersData = useCallback(
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

        if (targetFilters?.role && targetFilters.role.length > 0) {
          q.set("role", targetFilters.role.join(","));
        }

        if (targetFilters?.status && targetFilters.status.length > 0) {
          q.set("status", targetFilters.status.join(","));
        }

        const res = await fetch(`/api/users?${q.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsers(data);
            setTotalCount(data.length);
          } else {
            setUsers(data.users || []);
            setTotalCount(data.total ?? data.count ?? (data.users?.length || 0));
          }
        } else {
          setUsers([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch administrators:", err);
        setUsers([]);
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
      JSON.stringify(prevFilterRef.current.role) !== JSON.stringify(filterFormData.role) ||
      JSON.stringify(prevFilterRef.current.status) !== JSON.stringify(filterFormData.status);

    const searchChanged = prevSearchRef.current !== activeSearch;

    if (filterChanged || searchChanged) {
      prevFilterRef.current = filterFormData;
      prevSearchRef.current = activeSearch;
      if (page !== 0) {
        setPage(0);
        return;
      }
    }

    fetchUsersData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
  }, [page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData, fetchUsersData]);

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
  const handleNewUserClick = () => {
    setEditUser(null);
    setOpenForm(true);
  };

  // Open modal for Editing
  const handleEditClick = (u: User) => {
    setEditUser(u);
    setOpenForm(true);
  };

  // Open delete modal
  const handleOpenDelete = (u: User) => {
    setUserToDelete(u);
    setDeleteOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${userToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Administrator deleted successfully.");
        if (selectedUser?._id === userToDelete._id) {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }
        fetchUsersData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to delete administrator.");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error("Failed to delete administrator.");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
      setUserToDelete(null);
    }
  };

  // Bulk Delete handler
  const handleBulkDeleteUsers = async () => {
    if (!selectedRows.length) return;
    const rowLength = selectedRows.length;
    try {
      await Promise.all(
        selectedRows.map((id) =>
          fetch(`/api/users/${id}`, { method: "DELETE" })
        )
      );
      setSelectedRows([]);
      toast.success(`${rowLength} asset profiles deleted successfully.`);
      fetchUsersData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("Failed to delete selected administrators.");
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
      if (filterFormData?.role?.length) q.set("role", filterFormData.role.join(","));
      if (filterFormData?.status?.length) q.set("status", filterFormData.status.join(","));

      const res = await fetch(`/api/users?${q.toString()}`);
      const data = await res.json();
      const exportList: User[] = Array.isArray(data) ? data : data.users || users;

      if (!exportList.length) {
        toast.warning("No administrators found to export.");
        return;
      }
      const headers = [
        "Full Name",
        "Email Address",
        "Role",
        "Status",
        "Created At",
      ];

      const rows = exportList.map((item) => [
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${(item.email || "").replace(/"/g, '""')}"`,
        `"${item.role || ""}"`,
        `"${item.status || ""}"`,
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
        `administrators_list_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${exportList.length} administrators exported successfully.`);
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Failed to export administrators.");
    }
  };

  // Table Columns Definition matching Vecmocon design
  const columns: TableColumn<User>[] = [
    {
      id: "name",
      label: "Administrator",
      key1: "name",
      isSortable: true,
      minWidth: "220px",
      render: (item) => {
        const initials = item.name
          ? item.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
          : "AD";

        return (
          <div className="flex items-center gap-2.5 py-0.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e8590c] to-[#f59e0b] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {initials}
            </div>
            <div className="truncate">
              <span
                className="font-semibold text-white block truncate"
                title={item.name}
              >
                {item.name}
              </span>
              <span className="text-[11px] text-[#a3a3a3] block truncate font-mono">
                {item.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: "email",
      label: "Email Address",
      key1: "email",
      isSortable: true,
      minWidth: "180px",
      render: (item) => (
        <span className="font-mono text-xs text-[#d4d4d4] font-medium">
          {item.email}
        </span>
      ),
    },
    {
      id: "role",
      label: "Role",
      key1: "role",
      isSortable: true,
      minWidth: "130px",
      render: (item) => {
        const isAdmin = item.role === "admin";
        return (
          <span
            className={`inline-flex items-center gap-1 capitalize font-bold text-xs px-2.5 py-0.5 rounded-full border ${
              isAdmin
                ? "bg-amber-950/60 text-amber-400 border-amber-800/60"
                : "bg-blue-950/60 text-blue-400 border-blue-800/60"
            }`}
          >
            <MdShield className="text-xs" />
            {item.role === "admin" ? "Admin" : "Moderator"}
          </span>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      key1: "status",
      isSortable: true,
      minWidth: "110px",
      render: (item) => {
        const s = String(item.status || "").toLowerCase();
        if (s === "active") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              Active
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800/80 text-zinc-400 border border-zinc-700/60">
            {item.status || "Inactive"}
          </span>
        );
      },
    },
    {
      id: "action",
      label: "Actions",
      key1: "_id",
      type: "action",
      minWidth: "130px",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          {/* View Details in Drawer (External Click) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(item);
              setIsDrawerOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#262626] hover:text-[#f59e0b] transition-colors cursor-pointer"
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#262626] hover:text-[#f59e0b] transition-colors cursor-pointer"
            title="Edit User"
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
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-red-950/50 hover:text-red-400 transition-colors cursor-pointer"
            title="Delete User"
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
      ? "No administrators or roles found."
      : "No administrators found. Click '+ New Administrator' to add one!";

  return (
    <div className="p-4 sm:p-6 bg-[#0d0d0d] h-full w-full flex flex-col min-h-0">
      {/* ── MAIN DATA TABLE CARD ── */}
      <div className="bg-[#171717] flex flex-col h-[600px] lg:h-full lg:flex-1 min-h-0 rounded-xl border border-[#262626] overflow-hidden shadow-2xl">
        {/* TopHeader with title: Administrators, search onEnter, filters, orange 'New Administrator' button, and CSV Export */}
        <TopHeader
          title="Administrators"
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
          filterSections={userFilterSections}
          refetch={() => setPage(0)}
          actionButtonText="New Administrator"
          actionButtonColor="green"
          handleActionClick={handleNewUserClick}
          handleExportClick={handleExportCSV}
          exportTitle="Export Administrators (CSV)"
          selectedCount={selectedRows.length}
          handleBulkDelete={handleBulkDeleteUsers}
        />

        {/* Custom Table Component (Connected directly to backend-paginated data) */}
        <Table
          columns={columns}
          tableData={users}
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
            setSelectedUser(item);
            setIsDrawerOpen(true);
          }}
          selectedRows={selectedRows}
          handleRowSelect={(id) => {
            setSelectedRows((prev) =>
              prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
            );
          }}
          handleSelectAllClick={() => {
            if (selectedRows.length === users.length) {
              setSelectedRows([]);
            } else {
              setSelectedRows(users.map((u) => u._id));
            }
          }}
          loading={isLoading}
          emptyText={emptyText}
        />
      </div>

      {/* ── CREATE / EDIT USER MODAL (Vecmocon 2-column layout) ── */}
      <CreateUserModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditUser(null);
        }}
        editUser={editUser}
        onSuccess={() => {
          fetchUsersData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
        }}
      />

      {/* ── DELETE CONFIRMATION MODAL (Matching Vecmocon style) ── */}
      <DeleteModal
        deleteOpenModal={deleteOpen}
        headerTitle="Administrator"
        deleteTextname={userToDelete ? `${userToDelete.name} (${userToDelete.email})` : ""}
        handleCloseClick={() => {
          setDeleteOpen(false);
          setUserToDelete(null);
        }}
        handleDeleteClick={handleConfirmDelete}
        loading={isDeleting}
      />

      {/* ── RIGHT DRAWER DETAILS (No tabs, module-specific) ── */}
      <RightDrawer
        openModal={isDrawerOpen}
        handleCloseRightModal={() => setIsDrawerOpen(false)}
        headingText={selectedUser?.name || "Administrator Profile"}
        subheadingText={selectedUser?.email}
        badgeText={selectedUser?.role}
        badgeBgColor={
          selectedUser?.role === "admin"
            ? "#FEF3C7"
            : "#E5EBFD"
        }
        badgeTextColor={
          selectedUser?.role === "admin"
            ? "#B45309"
            : "#1249ED"
        }
        isMoreViewEdit={true}
        isMoreViewDelete={true}
        handleEditClick={() => {
          if (selectedUser) {
            setIsDrawerOpen(false);
            handleEditClick(selectedUser);
          }
        }}
        handleDeleteClick={() => {
          if (selectedUser) {
            handleOpenDelete(selectedUser);
          }
        }}
      >
        <UserDrawerDetails user={selectedUser} />
      </RightDrawer>
    </div>
  );
}
