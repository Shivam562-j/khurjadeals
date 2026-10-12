"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaSearch,
  FaBuilding,
  FaBox,
  FaPlus,
  FaPhoneAlt,
  FaArrowLeft,
  FaCompass,
} from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/common/FloatingActions";

export default function WebsiteNotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    const propKeywords = ["flat", "plot", "house", "shop", "rent", "land", "commercial", "kothi", "makan", "property", "bhk"];
    const isProperty = propKeywords.some((kw) => q.toLowerCase().includes(kw));

    if (isProperty) {
      router.push(`/properties?search=${encodeURIComponent(q)}`);
    } else {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    }
  };

  const quickLinks = [
    {
      icon: <FaHome className="text-xl text-[#e8590c]" />,
      title: "Homepage",
      desc: "Return to our main landing page and explore top deals.",
      href: "/",
      cta: "Go to Home",
    },
    {
      icon: <FaBuilding className="text-xl text-[#e8590c]" />,
      title: "Properties",
      desc: "Browse verified residential plots, houses, flats & shops.",
      href: "/properties",
      cta: "Explore Properties",
    },
    {
      icon: <FaBox className="text-xl text-[#e8590c]" />,
      title: "Vehicles & Bazaar",
      desc: "Find used bikes, cars, electric vehicles, and appliances.",
      href: "/products",
      cta: "Explore Products",
    },
    {
      icon: <FaPlus className="text-xl text-[#e8590c]" />,
      title: "Post Free Ad",
      desc: "Sell your property or vehicle directly to local buyers.",
      href: "/submit-query",
      cta: "Post Your Listing",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)]">
      <Header />

      <main className="flex-1">
        {/* ── Signature Hero Section ── */}
        <div className="page-hero">
          <div className="container">
            <div className="inline-flex items-center gap-2 bg-black/60 border border-[#e8590c]/40 text-[#f97316] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 shadow-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#e8590c] animate-ping" />
              <span>404 &bull; Page Not Found</span>
            </div>

            <h1 className="h1">
              Lost in Khurja? <span className="accent">Page Not Found</span>
            </h1>

            <p className="lead">
              The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable. Let&apos;s get you back on track!
            </p>

            {/* In-hero Search Box */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-lg mt-6 flex items-center bg-black/50 border border-white/20 focus-within:border-[#e8590c] focus-within:ring-2 focus-within:ring-[#e8590c]/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md transition-all"
            >
              <div className="pl-4 text-[#e8590c]">
                <FaSearch className="text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search properties, bikes, cars in Khurja..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-neutral-400 outline-none"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#e8590c] to-[#f97316] hover:brightness-110 active:scale-95 text-white px-5 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* ── Quick Navigation Grid Section ── */}
        <section className="section-light py-16 sm:py-20">
          <div className="container max-w-5xl">
            <div className="sec-head center mb-10">
              <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <FaCompass style={{ fontSize: "0.85rem" }} /> Helpful Destinations
              </span>
              <h2 className="h2">Where would you like to go?</h2>
              <p>Choose from our most visited sections or go back to browsing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickLinks.map((item) => (
                <div
                  key={item.title}
                  className="card flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="card-ic mb-4">{item.icon}</div>
                    <h3 className="text-lg font-bold mb-2 text-[var(--text-white)]">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center justify-center font-bold text-xs sm:text-sm text-[#e8590c] hover:text-[#f97316] hover:underline gap-1.5"
                  >
                    <span>{item.cta}</span>
                    &rarr;
                  </Link>
                </div>
              ))}
            </div>

            {/* Back Button & Contact Helper */}
            <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border-color)] hover:border-[#e8590c] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-sm font-semibold transition-all cursor-pointer text-[var(--text-main)]"
              >
                <FaArrowLeft className="text-xs text-[#e8590c]" />
                Go Back Previous Page
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-muted)]">
                <span>Still can&apos;t find what you need?</span>
                <Link
                  href="/contact"
                  className="font-bold text-[#e8590c] hover:underline inline-flex items-center gap-1"
                >
                  <FaPhoneAlt className="text-xs" /> Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
