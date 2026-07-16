"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Property } from "@/types/property";
import Container from "@/components/layout/Container";
import PropertyFilter from "@/components/property/PropertyFilter";
import PropertyCard from "@/components/property/PropertyCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import Search from "@/components/common/Search";

function PropertiesList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state dynamically derived from URL
  const [filters, setFilters] = useState<any>({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    listingType: searchParams.get("listingType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Sync state with URL parameter changes (e.g., clicking quick categories)
  useEffect(() => {
    setFilters({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
      listingType: searchParams.get("listingType") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
    });
    setCurrentPage(1);
  }, [searchParams]);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.set("search", filters.search);
      if (filters.location) queryParams.set("location", filters.location);
      if (filters.type) queryParams.set("type", filters.type);
      if (filters.listingType) queryParams.set("listingType", filters.listingType);
      if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
      if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
      queryParams.set("page", String(currentPage));
      queryParams.set("limit", "9");

      const res = await fetch(`/api/properties?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
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
      <Container className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Properties in Khurja
          </h1>
          <p className="text-sm text-neutral-400">
            Browse verified commercial shops, residential plots, houses, and agricultural land in Khurja.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Search
              placeholder="Search by title, keywords..."
              initialValue={filters.search}
              onSearch={handleSearch}
            />
          </div>
          <PropertyFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </Container>

      {/* Grid List */}
      <Container>
        {isLoading ? (
          <Loader size="lg" />
        ) : properties.length === 0 ? (
          <EmptyState
            title="No properties found"
            description="We couldn't find any properties matching your current search criteria. Try removing filters."
            actionText="Reset All Filters"
            onAction={() => {
              setFilters({
                search: "",
                location: "",
                type: "",
                listingType: "",
                minPrice: "",
                maxPrice: "",
              });
              setCurrentPage(1);
            }}
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
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

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Loader size="lg" />}>
      <PropertiesList />
    </Suspense>
  );
}
