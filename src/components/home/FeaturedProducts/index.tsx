"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import Container from "@/components/layout/Container";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75; // Scroll 75% of visible width
      const targetScroll =
        direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-neutral-900/40 border-t border-b border-neutral-900">
      <Container className="space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Khurja Specialities
            </span>
            <h2 className="text-3xl font-black text-white">
              Featured Products & Pottery
            </h2>
          </div>

          {/* Carousel Arrows & View All */}
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="text-xs font-semibold text-neutral-450 hover:text-[var(--primary)] transition-colors hidden sm:block"
            >
              View All Products →
            </Link>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md"
                aria-label="Scroll left"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-900 text-white hover:bg-[var(--primary)] hover:border-[var(--primary)] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md"
                aria-label="Scroll right"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-4"
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="w-[200px] sm:w-[260px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="text-center sm:hidden pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:text-white transition-colors"
          >
            View All Products
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
