"use client";
import React, { useState } from "react";
import { PropertyType, ListingType } from "@/types/property";

interface PropertyFilterProps {
  filters: any;
  onFilterChange: (filters: {
    type?: PropertyType | "";
    listingType?: ListingType | "";
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }) => void;
}

export default function PropertyFilter({ filters, onFilterChange }: PropertyFilterProps) {
  const [type, setType] = useState<PropertyType | "">(filters.type || "");
  const [listingType, setListingType] = useState<ListingType | "">(filters.listingType || "");
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice || "");
  const [location, setLocation] = useState<string>(filters.location || "");

  // Synchronize internal state with changes in parent filter states (e.g. from URL changes)
  React.useEffect(() => {
    setType(filters.type || "");
    setListingType(filters.listingType || "");
    setMinPrice(filters.minPrice || "");
    setMaxPrice(filters.maxPrice || "");
    setLocation(filters.location || "");
  }, [filters]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      type: type || undefined,
      listingType: listingType || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      location: location || undefined,
    });
  };

  const handleClear = () => {
    setType("");
    setListingType("");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    onFilterChange({});
  };

  const typeOptions = [
    { label: "All Property Types", value: "" },
    { label: "Residential", value: "residential" },
    { label: "Commercial", value: "commercial" },
    { label: "Plot / Land", value: "plot" },
    { label: "Agricultural", value: "agricultural" },
  ];

  const listingOptions = [
    { label: "Sell & Rent", value: "" },
    { label: "For Sale", value: "sell" },
    { label: "For Rent", value: "rent" },
    { label: "For Lease", value: "lease" },
  ];

  return (
    <form
      onSubmit={handleApply}
      className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex flex-col gap-5 w-full shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-neutral-850 pb-3">
        <h4 className="font-bold text-white text-sm uppercase tracking-wide">
          Filter Listings
        </h4>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-neutral-450 hover:text-white transition-colors font-medium cursor-pointer"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">
            Property Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Listing Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">
            Purpose
          </label>
          <select
            value={listingType}
            onChange={(e) => setListingType(e.target.value as any)}
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)]"
          >
            {listingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. GT Road"
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)] placeholder-neutral-600"
          />
        </div>

        {/* Price Min */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">
            Min Price (₹)
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)] placeholder-neutral-600"
          />
        </div>

        {/* Price Max */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">
            Max Price (₹)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)] placeholder-neutral-600"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-1">
        <button
          type="submit"
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition-colors cursor-pointer"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
