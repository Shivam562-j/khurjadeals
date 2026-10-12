"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaMotorcycle,
  FaCar,
  FaBolt,
  FaBuilding,
  FaKey,
  FaHandHoldingUsd,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";

export default function Hero() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const prefetchProperties = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["properties", "", [], [], "", "", ""],
      queryFn: async () => {
        const res = await fetch("/api/properties?page=1&limit=15");
        return res.json();
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 3,
    });
  };

  const prefetchProducts = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["products", "", [], [], "", "", ""],
      queryFn: async () => {
        const res = await fetch("/api/products?page=1&limit=15");
        return res.json();
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 3,
    });
  };

  const handleHeroSearch = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      router.push("/products");
      return;
    }

    const propKeywords = ["flat", "plot", "house", "shop", "rent", "land", "commercial", "kothi", "makan", "property", "bhk"];
    const isProperty = propKeywords.some((kw) => q.toLowerCase().includes(kw));

    if (isProperty) {
      router.push(`/properties?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    }
  };

  const quickCategories = [
    {
      label: "Bikes",
      href: "/products?search=bike",
      icon: <FaMotorcycle />,
      prefetch: prefetchProducts,
    },
    {
      label: "Cars",
      href: "/products?search=car",
      icon: <FaCar />,
      prefetch: prefetchProducts,
    },
    {
      label: "Electric",
      href: "/products?category=Electric%20Vehicles",
      icon: <FaBolt />,
      prefetch: prefetchProducts,
    },
    {
      label: "Sale",
      href: "/properties?listingType=sell",
      icon: <FaBuilding />,
      prefetch: prefetchProperties,
    },
    {
      label: "Rent",
      href: "/properties?listingType=rent",
      icon: <FaKey />,
      prefetch: prefetchProperties,
    },
    {
      label: "Wanted",
      href: "/submit-query",
      icon: <FaHandHoldingUsd />,
      prefetch: () => { },
    },
  ];

  return (
    <div className="w-full relative">
      {/* ── Main Hero Section ── */}
      <section
        className="relative pt-32 pb-16 sm:pt-24 sm:pb-20 md:pt-28 md:pb-24 px-4 overflow-hidden text-center text-white"
        style={{
          background: "linear-gradient(135deg, #191411 0%, #2a160f 50%, #15110f 100%)",
        }}
      >
        {/* Diagonal stripes texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(232, 89, 12, 0.08) 35px, rgba(232, 89, 12, 0.08) 70px)",
          }}
        />

        {/* Ambient warm radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(232, 89, 12, 0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Top Pill Badge */}
          {/* <div className="inline-flex items-center gap-2 bg-black/60 border border-[#e8590c]/40 text-[#f97316] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-5 shadow-md backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8590c] animate-pulse" />
            <span>Khurja&apos;s #1 Local Marketplace</span>
          </div> */}

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-4 text-white">
            Vehicles &amp; Properties{" "}
            <span className="text-[#e8590c]">All in One Place</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mb-8 leading-relaxed">
            The fastest marketplace to buy, sell, and rent vehicles and properties in Khurja.
          </p>

          {/* Search Bar (Phone View & Responsive) */}
          <form
            onSubmit={handleHeroSearch}
            className="w-full max-w-sm sm:max-w-md md:max-w-lg flex md:hidden items-center bg-neutral-900/90 border border-neutral-700/80 focus-within:border-[#e8590c] focus-within:ring-2 focus-within:ring-[#e8590c]/25 rounded-2xl overflow-hidden mb-7 sm:mb-8 shadow-xl backdrop-blur-md transition-all duration-200"
          >
            {/* Left search icon button (Clicking search icon also triggers search) */}
            <button
              type="button"
              onClick={handleHeroSearch}
              title="Search"
              aria-label="Search"
              className="pl-3.5 pr-1.5 text-[#e8590c] hover:text-[#f97316] transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <FaSearch className="text-sm" />
            </button>

            {/* Input field: Enter triggers search */}
            <input
              type="search"
              enterKeyHint="search"
              placeholder="Search bikes, cars, flats, plots in Khurja..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  handleHeroSearch(e);
                }
              }}
              className="flex-1 bg-transparent px-2 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-400 outline-none"
            />

            {/* Clear Button when text is entered */}
            {searchQuery?.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors mr-1 cursor-pointer shrink-0"
                title="Clear"
              >
                <FaTimes className="text-xs" />
              </button>
            )}

            {/* Right Search Button (Clicking icon/button triggers search) */}
            <button
              type="submit"
              onClick={handleHeroSearch}
              title="Search"
              aria-label="Search"
              className="bg-gradient-to-r from-[#e8590c] to-[#f97316] hover:brightness-110 active:scale-95 text-white px-3.5 sm:px-4 py-2.5 flex items-center justify-center transition-all cursor-pointer shrink-0 font-medium text-xs sm:text-sm gap-1.5"
            >
              <FaSearch className="text-xs" />
              <span>Search</span>
            </button>
          </form>

          {/* ── Two Category Cards (Vehicles & Properties) ── */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
            {/* Card 1: Vehicles */}
            <div
              className="group relative h-[210px] sm:h-[230px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              style={{
                backgroundImage: "url('/images/hero-vehicles.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:from-black/95 transition-colors" />

              <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-end">
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-black/75 border border-[#e8590c]/50 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8590c]" />
                    Vehicles
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1">
                  Bikes, Cars &amp; EVs
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mb-3.5">
                  Buy &amp; Sell Verified Vehicles
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/products"
                    onMouseEnter={prefetchProducts}
                    onTouchStart={prefetchProducts}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-[#e8590c] to-[#f97316] hover:brightness-110 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl shadow-lg shadow-[#e8590c]/30 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Buy
                  </Link>
                  <Link
                    href="/submit-query"
                    className="inline-flex items-center justify-center bg-black/70 hover:bg-[#e8590c]/20 text-white hover:text-[#fb923c] border border-white/30 hover:border-[#e8590c] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    Sell
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2: Properties */}
            <div
              className="group relative h-[210px] sm:h-[230px] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              style={{
                backgroundImage: "url('/images/hero-properties.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 group-hover:from-black/95 transition-colors" />

              <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-end">
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1.5 bg-black/75 border border-[#e8590c]/50 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e8590c]" />
                    Properties
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-1">
                  Plots, Flats &amp; Commercial
                </h2>
                <p className="text-xs sm:text-sm text-neutral-300 mb-3.5">
                  Buy &amp; Rent in Khurja
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/properties?listingType=sell"
                    onMouseEnter={prefetchProperties}
                    onTouchStart={prefetchProperties}
                    className="inline-flex items-center justify-center bg-gradient-to-r from-[#e8590c] to-[#f97316] hover:brightness-110 text-white text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl shadow-lg shadow-[#e8590c]/30 hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Buy
                  </Link>
                  <Link
                    href="/properties?listingType=rent"
                    onMouseEnter={prefetchProperties}
                    onTouchStart={prefetchProperties}
                    className="inline-flex items-center justify-center bg-black/70 hover:bg-[#e8590c]/20 text-white hover:text-[#fb923c] border border-white/30 hover:border-[#e8590c] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
                  >
                    Rent
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating Quick Categories Bar (6 items) ── */}
      <div className="max-w-4xl mx-auto px-4 -mt-7 sm:-mt-9 relative z-20 mb-8 sm:mb-12">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3.5">
          {quickCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              onMouseEnter={cat.prefetch}
              onTouchStart={cat.prefetch}
              className="group bg-white hover:bg-neutral-50 rounded-2xl p-3 sm:p-4 text-center border border-neutral-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="text-2xl sm:text-3xl text-[#e8590c] group-hover:scale-110 transition-transform duration-200 mb-1.5 flex items-center justify-center h-8">
                {cat.icon}
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-[#e8590c] transition-colors leading-tight">
                {cat.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
