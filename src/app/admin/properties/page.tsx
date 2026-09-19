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
import {
  MdEdit,
  MdDeleteOutline,
  MdOpenInNew,
  MdHome,
} from "react-icons/md";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import Select from "@/components/common/Select";
import Modal from "@/components/common/Modal";

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

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("residential");
  const [listingType, setListingType] = useState("sell");
  const [status, setStatus] = useState("active");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [areaUnit, setAreaUnit] = useState("sqft");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
      const paramTitle = searchParams.get("title") || "";
      const paramDesc = searchParams.get("description") || "";
      const paramName = searchParams.get("contactName") || "";
      const paramPhone = searchParams.get("contactPhone") || "";

      setEditingId(null);
      setTitle(paramTitle);
      setDescription(paramDesc);
      setType("residential");
      setListingType("sell");
      setStatus("active");
      setPrice("");
      setArea("");
      setAreaUnit("sqft");
      setLocation("");
      setAddress("");
      setContactName(paramName);
      setContactPhone(paramPhone);
      setIsFeatured(false);
      setFeatures("");
      setImages([]);
      setIsModalOpen(true);
    }
  }, [shouldOpenAdd, searchParams]);

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
  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setType("residential");
    setListingType("sell");
    setStatus("active");
    setPrice("");
    setArea("");
    setAreaUnit("sqft");
    setLocation("");
    setAddress("");
    setContactName("");
    setContactPhone("");
    setIsFeatured(false);
    setFeatures("");
    setImages([]);
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEdit = (prop: Property) => {
    setEditingId(prop._id);
    setTitle(prop.title);
    setDescription(prop.description);
    setType(prop.type);
    setListingType(prop.listingType);
    setStatus(prop.status);
    setPrice(String(prop.price));
    setArea(String(prop.area));
    setAreaUnit(prop.areaUnit);
    setLocation(prop.location);
    setAddress(prop.address || "");
    setContactName(prop.contactName);
    setContactPhone(prop.contactPhone);
    setIsFeatured(prop.isFeatured || false);
    setFeatures(prop.features ? prop.features.join(", ") : "");
    setImages(prop.images || []);
    setIsModalOpen(true);
  };

  // Delete property
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProperties(properties.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete property:", err);
    }
  };

  // Image Upload
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls]);
    setIsUploading(false);
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    const propertyPayload = {
      title,
      description,
      type,
      listingType,
      status,
      price: Number(price),
      area: Number(area),
      areaUnit,
      location,
      address,
      contactName,
      contactPhone,
      isFeatured,
      features: features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      images,
    };

    try {
      const url = editingId
        ? `/api/properties/${editingId}`
        : "/api/properties";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyPayload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProperties();
        if (shouldOpenAdd) {
          router.push("/admin/properties");
        }
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save property");
      }
    } catch (err) {
      console.error("Save error:", err);
    }
    setIsSubmitLoading(false);
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
          {/* View Details / Open Link */}
          <a
            href={`/property/${item._id}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-[#E5E9F0] hover:text-gray-900 transition-colors"
            title="View Property Page"
          >
            <MdOpenInNew className="text-base" />
          </a>

          {/* Edit Action (matching screenshot pencil) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(item);
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
              handleDelete(item._id);
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
          handleActionClick={handleOpenAdd}
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

      {/* ── ADD / EDIT PROPERTY MODAL ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Property" : "Add New Property"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Property Title *"
            placeholder="e.g. 100 Gaj Commercial Shop on G.T. Road"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextArea
            label="Description *"
            placeholder="Describe the property highlights..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Property Type *"
              options={typeOptions}
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <Select
              label="Purpose *"
              options={listingOptions}
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Asking Price (₹) *"
              type="number"
              placeholder="e.g. 1800000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Select
              label="Status *"
              options={statusOptions}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Area (Size) *"
              type="number"
              placeholder="e.g. 100"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
            />
            <Select
              label="Area Unit *"
              options={areaUnitOptions}
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value)}
              required
            />
          </div>

          <Input
            label="Location (General Area) *"
            placeholder="e.g. GT Road, near Junction"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <Input
            label="Exact Address"
            placeholder="e.g. Shop 14, Main Bazaar Road, Khurja"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Name *"
              placeholder="Owner or Agent name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <Input
              label="Contact Mobile *"
              placeholder="10 digit number"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Features / Amenities"
            placeholder="Separated by comma, e.g. Water supply, Parking, Main Road face"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />

          {/* Image Upload field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Images ({images.length} uploaded)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full text-xs text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E5E9F0] file:text-[#252A34] hover:file:bg-[#D8DDE7] cursor-pointer"
            />
            {isUploading && (
              <p className="text-xs text-[#008761] animate-pulse">
                Uploading images to Cloudinary...
              </p>
            )}

            {/* Uploaded previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 border border-gray-200"
                  >
                    <img
                      src={img}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="absolute top-0 right-0 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-bl font-bold cursor-pointer"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 py-2">
            <input
              id="isFeatured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#009E71] focus:ring-[#009E71] cursor-pointer accent-[#009E71]"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-gray-800 cursor-pointer"
            >
              Mark as Featured Listing
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitLoading}>
              Save Property
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
