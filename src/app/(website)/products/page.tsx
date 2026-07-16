"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/product";
import Container from "@/components/layout/Container";
import ProductFilter from "@/components/product/ProductFilter";
import ProductCard from "@/components/product/ProductCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import Search from "@/components/common/Search";

function ProductsList() {
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state dynamically derived from URL
  const [filters, setFilters] = useState<any>({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    condition: searchParams.get("condition") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Sync state with URL parameter changes (e.g., clicking quick categories)
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      category: searchParams.get("category") || "",
      condition: searchParams.get("condition") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });
    setCurrentPage(1);
  }, [searchParams]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set("search", filters.search);
      if (filters.location) queryParams.set("location", filters.location);
      if (filters.category) queryParams.set("category", filters.category);
      if (filters.condition) queryParams.set("condition", filters.condition);
      if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
      queryParams.set("page", String(currentPage));
      queryParams.set("limit", "12");

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev: any) => ({
      ...prev,
      ...newFilters,
    }));
    setCurrentPage(1); // reset to page 1
  };

  const handleSearch = (query: string) => {
    setFilters((prev: any) => ({
      ...prev,
      search: query,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="py-12 space-y-10">
      <Container className="space-y-6 max-w-6xl mx-auto pt-12 pb-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Marketplace & Khurja Pottery
          </h1>
          <p className="text-sm text-neutral-400">
            Discover local products, used vehicles, household appliances, and the famous Khurja ceramic pottery directly from local sellers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Search
              placeholder="Search products, pottery, categories..."
              initialValue={filters.search}
              onSearch={handleSearch}
            />
          </div>
          <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </Container>

      {/* Grid List */}
      <Container>
        {isLoading ? (
          <Loader size="lg" />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="We couldn't find any products matching your current search criteria. Try removing filters."
            actionText="Reset All Filters"
            onAction={() => {
              setFilters({
                search: "",
                location: "",
                category: "",
                condition: "",
                minPrice: "",
                maxPrice: "",
              });
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </Container>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader size="lg" />}>
      <ProductsList />
    </Suspense>
  );
}
