"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Product, PaginatedProductResponse } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaShoppingBag,
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

const CATEGORY_OPTIONS = [
  { label: "Bikes & Cars", value: "Bikes & Cars" },
  { label: "Electric Vehicles (EV)", value: "Electric Vehicles" },
  { label: "Mobiles & Laptops", value: "Mobiles & Laptops" },
  { label: "Electronics", value: "Electronics" },
  { label: "Home Appliances (Fridge/AC/Washer)", value: "Home Appliances" },
  { label: "Furniture & Decor", value: "Furniture & Decor" },
  { label: "Others", value: "Others" },
];

const CONDITION_OPTIONS = [
  { label: "Brand New", value: "new" },
  { label: "Used / Pre-Owned", value: "used" },
  { label: "Refurbished", value: "refurbished" },
];

function ProductsList({ initialData }: { initialData?: PaginatedProductResponse }) {
  const searchParams = useSearchParams();

  // Multi-select filters state (Arrays)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category") ? searchParams.get("category")!.split(",").filter(Boolean) : []
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    searchParams.get("condition") ? searchParams.get("condition")!.split(",").filter(Boolean) : []
  );

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Debounce search query to prevent excessive API requests
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Local state for expanded filter card
  const [localCategories, setLocalCategories] = useState<string[]>(selectedCategories);
  const [localConditions, setLocalConditions] = useState<string[]>(selectedConditions);
  const [localLocation, setLocalLocation] = useState(locationInput);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const [filterOpen, setFilterOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Sync with URL params
  useEffect(() => {
    const catFromUrl = searchParams.get("category") ? searchParams.get("category")!.split(",").filter(Boolean) : [];
    const condFromUrl = searchParams.get("condition") ? searchParams.get("condition")!.split(",").filter(Boolean) : [];
    const searchFromUrl = searchParams.get("search") || "";
    const locFromUrl = searchParams.get("location") || "";
    const minFromUrl = searchParams.get("minPrice") || "";
    const maxFromUrl = searchParams.get("maxPrice") || "";

    setSelectedCategories(catFromUrl);
    setLocalCategories(catFromUrl);
    setSelectedConditions(condFromUrl);
    setLocalConditions(condFromUrl);
    setSearchQuery(searchFromUrl);
    setLocationInput(locFromUrl);
    setLocalLocation(locFromUrl);
    setMinPrice(minFromUrl);
    setLocalMin(minFromUrl);
    setMaxPrice(maxFromUrl);
    setLocalMax(maxFromUrl);
  }, [searchParams]);

  // TanStack Query useInfiniteQuery with initialData pre-hydrated from server
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      debouncedSearch,
      selectedCategories,
      selectedConditions,
      locationInput,
      minPrice,
      maxPrice,
    ],
    queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
      const q = new URLSearchParams();
      if (debouncedSearch) q.set("search", debouncedSearch);
      if (selectedCategories.length > 0) q.set("category", selectedCategories.join(","));
      if (selectedConditions.length > 0) q.set("condition", selectedConditions.join(","));
      if (locationInput) q.set("location", locationInput);
      if (minPrice) q.set("minPrice", minPrice);
      if (maxPrice) q.set("maxPrice", maxPrice);
      q.set("page", String(pageParam));
      q.set("limit", String(LIMIT));

      const res = await fetch(`/api/products?${q.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    initialPageParam: 1,
    initialData:
      initialData && !debouncedSearch && selectedCategories.length === 0 && selectedConditions.length === 0 && !locationInput && !minPrice && !maxPrice
        ? {
            pages: [initialData],
            pageParams: [1],
          }
        : undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    staleTime: 1000 * 60 * 3, // 3 minutes cache stale time
  });

  // Flattened products list across all pages
  const products: Product[] = data?.pages.flatMap((page) => page.products) ?? [];

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

  // Search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Advanced Filter Card Apply
  const applyAdvancedFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategories(localCategories);
    setSelectedConditions(localConditions);
    setLocationInput(localLocation);
    setMinPrice(localMin);
    setMaxPrice(localMax);
    setFilterOpen(false);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setLocalCategories([]);
    setSelectedConditions([]);
    setLocalConditions([]);
    setLocationInput("");
    setLocalLocation("");
    setMinPrice("");
    setLocalMin("");
    setMaxPrice("");
    setLocalMax("");
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedConditions.length +
    (locationInput ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

  const hasSearch = searchQuery.trim().length > 0;

  const hasLocalFilters =
    localCategories.length > 0 ||
    localConditions.length > 0 ||
    localLocation.trim().length > 0 ||
    localMin.trim().length > 0 ||
    localMax.trim().length > 0;

  const hasAnyFilters =
    hasSearch ||
    hasLocalFilters ||
    selectedCategories.length > 0 ||
    selectedConditions.length > 0 ||
    locationInput.trim().length > 0 ||
    minPrice.trim().length > 0 ||
    maxPrice.trim().length > 0;

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Local Bazaar</span>
          <h1 className="h1">Marketplace &amp; Used Items Bazaar</h1>
          <p className="lead">
            Discover used bikes, cars, electric vehicles (EV), laptops, smartphones, refrigerators, ACs, coolers &amp; washing machines directly from local sellers in Khurja.
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
                placeholder="Search bikes, EVs, cars, mobiles, laptops, fridge, AC, cooler..."
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
                      Select multiple categories and item conditions to refine product listings
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
                {/* Multi Select Categories */}
                <div className="filter-subcard">
                  <div className="filter-section-label">
                    <FaShoppingBag /> Categories (Select Multiple)
                  </div>
                  <div className="flex flex-wrap pt-1">
                    {CATEGORY_OPTIONS.map((c) => {
                      const isChecked = localCategories.includes(c.value);
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => {
                            setLocalCategories((prev) =>
                              prev.includes(c.value)
                                ? prev.filter((item) => item !== c.value)
                                : [...prev, c.value]
                            );
                          }}
                          className={`multi-select-chip-btn ${isChecked ? "selected" : ""}`}
                        >
                          <span className="chip-check-icon">
                            {isChecked ? <FaCheck className="text-[9px]" /> : <FaPlus className="text-[9px]" />}
                          </span>
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Multi Select Condition */}
                <div className="filter-subcard">
                  <div className="filter-section-label">
                    <FaTag /> Item Condition (Select Multiple)
                  </div>
                  <div className="flex flex-wrap pt-1">
                    {CONDITION_OPTIONS.map((cond) => {
                      const isChecked = localConditions.includes(cond.value);
                      return (
                        <button
                          key={cond.value}
                          type="button"
                          onClick={() => {
                            setLocalConditions((prev) =>
                              prev.includes(cond.value)
                                ? prev.filter((item) => item !== cond.value)
                                : [...prev, cond.value]
                            );
                          }}
                          className={`multi-select-chip-btn ${isChecked ? "selected" : ""}`}
                        >
                          <span className="chip-check-icon">
                            {isChecked ? <FaCheck className="text-[9px]" /> : <FaPlus className="text-[9px]" />}
                          </span>
                          {cond.label}
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
                        placeholder="e.g. GT Road, Subhash Road"
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
                        placeholder="e.g. 200"
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
                        placeholder="e.g. 5000"
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

              {selectedCategories.map((cVal) => (
                <span key={cVal} className="active-tag">
                  Category: {cVal}
                  <button
                    onClick={() => {
                      setSelectedCategories((prev) => prev.filter((item) => item !== cVal));
                      setLocalCategories((prev) => prev.filter((item) => item !== cVal));
                    }}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}

              {selectedConditions.map((condVal) => {
                const label = CONDITION_OPTIONS.find((co) => co.value === condVal)?.label || condVal;
                return (
                  <span key={condVal} className="active-tag">
                    Condition: {label}
                    <button
                      onClick={() => {
                        setSelectedConditions((prev) => prev.filter((item) => item !== condVal));
                        setLocalConditions((prev) => prev.filter((item) => item !== condVal));
                      }}
                    >
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
          {!isLoading && products.length > 0 && (
            <div className="results-summary-row">
              <span className="summary-text">
                Loaded <strong>{products.length}</strong> products
              </span>
            </div>
          )}

          {/* Initial Loading */}
          {isLoading && products.length === 0 ? (
            <div className="py-16">
              <Loader size="lg" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-400">
              Failed to load products. Please check your connection and try again.
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="We couldn't find any products matching your criteria. Try clearing some filters."
              actionText="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <>
              {/* Products Grid: Responsive 3-col on desktop, 2-col on tablet, 1-col on mobile */}
              <div className="property-grid-3col pt-2">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
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
                        <span>Loading Next 15 Products...</span>
                      </>
                    ) : (
                      <>
                        <FaPlusCircle className="btn-show-more-icon" />
                        <span>Show More Products</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center py-4 text-xs text-neutral-400 font-semibold border-t border-neutral-800/60 w-full mt-4">
                    ✓ All {products.length} products loaded
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<Loader size="lg" />}>
      <ProductsList />
    </Suspense>
  );
}
