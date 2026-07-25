"use client";
import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import Search from "@/components/common/Search";
import {
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaRupeeSign,
  FaChevronDown,
} from "react-icons/fa";

const LIMIT = 9;

const PROPERTY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Plot / Land", value: "plot" },
  { label: "Agricultural", value: "agricultural" },
];

const LISTING_TYPES = [
  { label: "All", value: "" },
  { label: "For Sale", value: "sell" },
  { label: "For Rent", value: "rent" },
  { label: "For Lease", value: "lease" },
];

function PropertiesList() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: "",
    type: "",
    listingType: "",
    minPrice: "",
    maxPrice: "",
  });

  // Filter panel local state
  const [localType, setLocalType] = useState("");
  const [localListingType, setLocalListingType] = useState("");
  const [localLocation, setLocalLocation] = useState("");
  const [localMin, setLocalMin] = useState("");
  const [localMax, setLocalMax] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  // Reset on filter change
  const applyFilters = () => {
    setFilters({ search: filters.search, location: localLocation, type: localType, listingType: localListingType, minPrice: localMin, maxPrice: localMax });
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
    setFilterOpen(false);
  };

  const clearFilters = () => {
    setLocalType(""); setLocalListingType(""); setLocalLocation("");
    setLocalMin(""); setLocalMax("");
    setFilters({ search: "", location: "", type: "", listingType: "", minPrice: "", maxPrice: "" });
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
    setFilterOpen(false);
  };

  const handleSearch = (q: string) => {
    setFilters((prev) => ({ ...prev, search: q }));
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
  };

  const fetchPage = useCallback(async (pageNum: number, currentFilters: typeof filters) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (currentFilters.search) q.set("search", currentFilters.search);
      if (currentFilters.location) q.set("location", currentFilters.location);
      if (currentFilters.type) q.set("type", currentFilters.type);
      if (currentFilters.listingType) q.set("listingType", currentFilters.listingType);
      if (currentFilters.minPrice) q.set("minPrice", currentFilters.minPrice);
      if (currentFilters.maxPrice) q.set("maxPrice", currentFilters.maxPrice);
      q.set("page", String(pageNum));
      q.set("limit", String(LIMIT));

      const res = await fetch(`/api/properties?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const newItems: Property[] = data.properties || [];
        setTotalCount(data.total || 0);
        if (pageNum === 1) {
          setProperties(newItems);
        } else {
          setProperties((prev) => [...prev, ...newItems]);
        }
        setHasMore(newItems.length === LIMIT);
        setIsFirstLoad(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Fetch when page or filters change
  useEffect(() => {
    fetchPage(page, filters);
  }, [page, filters, fetchPage]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoading]);

  const activeFilterCount = [filters.type, filters.listingType, filters.location, filters.minPrice, filters.maxPrice].filter(Boolean).length;

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Real Estate Directory</span>
          <h1 className="h1">Properties in Khurja</h1>
          <p className="lead">
            Browse verified commercial shops, residential plots, houses, and agricultural land in Khurja.
          </p>
        </div>
      </div>

      <section className="section-light">
        <div className="container">
          {/* Search + Filter Bar */}
          <div className="prop-search-bar">
            <div className="prop-search-input">
              <Search
                placeholder="Search by title, location, keywords..."
                initialValue={filters.search}
                onSearch={handleSearch}
              />
            </div>
            <button
              className={`prop-filter-toggle ${filterOpen ? "active" : ""} ${activeFilterCount > 0 ? "has-filters" : ""}`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FaFilter />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
              <FaChevronDown className={`filter-chevron ${filterOpen ? "open" : ""}`} />
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {filterOpen && (
            <div className="prop-filter-panel">
              <div className="prop-filter-grid">
                {/* Property Type */}
                <div className="filter-field">
                  <label className="filter-label">
                    <FaBuilding /> Property Type
                  </label>
                  <select className="filter-select" value={localType} onChange={(e) => setLocalType(e.target.value)}>
                    {PROPERTY_TYPES.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Purpose */}
                <div className="filter-field">
                  <label className="filter-label">
                    <FaTag /> Purpose
                  </label>
                  <select className="filter-select" value={localListingType} onChange={(e) => setLocalListingType(e.target.value)}>
                    {LISTING_TYPES.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="filter-field">
                  <label className="filter-label">
                    <FaMapMarkerAlt /> Location
                  </label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="e.g. GT Road, Khurja"
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                  />
                </div>

                {/* Min Price */}
                <div className="filter-field">
                  <label className="filter-label">
                    <FaRupeeSign /> Min Price
                  </label>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="e.g. 500000"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                  />
                </div>

                {/* Max Price */}
                <div className="filter-field">
                  <label className="filter-label">
                    <FaRupeeSign /> Max Price
                  </label>
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="e.g. 5000000"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button className="filter-clear-btn" onClick={clearFilters}>
                  <FaTimes /> Clear All
                </button>
                <button className="filter-apply-btn" onClick={applyFilters}>
                  Apply Filters
                  {activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="filter-chips">
              {filters.type && (
                <span className="filter-chip">
                  {PROPERTY_TYPES.find((t) => t.value === filters.type)?.label}
                  <button onClick={() => { setFilters((p) => ({ ...p, type: "" })); setLocalType(""); setProperties([]); setPage(1); setHasMore(true); setIsFirstLoad(true); }}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {filters.listingType && (
                <span className="filter-chip">
                  {LISTING_TYPES.find((t) => t.value === filters.listingType)?.label}
                  <button onClick={() => { setFilters((p) => ({ ...p, listingType: "" })); setLocalListingType(""); setProperties([]); setPage(1); setHasMore(true); setIsFirstLoad(true); }}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="filter-chip">
                  📍 {filters.location}
                  <button onClick={() => { setFilters((p) => ({ ...p, location: "" })); setLocalLocation(""); setProperties([]); setPage(1); setHasMore(true); setIsFirstLoad(true); }}>
                    <FaTimes />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="filter-chip">
                  ₹{filters.minPrice || "0"} – {filters.maxPrice || "∞"}
                  <button onClick={() => { setFilters((p) => ({ ...p, minPrice: "", maxPrice: "" })); setLocalMin(""); setLocalMax(""); setProperties([]); setPage(1); setHasMore(true); setIsFirstLoad(true); }}>
                    <FaTimes />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Result count */}
          {!isFirstLoad && properties.length > 0 && (
            <p className="result-count">
              Showing <strong>{properties.length}</strong> of <strong>{totalCount}</strong> properties
            </p>
          )}

          {/* Initial Loader */}
          {isFirstLoad && isLoading ? (
            <Loader size="lg" />
          ) : properties.length === 0 && !isLoading ? (
            <EmptyState
              title="No properties found"
              description="We couldn't find any properties matching your criteria. Try removing or changing filters."
              actionText="Reset All Filters"
              onAction={clearFilters}
            />
          ) : (
            <>
              {/* 3-column Grid */}
              <div className="listing-grid">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Infinite Scroll Sentinel */}
              <div ref={sentinelRef} className="scroll-sentinel" />

              {/* Loading more indicator */}
              {isLoading && !isFirstLoad && (
                <div className="load-more-spinner">
                  <div className="spinner" />
                  <span>Loading more properties...</span>
                </div>
              )}

              {/* End of results */}
              {!hasMore && properties.length > 0 && (
                <div className="scroll-end-msg">
                  ✓ All {properties.length} properties loaded
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Loader size="lg" />}>
      <PropertiesList />
    </Suspense>
  );
}
