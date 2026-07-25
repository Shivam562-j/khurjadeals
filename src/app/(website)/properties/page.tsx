"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
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
} from "react-icons/fa";

const LIMIT = 12;

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

  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

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

  // Local state for expanded filter card
  const [localTypes, setLocalTypes] = useState<string[]>(selectedTypes);
  const [localListings, setLocalListings] = useState<string[]>(selectedListings);
  const [localLocation, setLocalLocation] = useState(locationInput);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const [filterOpen, setFilterOpen] = useState(false);

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

    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
  }, [searchParams]);

  // Fetch properties API call
  const fetchPropertiesPage = useCallback(
    async (pageNum: number, isMoreCall: boolean = false) => {
      if (isMoreCall) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const q = new URLSearchParams();
        if (searchQuery) q.set("search", searchQuery);
        if (selectedTypes.length > 0) q.set("type", selectedTypes.join(","));
        if (selectedListings.length > 0) q.set("listingType", selectedListings.join(","));
        if (locationInput) q.set("location", locationInput);
        if (minPrice) q.set("minPrice", minPrice);
        if (maxPrice) q.set("maxPrice", maxPrice);

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
        console.error("Error fetching properties:", e);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchQuery, selectedTypes, selectedListings, locationInput, minPrice, maxPrice]
  );

  // Initial fetch and fetch on filter change
  useEffect(() => {
    fetchPropertiesPage(page, page > 1);
  }, [page, fetchPropertiesPage]);

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
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
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
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
  };

  // Search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
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
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
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
    setProperties([]);
    setPage(1);
    setHasMore(true);
    setIsFirstLoad(true);
  };

  // Show More Button Handler
  const handleShowMore = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const activeFilterCount =
    selectedTypes.length +
    selectedListings.length +
    (locationInput ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

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
                  onClick={() => {
                    setSearchQuery("");
                    setProperties([]);
                    setPage(1);
                    setHasMore(true);
                    setIsFirstLoad(true);
                  }}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button type="submit" className="search-submit-btn">
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
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      Multi-Select &amp; Custom Filters
                    </h3>
                    <p className="text-xs text-neutral-400 font-normal m-0 mt-0.5">
                      Select multiple types and purposes to refine property listings
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="filter-reset-link"
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
                            {isChecked ? "✓" : "+"}
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
                            {isChecked ? "✓" : "+"}
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
                <button type="submit" className="btn-filter-primary">
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
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setProperties([]);
                      setPage(1);
                      setHasMore(true);
                      setIsFirstLoad(true);
                    }}
                  >
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
                      setProperties([]);
                      setPage(1);
                      setHasMore(true);
                      setIsFirstLoad(true);
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
                      setProperties([]);
                      setPage(1);
                      setHasMore(true);
                      setIsFirstLoad(true);
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
          {!isFirstLoad && properties.length > 0 && (
            <div className="results-summary-row">
              <span className="summary-text">
                Showing <strong>{properties.length}</strong> of <strong>{totalCount}</strong> properties
              </span>
            </div>
          )}

          {/* Initial Loading */}
          {isFirstLoad && isLoading ? (
            <div className="py-16">
              <Loader size="lg" />
            </div>
          ) : properties.length === 0 && !isLoading ? (
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

              {/* Centered Show More Button Area */}
              <div className="show-more-wrapper">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={handleShowMore}
                    disabled={isLoadingMore}
                    className="btn-show-more"
                  >
                    {isLoadingMore ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Loading 12 More Properties...</span>
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
