"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Property } from "@/types/property";
import {
  Table,
  TopHeader,
  TableColumn,
  FilterFormData,
  FilterSection,
} from "@/components/admin/Tables";
import { RightDrawer, PropertyDrawerDetails } from "@/components/admin/Drawer";
import { CreatePropertyModal } from "@/components/admin/Forms";
import { DeleteModal } from "@/components/admin/Modal";
import {
  MdEdit,
  MdDeleteOutline,
  MdOpenInNew,
  MdHome,
} from "react-icons/md";

// Filter configuration for Properties
const propertyFilterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    gridCols: 2,
    options: [
      { label: "Active", value: "active" },
      { label: "Sold", value: "sold" },
      { label: "Rented", value: "rented" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    id: "type",
    title: "Property Type",
    gridCols: 2,
    options: [
      { label: "Residential", value: "residential" },
      { label: "Commercial", value: "commercial" },
      { label: "Plot", value: "plot" },
      { label: "Agricultural", value: "agricultural" },
    ],
  },
  {
    id: "listingType",
    title: "Purpose",
    gridCols: 3,
    options: [
      { label: "Sell", value: "sell" },
      { label: "Rent", value: "rent" },
      { label: "Lease", value: "lease" },
    ],
  },
];

export default function PropertiesManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenAdd = searchParams.get("add") === "true";

  // Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFormData, setFilterFormData] = useState<FilterFormData>({});

  // Pagination & Sorting State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<boolean>(false); // false = desc
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Drawer State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Modal State (Create / Edit)
  const [openForm, setOpenForm] = useState(false);
  const [editProperty, setEditProperty] = useState<Property | null>(null);

  // Fetch properties from backend
  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/properties?limit=200");
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
    if (shouldOpenAdd) {
      setEditProperty(null);
      setOpenForm(true);
    }
  }, [shouldOpenAdd]);

  // Reset page when search or filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, filterFormData]);

  // Count active filters
  const filterCount = Object.values(filterFormData).reduce(
    (acc, arr) => acc + (arr?.length || 0),
    0
  );

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        (prop.title && prop.title.toLowerCase().includes(q)) ||
        (prop.location && prop.location.toLowerCase().includes(q)) ||
        (prop.contactName && prop.contactName.toLowerCase().includes(q)) ||
        (prop.contactPhone && prop.contactPhone.includes(q));

      const matchesStatus =
        !filterFormData.status ||
        filterFormData.status.length === 0 ||
        filterFormData.status.includes(prop.status);

      const matchesType =
        !filterFormData.type ||
        filterFormData.type.length === 0 ||
        filterFormData.type.includes(prop.type);

      const matchesListingType =
        !filterFormData.listingType ||
        filterFormData.listingType.length === 0 ||
        filterFormData.listingType.includes(prop.listingType);

      return (
        matchesSearch && matchesStatus && matchesType && matchesListingType
      );
    });
  }, [properties, searchQuery, filterFormData]);

  // Sort properties
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      let valA = (a as any)[sortBy] ?? "";
      let valB = (b as any)[sortBy] ?? "";
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortOrder ? -1 : 1;
      if (valA > valB) return sortOrder ? 1 : -1;
      return 0;
    });
  }, [filteredProperties, sortBy, sortOrder]);

  // Paginated properties
  const totalItems = sortedProperties.length;
  const paginatedProperties = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedProperties.slice(start, start + rowsPerPage);
  }, [sortedProperties, page, rowsPerPage]);

  // Open modal for Adding
  const handleNewPropertyClick = () => {
    setEditProperty(null);
    setOpenForm(true);
  };

  // Open modal for Editing
  const handleEditClick = (prop: Property) => {
    setEditProperty(prop);
    setOpenForm(true);
  };

  // Open delete modal
  const handleOpenDelete = (prop: Property) => {
    setPropertyToDelete(prop);
    setDeleteOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/properties/${propertyToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.filter((p) => p._id !== propertyToDelete._id)
        );
        if (selectedProperty?._id === propertyToDelete._id) {
          setIsDrawerOpen(false);
          setSelectedProperty(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
      setPropertyToDelete(null);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!filteredProperties.length) {
      alert("No properties to export.");
      return;
    }
    const headers = [
      "Title",
      "Type",
      "Purpose",
      "Price",
      "Area",
      "Location",
      "Contact Name",
      "Contact Phone",
      "Status",
    ];
    const rows = filteredProperties.map((p) => [
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${p.type || ""}"`,
      `"${p.listingType || ""}"`,
      `"${p.price || 0}"`,
      `"${p.area || ""} ${p.areaUnit || ""}"`,
      `"${(p.location || "").replace(/"/g, '""')}"`,
      `"${(p.contactName || "").replace(/"/g, '""')}"`,
      `"${p.contactPhone || ""}"`,
      `"${p.status || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `properties_list_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Table Columns Definition matching user screenshot
  const columns: TableColumn<Property>[] = [
    {
      id: "title",
      label: "Name",
      key1: "title",
      isSortable: true,
      minWidth: "220px",
      render: (item) => (
        <div className="truncate py-0.5">
          <span
            className="font-semibold text-gray-900 block truncate"
            title={item.title}
          >
            {item.title}
          </span>
          {item.location && (
            <span className="text-[11px] text-gray-500 block truncate">
              {item.location}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "type",
      label: "Type",
      key1: "type",
      isSortable: true,
      minWidth: "120px",
      render: (item) => (
        <span className="capitalize font-medium text-gray-700">
          {item.type}
        </span>
      ),
    },
    {
      id: "listingType",
      label: "Purpose",
      key1: "listingType",
      isSortable: true,
      minWidth: "100px",
      render: (item) => (
        <span className="capitalize font-semibold text-gray-800">
          {item.listingType}
        </span>
      ),
    },
    {
      id: "price",
      label: "Price",
      key1: "price",
      isSortable: true,
      minWidth: "130px",
      render: (item) => (
        <span className="font-bold text-[#008761]">
          ₹{Number(item.price).toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      id: "area",
      label: "Area",
      key1: "area",
      isSortable: true,
      minWidth: "120px",
      render: (item) => (
        <span className="text-gray-600 font-medium">
          {item.area} {item.areaUnit}
        </span>
      ),
    },
    {
      id: "contactName",
      label: "Contact",
      key1: "contactName",
      minWidth: "150px",
      render: (item) => (
        <div className="truncate text-xs">
          <span className="font-medium text-gray-800 block truncate">
            {item.contactName || "—"}
          </span>
          <span className="text-gray-500 font-mono text-[11px]">
            {item.contactPhone || ""}
          </span>
        </div>
      ),
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DAF5ED] text-[#006C4D]">
              Active
            </span>
          );
        }
        if (s === "sold") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDE9E7] text-[#D51D10]">
              Sold
            </span>
          );
        }
        if (s === "rented") {
          return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E5EBFD] text-[#1249ED]">
              Rented
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D8DDE7] text-[#565F70]">
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
              setSelectedProperty(item);
              setIsDrawerOpen(true);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#E5E9F0] hover:text-[#008761] transition-colors cursor-pointer"
            title="View Details in Drawer"
          >
            <MdOpenInNew className="text-base" />
          </button>

          {/* Edit Action (matching screenshot pencil) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(item);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#E5E9F0] hover:text-[#008761] transition-colors cursor-pointer"
            title="Edit Property"
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
            title="Delete Property"
          >
            <MdDeleteOutline className="text-base" />
          </button>
        </div>
      ),
    },
  ];

  // Options for Add/Edit Form
  const typeOptions = [
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Plot", value: "plot" },
    { label: "Agricultural", value: "agricultural" },
  ];

  const listingOptions = [
    { label: "Sell", value: "sell" },
    { label: "Rent", value: "rent" },
    { label: "Lease", value: "lease" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Sold", value: "sold" },
    { label: "Rented", value: "rented" },
    { label: "Inactive", value: "inactive" },
  ];

  const areaUnitOptions = [
    { label: "Sq. Ft", value: "sqft" },
    { label: "Sq. Yard", value: "sqyd" },
    { label: "Acre", value: "acre" },
    { label: "Bigha", value: "bigha" },
  ];

  // Empty text based on whether database is empty or search/filter returned 0 results
  const emptyText =
    properties.length === 0
      ? "No properties found. Click '+ New Property' to create your first listing!"
      : "No properties or type found.";

  return (
    <div className="p-4 sm:p-6 bg-[#f3f5f8] h-full w-full flex flex-col min-h-0">
      {/* ── MAIN DATA TABLE CARD (Exact layout: bg-[#fcfcfc] flex flex-col h-full rounded-lg) ── */}
      <div className="bg-[#fcfcfc] flex flex-col h-[600px] lg:h-full lg:flex-1 min-h-0 rounded-lg border border-[#E5E9F0] overflow-hidden shadow-xs">
        {/* TopHeader with title: Property List, search, filters, green 'New Property' button, and CSV Export */}
        <TopHeader
          title="Property List"
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
          filterSections={propertyFilterSections}
          actionButtonText="New Property"
          actionButtonColor="green"
          handleActionClick={handleNewPropertyClick}
          handleExportClick={handleExportCSV}
          exportTitle="Export Properties (CSV)"
        />

        {/* Custom Table Component */}
        <Table
          columns={columns}
          tableData={paginatedProperties}
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
          handleItemClick={(item) => {
            setSelectedProperty(item);
            setIsDrawerOpen(true);
          }}
          selectedRows={selectedRows}
          handleRowSelect={(id) => {
            setSelectedRows((prev) =>
              prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
            );
          }}
          handleSelectAllClick={() => {
            if (selectedRows.length === paginatedProperties.length) {
              setSelectedRows([]);
            } else {
              setSelectedRows(paginatedProperties.map((p) => p._id));
            }
          }}
          loading={isLoading}
          emptyText={emptyText}
        />
      </div>

      {/* ── CREATE / EDIT PROPERTY MODAL (Vecmocon full-width layout) ── */}
      <CreatePropertyModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditProperty(null);
        }}
        editProperty={editProperty}
        onSuccess={() => {
          fetchProperties();
          if (shouldOpenAdd) {
            router.push("/admin/properties");
          }
        }}
      />

      {/* ── DELETE CONFIRMATION MODAL (Matching Vecmocon style) ── */}
      <DeleteModal
        deleteOpenModal={deleteOpen}
        headerTitle="Property"
        deleteTextname={propertyToDelete?.title || ""}
        handleCloseClick={() => {
          setDeleteOpen(false);
          setPropertyToDelete(null);
        }}
        handleDeleteClick={handleConfirmDelete}
        loading={isDeleting}
      />

      {/* ── RIGHT DRAWER DETAILS (No tabs, module-specific) ── */}
      <RightDrawer
        openModal={isDrawerOpen}
        handleCloseRightModal={() => setIsDrawerOpen(false)}
        headingText={selectedProperty?.title || "Property Details"}
        subheadingText={selectedProperty?.location}
        badgeText={selectedProperty?.status}
        badgeBgColor={
          selectedProperty?.status === "active"
            ? "#DAF5ED"
            : selectedProperty?.status === "sold"
            ? "#FDE9E7"
            : selectedProperty?.status === "rented"
            ? "#E5EBFD"
            : "#D8DDE7"
        }
        badgeTextColor={
          selectedProperty?.status === "active"
            ? "#006C4D"
            : selectedProperty?.status === "sold"
            ? "#D51D10"
            : selectedProperty?.status === "rented"
            ? "#1249ED"
            : "#565F70"
        }
        isMoreViewEdit={true}
        isMoreViewDelete={true}
        handleEditClick={() => {
          if (selectedProperty) {
            setIsDrawerOpen(false);
            handleEditClick(selectedProperty);
          }
        }}
        handleDeleteClick={() => {
          if (selectedProperty) {
            handleOpenDelete(selectedProperty);
          }
        }}
      >
        <PropertyDrawerDetails property={selectedProperty} />
      </RightDrawer>
    </div>
  );
}
