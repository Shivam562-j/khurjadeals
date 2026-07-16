"use client";
import React from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { FaBicycle, FaMobileAlt, FaLaptop, FaBoxOpen, FaHome, FaKey, FaEnvelope } from "react-icons/fa";

export default function Hero() {
  const quickCategories = [
    { label: "Bikes", icon: FaBicycle, href: "/products?search=bike" },
    { label: "Mobiles", icon: FaMobileAlt, href: "/products?search=phone" },
    { label: "Laptops", icon: FaLaptop, href: "/products?search=laptop" },
    { label: "Pottery", icon: FaBoxOpen, href: "/products?category=Pottery+%26+Ceramics" },
    { label: "For Sale", icon: FaHome, href: "/properties?listingType=sell" },
    { label: "For Rent", icon: FaKey, href: "/properties?listingType=rent" },
    { label: "Wanted Ad", icon: FaEnvelope, href: "/submit-query" },
  ];

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden py-16 bg-[radial-gradient(ellipse_at_top,_var(--hero-bg-2)_0%,_var(--hero-bg-1)_60%,_#0a0a0a_100%)]">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--primary)]/10 blur-[130px] pointer-events-none" />

      <Container className="relative z-10 text-center space-y-12 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 font-semibold tracking-wider uppercase backdrop-blur-sm shadow-lg mx-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          Khurja's Own Marketplace
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Vehicles & Properties <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-amber-500">
              Ek Jagah Par
            </span>
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Khurja ka apna local directory. Verified commercial properties, plots, residential houses, second-hand mobile phones, laptops, and bikes.
          </p>
        </div>

        {/* Double Core Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Products & Vehicles */}
          <div className="group bg-neutral-900/60 border border-neutral-850 hover:border-neutral-750 p-8 rounded-3xl text-left flex flex-col justify-between space-y-6 transition-all duration-350 shadow-2xl backdrop-blur-md">
            <div className="space-y-3">
              <div className="text-3xl">📦</div>
              <h3 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                Vehicles & Bazaar Products
              </h3>
              <p className="text-sm text-neutral-455 leading-relaxed">
                Second-hand mobile phones, laptops, electronics, pre-owned bikes, scooters, and local handcrafted pottery ceramics.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/products" className="flex items-center justify-center font-bold rounded-xl py-3 bg-neutral-950 text-xs uppercase tracking-wide border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-all cursor-pointer">
                Browse Items
              </Link>
              <Link href="/submit-query" className="flex items-center justify-center font-bold rounded-xl py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-xs uppercase tracking-wide text-white transition-all cursor-pointer shadow-lg">
                Sell / Post Ad
              </Link>
            </div>
          </div>

          {/* Real Estate & Properties */}
          <div className="group bg-neutral-900/60 border border-neutral-850 hover:border-neutral-750 p-8 rounded-3xl text-left flex flex-col justify-between space-y-6 transition-all duration-350 shadow-2xl backdrop-blur-md">
            <div className="space-y-3">
              <div className="text-3xl">🏢</div>
              <h3 className="text-xl font-bold text-white group-hover:text-[var(--primary)] transition-colors">
                Real Estate & Properties
              </h3>
              <p className="text-sm text-neutral-455 leading-relaxed">
                List or search for commercial shops on G.T. Road, residential plots near Junction Road, agricultural lands, and home rentals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/properties" className="flex items-center justify-center font-bold rounded-xl py-3 bg-neutral-950 text-xs uppercase tracking-wide border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-600 transition-all cursor-pointer">
                Buy / Rent
              </Link>
              <Link href="/submit-query" className="flex items-center justify-center font-bold rounded-xl py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-xs uppercase tracking-wide text-white transition-all cursor-pointer shadow-lg">
                List Property
              </Link>
            </div>
          </div>
        </div>

        {/* Circular Quick Categories Icons */}
        <div className="max-w-4xl mx-auto pt-6">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-6">
            Quick Categories
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {quickCategories.map((cat, idx) => (
              <Link key={idx} href={cat.href} className="group flex flex-col items-center gap-2 cursor-pointer transition">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-neutral-850 bg-neutral-900/80 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] flex items-center justify-center text-xl sm:text-2xl shadow transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {React.createElement(cat.icon, { className: "text-2xl" })}
                </div>
                <span className="text-xs font-semibold text-neutral-450 group-hover:text-white transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
