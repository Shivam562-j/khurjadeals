"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, useReducer } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types/product";
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
import { RightDrawer, ProductDrawerDetails } from "@/components/admin/Drawer";
import { CreateProductModal } from "@/components/admin/Forms";
import { DeleteModal } from "@/components/admin/Modal";
import {
  MdEdit,
  MdDeleteOutline,
  MdOpenInNew,
} from "react-icons/md";
import { toast } from "react-toastify";

// Filter configuration for Products matching Vecmocon filter drawer
const productFilterSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    gridCols: 3,
    options: [
      { label: "Active", value: "active" },
      { label: "Sold", value: "sold" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    id: "category",
    title: "Category",
    gridCols: 2,
    options: [
      { label: "Phones & Mobiles", value: "Phones & Mobiles" },
      { label: "Laptops & Computers", value: "Laptops & Computers" },
      { label: "Bikes & Scooters", value: "Bikes & Scooters" },
      { label: "Cars & Vehicles", value: "Cars & Vehicles" },
      { label: "Electric Vehicles", value: "Electric Vehicles" },
      { label: "Electrical Appliances", value: "Electrical Appliances" },
      { label: "Pottery & Ceramics", value: "Pottery & Ceramics" },
      { label: "Others", value: "Others" },
    ],
  },
  {
    id: "condition",
    title: "Condition",
    gridCols: 3,
    options: [
      { label: "New", value: "new" },
      { label: "Used", value: "used" },
      { label: "Refurbished", value: "refurbished" },
    ],
  },
];

