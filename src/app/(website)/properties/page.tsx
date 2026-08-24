"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaRupeeSign,
  FaChevronDown,
  FaSlidersH,
  FaUndo,
  FaPlusCircle,
  FaCheck,
  FaPlus,
} from "react-icons/fa";

const LIMIT = 15;

const PROPERTY_TYPES = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Plot / Land", value: "plot" },
  { label: "Agricultural", value: "agricultural" },
];

const LISTING_TYPES = [
  { label: "For Sale", value: "sell" },
  { label: "For Rent", value: "rent" },
  { label: "For Lease", value: "lease" },
];

function PropertiesList() {
  const searchParams = useSearchParams();

  // Multi-select filters state (Arrays)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    searchParams.get("type") ? searchParams.get("type")!.split(",").filter(Boolean) : []
  );
  const [selectedListings, setSelectedListings] = useState<string[]>(
    searchParams.get("listingType") ? searchParams.get("listingType")!.split(",").filter(Boolean) : []
  );

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Debounce search query to prevent excessive API requests
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Local state for expanded filter card
  const [localTypes, setLocalTypes] = useState<string[]>(selectedTypes);
  const [localListings, setLocalListings] = useState<string[]>(selectedListings);
  const [localLocation, setLocalLocation] = useState(locationInput);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const [filterOpen, setFilterOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Sync with URL params
  useEffect(() => {
    const typeFromUrl = searchParams.get("type") ? searchParams.get("type")!.split(",").filter(Boolean) : [];
    const listingFromUrl = searchParams.get("listingType") ? searchParams.get("listingType")!.split(",").filter(Boolean) : [];
    const searchFromUrl = searchParams.get("search") || "";
    const locFromUrl = searchParams.get("location") || "";
    const minFromUrl = searchParams.get("minPrice") || "";
    const maxFromUrl = searchParams.get("maxPrice") || "";

    setSelectedTypes(typeFromUrl);
    setLocalTypes(typeFromUrl);
    setSelectedListings(listingFromUrl);
    setLocalListings(listingFromUrl);
    setSearchQuery(searchFromUrl);
    setLocationInput(locFromUrl);
    setLocalLocation(locFromUrl);
    setMinPrice(minFromUrl);
    setLocalMin(minFromUrl);
    setMaxPrice(maxFromUrl);
    setLocalMax(maxFromUrl);
  }, [searchParams]);

  // TanStack Query useInfiniteQuery with cursor-based fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      "properties",
      debouncedSearch,
      selectedTypes,
      selectedListings,
      locationInput,
      minPrice,
      maxPrice,
    ],
    queryFn: async ({ pageParam }: { pageParam?: string | null }) => {
      const q = new URLSearchParams();
      if (debouncedSearch) q.set("search", debouncedSearch);
      if (selectedTypes.length > 0) q.set("type", selectedTypes.join(","));
      if (selectedListings.length > 0) q.set("listingType", selectedListings.join(","));
      if (locationInput) q.set("location", locationInput);
      if (minPrice) q.set("minPrice", minPrice);
      if (maxPrice) q.set("maxPrice", maxPrice);
      if (pageParam) q.set("cursor", pageParam);
      q.set("limit", String(LIMIT));

      const res = await fetch(`/api/properties?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    staleTime: 1000 * 60 * 3, // 3 minutes cache stale time
  });

  // Flattened properties list across all pages
  const properties: Property[] = data?.pages.flatMap((page) => page.properties) ?? [];

  // IntersectionObserver for seamless infinite scrolling trigger
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handlers for Quick Pills Multi-Select
  const toggleTypeChip = (val: string) => {
    let updated: string[];
    if (val === "") {
      updated = [];
    } else if (selectedTypes.includes(val)) {
      updated = selectedTypes.filter((t) => t !== val);
    } else {
      updated = [...selectedTypes, val];
    }
    setSelectedTypes(updated);
    setLocalTypes(updated);
  };

  const toggleListingChip = (val: string) => {
    let updated: string[];
    if (val === "") {
      updated = [];
    } else if (selectedListings.includes(val)) {
      updated = selectedListings.filter((l) => l !== val);
    } else {
      updated = [...selectedListings, val];
    }
    setSelectedListings(updated);
    setLocalListings(updated);
  };

  // Search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Advanced Filter Card Apply
  const applyAdvancedFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedTypes(localTypes);
    setSelectedListings(localListings);
    setLocationInput(localLocation);
    setMinPrice(localMin);
    setMaxPrice(localMax);
    setFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedTypes([]);
    setLocalTypes([]);
    setSelectedListings([]);
    setLocalListings([]);
    setLocationInput("");
    setLocalLocation("");
    setMinPrice("");
    setLocalMin("");
    setMaxPrice("");
    setLocalMax("");
  };

  const activeFilterCount =
    selectedTypes.length +
    selectedListings.length +
    (locationInput ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

  const hasSearch = searchQuery.trim().length > 0;

  const hasLocalFilters =
    localTypes.length > 0 ||
    localListings.length > 0 ||
    localLocation.trim().length > 0 ||
    localMin.trim().length > 0 ||
    localMax.trim().length > 0;

  const hasAnyFilters =
    hasSearch ||
    hasLocalFilters ||
    selectedTypes.length > 0 ||
    selectedListings.length > 0 ||
    locationInput.trim().length > 0 ||
    minPrice.trim().length > 0 ||
    maxPrice.trim().length > 0;

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

      <section className="section-light py-8">
        <div className="container space-y-6">
          {/* Main Search & Filter Action Bar */}
          <div className="prop-search-wrapper">
            <form onSubmit={handleSearchSubmit} className="prop-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by title, GT Road, colony name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button type="submit" className="search-submit-btn" disabled={!hasSearch}>
                <span>Search</span>
              </button>
            </form>

            <button
              type="button"
              className={`prop-filter-toggle-btn ${filterOpen ? "active" : ""} ${
                activeFilterCount > 0 ? "has-active" : ""
              }`}
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <FaSlidersH />
              <span className="hidden sm:inline">Filter Panel</span>
              {activeFilterCount > 0 && (
                <span className="filter-count-badge">{activeFilterCount}</span>
              )}
              <FaChevronDown className={`chevron-icon ${filterOpen ? "rotate" : ""}`} />
            </button>
          </div>

          {/* Expanded Advanced Filter Card */}
          {filterOpen && (
            <form onSubmit={applyAdvancedFilters} className="advanced-filter-card">
              <div className="filter-card-header">
                <div className="filter-header-title">
                  <div className="filter-header-icon-badge">
                    <FaFilter />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      Multi-Select &amp; Custom Filters
                    </h3>
                    <p className="text-xs font-normal m-0 mt-0.5">
                      Select multiple types and purposes to refine property listings
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="filter-reset-link"
                  disabled={!hasAnyFilters}
                >
                  <FaUndo className="text-xs" /> Reset Filters
                </button>
              </div>

              <div className="space-y-4 my-4">
                {/* Multi Select Types Checkboxes */}
                <div className="filter-subcard">
                  <div className="filter-section-label">
                    <FaBuilding /> Property Types (Select Multiple)
                  </div>
                  <div className="flex flex-wrap pt-1">
                    {PROPERTY_TYPES.map((t) => {
                      const isChecked = localTypes.includes(t.value);
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => {
                            setLocalTypes((prev) =>
                              prev.includes(t.value)
                                ? prev.filter((item) => item !== t.value)
                                : [...prev, t.value]
                            );
                          }}
                          className={`multi-select-chip-btn ${isChecked ? "selected" : ""}`}
                        >
                          <span className="chip-check-icon">
                            {isChecked ? <FaCheck className="text-[9px]" /> : <FaPlus className="text-[9px]" />}
                          </span>
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Multi Select Purpose Checkboxes */}
                <div className="filter-subcard">
                  <div className="filter-section-label">
                    <FaTag /> Listing Purpose (Select Multiple)
                  </div>
                  <div className="flex flex-wrap pt-1">
                    {LISTING_TYPES.map((l) => {
                      const isChecked = localListings.includes(l.value);
                      return (
                        <button
                          key={l.value}
                          type="button"
                          onClick={() => {
                            setLocalListings((prev) =>
                              prev.includes(l.value)
                                ? prev.filter((item) => item !== l.value)
                                : [...prev, l.value]
                            );
                          }}
                          className={`multi-select-chip-btn ${isChecked ? "selected" : ""}`}
                        >
                          <span className="chip-check-icon">
                            {isChecked ? <FaCheck className="text-[9px]" /> : <FaPlus className="text-[9px]" />}
                          </span>
                          {l.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location and Price Range Inputs */}
                <div className="filter-subcard">
                  <div className="filter-section-label">
                    <FaMapMarkerAlt /> Location &amp; Price Range
                  </div>
                  <div className="filter-input-grid pt-1">
                    <div className="form-group-filter">
                      <label>
                        <FaMapMarkerAlt /> Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GT Road, Junction"
                        value={localLocation}
                        onChange={(e) => setLocalLocation(e.target.value)}
                      />
                    </div>
                    <div className="form-group-filter">
                      <label>
                        <FaRupeeSign /> Min Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 500000"
                        value={localMin}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "" && Number(val) < 0) return;
                          setLocalMin(val);
                        }}
                      />
                    </div>
                    <div className="form-group-filter">
                      <label>
                        <FaRupeeSign /> Max Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 5000000"
                        value={localMax}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "" && Number(val) < 0) return;
                          setLocalMax(val);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="filter-card-actions mt-6">
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="btn-filter-secondary"
                >
                  Close
                </button>
                <button type="submit" className="btn-filter-primary" disabled={!hasLocalFilters}>
                  Apply Selected Filters
                </button>
              </div>
            </form>
          )}

          {/* Active Filter Chips */}
          {(activeFilterCount > 0 || searchQuery) && (
            <div className="active-filter-tags">
              <span className="tags-label">Active Filters:</span>

              {searchQuery && (
                <span className="active-tag">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")}>
                    <FaTimes />
                  </button>
                </span>
              )}

              {selectedTypes.map((tVal) => {
                const label = PROPERTY_TYPES.find((pt) => pt.value === tVal)?.label || tVal;
                return (
                  <span key={tVal} className="active-tag">
                    Type: {label}
                    <button onClick={() => toggleTypeChip(tVal)}>
                      <FaTimes />
                    </button>
                  </span>
                );
              })}

              {selectedListings.map((lVal) => {
                const label = LISTING_TYPES.find((lt) => lt.value === lVal)?.label || lVal;
                return (
                  <span key={lVal} className="active-tag">
                    Purpose: {label}
                    <button onClick={() => toggleListingChip(lVal)}>
                      <FaTimes />
                    </button>
                  </span>
                );
              })}

              {locationInput && (
                <span className="active-tag">
                  📍 {locationInput}
                  <button
                    onClick={() => {
                      setLocationInput("");
                      setLocalLocation("");
                    }}
                  >
                    <FaTimes />
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="active-tag">
                  ₹{minPrice || "0"} – {maxPrice ? `₹${maxPrice}` : "Any"}
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setLocalMin("");
                      setMaxPrice("");
                      setLocalMax("");
                    }}
                  >
                    <FaTimes />
                  </button>
                </span>
              )}

              <button onClick={clearAllFilters} className="clear-all-tag-btn">
                Clear All
              </button>
            </div>
          )}

          {/* Results Count Bar */}
          {!isLoading && properties.length > 0 && (
            <div className="results-summary-row">
              <span className="summary-text">
                Loaded <strong>{properties.length}</strong> properties
              </span>
            </div>
          )}

          {/* Initial Loading */}
          {isLoading ? (
            <div className="py-16">
              <Loader size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-400">
              Failed to load properties. Please check your connection and try again.
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              title="No properties found"
              description="We couldn't find any properties matching your criteria. Try clearing some filters."
              actionText="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <>
              {/* Properties Grid: Desktop = 3 per row, Tablet = 2 per row, Mobile = 1 per row */}
              <div className="property-grid-3col pt-2">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Infinite Scroll Load Trigger Sentinel */}
              <div ref={loadMoreRef} className="h-6 w-full opacity-0 pointer-events-none" />

              {/* Centered Show More Button Area */}
              <div className="show-more-wrapper">
                {hasNextPage ? (
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="btn-show-more"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading Next 15 Properties...</span>
                      </>
                    ) : (
                      <>
                        <FaPlusCircle className="btn-show-more-icon" />
                        <span>Show More Properties</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center py-4 text-xs text-neutral-400 font-semibold border-t border-neutral-800/60 w-full mt-4">
                    ✓ All {properties.length} properties loaded
                  </div>
                )}
              </div>
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