export default function ProductsManager() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenAdd = searchParams.get("add") === "true";

  // Data State (backend paginated & filtered)
  const [products, setProducts] = useState<Product[]>([]);
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Delete Modal State
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Modal State (Create / Edit)
  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Fetch products from backend with server-side pagination, search, filter, and sorting
  const fetchProductsData = useCallback(
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
        q.set("isAdmin", "true");
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

        if (targetFilters?.category && targetFilters.category.length > 0) {
          q.set("category", targetFilters.category.join(","));
        }

        if (targetFilters?.condition && targetFilters.condition.length > 0) {
          q.set("condition", targetFilters.condition.join(","));
        }

        const res = await fetch(`/api/products?${q.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
          setTotalCount(data.total ?? data.count ?? (data.products?.length || 0));
        } else {
          setProducts([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
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
      JSON.stringify(prevFilterRef.current.category) !== JSON.stringify(filterFormData.category) ||
      JSON.stringify(prevFilterRef.current.condition) !== JSON.stringify(filterFormData.condition);

    const searchChanged = prevSearchRef.current !== activeSearch;

    if (filterChanged || searchChanged) {
      prevFilterRef.current = filterFormData;
      prevSearchRef.current = activeSearch;
      if (page !== 0) {
        setPage(0);
        return;
      }
    }

    fetchProductsData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
  }, [page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData, fetchProductsData]);

  // Handle search when user presses Enter key
  const handleSearchEnter = (searchValue: string) => {
    setPage(0);
    setActiveSearch(searchValue.trim());
    if (!searchValue.trim()) {
      dispatchSearch({ type: searchActions.RESET_SEARCH });
    }
  };

  useEffect(() => {
    if (shouldOpenAdd) {
      const paramTitle = searchParams.get("title") || "";
      const paramDesc = searchParams.get("description") || "";
      const paramName = searchParams.get("contactName") || "";
      const paramPhone = searchParams.get("contactPhone") || "";

      if (paramTitle || paramDesc || paramName || paramPhone) {
        setEditProduct({
          _id: "",
          title: paramTitle,
          description: paramDesc,
          category: "Others",
          condition: "used",
          status: "active",
          price: 0,
          location: "",
          contactName: paramName,
          contactPhone: paramPhone,
          isFeatured: false,
          images: [],
          views: 0,
          slug: "",
          createdAt: "",
          updatedAt: "",
        });
      } else {
        setEditProduct(null);
      }
      setOpenForm(true);
    }
  }, [shouldOpenAdd, searchParams]);

  // Active filters count
  const filterCount = useMemo(() => {
    return Object.values(filterFormData).reduce(
      (acc, arr) => acc + (arr?.length || 0),
      0
    );
  }, [filterFormData]);

  // Open modal for Adding
  const handleNewProductClick = () => {
    setEditProduct(null);
    setOpenForm(true);
  };

  // Open modal for Editing
  const handleEditClick = (prod: Product) => {
    setEditProduct(prod);
    setOpenForm(true);
  };

  // Open delete modal
  const handleOpenDelete = (prod: Product) => {
    setProductToDelete(prod);
    setDeleteOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted successfully.");
        if (selectedProduct?._id === productToDelete._id) {
          setIsDrawerOpen(false);
          setSelectedProduct(null);
        }
        fetchProductsData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to delete product.");
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  // Bulk Delete handler
  const handleBulkDeleteProducts = async () => {
    if (!selectedRows.length) return;
    const rowLength = selectedRows.length;
    try {
      await Promise.all(
        selectedRows.map((id) =>
          fetch(`/api/products/${id}`, { method: "DELETE" })
        )
      );
      setSelectedRows([]);
      toast.success(`${rowLength} asset profiles deleted successfully.`);
      fetchProductsData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
    } catch (err) {
      console.error("Bulk delete error:", err);
      toast.error("Failed to delete selected products.");
    }
  };

  // CSV Export (fetch all matching backend records for accurate export)
  const handleExportCSV = async () => {
    try {
      const q = new URLSearchParams();
      q.set("isAdmin", "true");
      q.set("page", "1");
      q.set("limit", "1000");
      if (sortBy) q.set("sortBy", sortBy);
      q.set("sortOrder", sortOrder ? "asc" : "desc");
      if (activeSearch.trim()) q.set("search", activeSearch.trim());
      if (filterFormData?.status?.length) q.set("status", filterFormData.status.join(","));
      if (filterFormData?.category?.length) q.set("category", filterFormData.category.join(","));
      if (filterFormData?.condition?.length) q.set("condition", filterFormData.condition.join(","));

      const res = await fetch(`/api/products?${q.toString()}`);
      const data = await res.json();
      const exportList: Product[] = data.products || products;

      if (!exportList.length) {
        toast.warning("No products found to export.");
        return;
      }
      const headers = [
        "Title",
        "Category",
        "Condition",
        "Price",
        "Location",
        "Contact Name",
        "Contact Phone",
        "Status",
      ];

      const rows = exportList.map((p) => [
        `"${(p.title || "").replace(/"/g, '""')}"`,
        `"${p.category || ""}"`,
        `"${p.condition || ""}"`,
        `"${p.price || 0}"`,
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
        `products_list_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${exportList.length} products exported successfully.`);
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Failed to export products.");
    }
  };

  // Table Columns Definition matching Vecmocon design
  const columns: TableColumn<Product>[] = [
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
      id: "category",
      label: "Category",
      key1: "category",
      isSortable: true,
      minWidth: "150px",
      render: (item) => (
        <span className="capitalize font-medium text-gray-700">
          {item.category}
        </span>
      ),
    },
    {
      id: "condition",
      label: "Condition",
      key1: "condition",
      isSortable: true,
      minWidth: "110px",
      render: (item) => {
        const cond = String(item.condition || "").toLowerCase();
        return (
          <span
            className={`capitalize font-semibold text-xs px-2 py-0.5 rounded ${
              cond === "new"
                ? "bg-[#DAF5ED] text-[#006C4D]"
                : cond === "refurbished"
                ? "bg-[#E5EBFD] text-[#1249ED]"
                : "bg-[#F3F5F8] text-[#555E6F] border border-[#D8DDE7]"
            }`}
          >
            {item.condition}
          </span>
        );
      },
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
      id: "contactName",
      label: "Seller / Contact",
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
              setSelectedProduct(item);
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
            title="Edit Product"
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
            title="Delete Product"
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
      ? "No products or category found."
      : "No products found. Click '+ New Product' to create your first listing!";

  return (
    <div className="p-4 sm:p-6 bg-[#f3f5f8] h-full w-full flex flex-col min-h-0">
      {/* ── MAIN DATA TABLE CARD (Exact layout: bg-[#fcfcfc] flex flex-col h-full rounded-lg) ── */}
      <div className="bg-[#fcfcfc] flex flex-col h-[600px] lg:h-full lg:flex-1 min-h-0 rounded-lg border border-[#E5E9F0] overflow-hidden shadow-xs">
        {/* TopHeader with title: Product List, search onEnter, filters, green 'New Product' button, and CSV Export */}
        <TopHeader
          title="Product List"
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
          filterSections={productFilterSections}
          refetch={() => setPage(0)}
          actionButtonText="New Product"
          actionButtonColor="green"
          handleActionClick={handleNewProductClick}
          handleExportClick={handleExportCSV}
          exportTitle="Export Products (CSV)"
          selectedCount={selectedRows.length}
          handleBulkDelete={handleBulkDeleteProducts}
        />

        {/* Custom Table Component (Connected directly to backend-paginated data) */}
        <Table
          columns={columns}
          tableData={products}
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
            setSelectedProduct(item);
            setIsDrawerOpen(true);
          }}
          selectedRows={selectedRows}
          handleRowSelect={(id) => {
            setSelectedRows((prev) =>
              prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
            );
          }}
          handleSelectAllClick={() => {
            if (selectedRows.length === products.length) {
              setSelectedRows([]);
            } else {
              setSelectedRows(products.map((p) => p._id));
            }
          }}
          loading={isLoading}
          emptyText={emptyText}
        />
      </div>

      {/* ── CREATE / EDIT PRODUCT MODAL (Vecmocon full 2-column layout) ── */}
      <CreateProductModal
        isOpen={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditProduct(null);
        }}
        editProduct={editProduct}
        onSuccess={() => {
          fetchProductsData(page, rowsPerPage, sortBy, sortOrder, activeSearch, filterFormData);
          if (shouldOpenAdd) {
            router.push("/admin/products");
          }
        }}
      />

      {/* ── DELETE CONFIRMATION MODAL (Matching Vecmocon style) ── */}
      <DeleteModal
        deleteOpenModal={deleteOpen}
        headerTitle="Product"
        deleteTextname={productToDelete?.title || ""}
        handleCloseClick={() => {
          setDeleteOpen(false);
          setProductToDelete(null);
        }}
        handleDeleteClick={handleConfirmDelete}
        loading={isDeleting}
      />

      {/* ── RIGHT DRAWER DETAILS (No tabs, module-specific) ── */}
      <RightDrawer
        openModal={isDrawerOpen}
        handleCloseRightModal={() => setIsDrawerOpen(false)}
        headingText={selectedProduct?.title || "Product Details"}
        subheadingText={selectedProduct?.location}
        badgeText={selectedProduct?.status}
        badgeBgColor={
          selectedProduct?.status === "active"
            ? "#DAF5ED"
            : selectedProduct?.status === "sold"
            ? "#FDE9E7"
            : "#D8DDE7"
        }
        badgeTextColor={
          selectedProduct?.status === "active"
            ? "#006C4D"
            : selectedProduct?.status === "sold"
            ? "#D51D10"
            : "#565F70"
        }
        isMoreViewEdit={true}
        isMoreViewDelete={true}
        handleEditClick={() => {
          if (selectedProduct) {
            setIsDrawerOpen(false);
            handleEditClick(selectedProduct);
          }
        }}
        handleDeleteClick={() => {
          if (selectedProduct) {
            handleOpenDelete(selectedProduct);
          }
        }}
      >
        <ProductDrawerDetails product={selectedProduct} />
      </RightDrawer>
    </div>
  );
}
