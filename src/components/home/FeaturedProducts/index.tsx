"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { FaStore } from "react-icons/fa";
import ProductCard from "@/components/product/ProductCard";

interface FeaturedProductsProps { products: Product[]; }

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const ref = useRef<HTMLDivElement>(null);
  if (!products?.length) return null;

  const scroll = (dir: "left" | "right") => {
    if (ref.current) {
      const amount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <section className="section-alt">
      <div className="container">
        {/* Head */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 48 }}>
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FaStore style={{ fontSize: "0.85rem", color: "var(--primary)" }} /> Khurja Specials
            </div>
            <h2 className="h2">Featured Products &amp; Pottery</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: 12 }}>
              Second-hand mobiles, laptops, bikes &amp; world-famous Khurja pottery ceramics
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <Link href="/products" className="linkarrow" style={{ fontSize: "0.9rem" }}>
              View All
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
              </svg>
            </Link>
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                style={{
                  width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--bg-card)", border: "1.5px solid var(--border-color)",
                  color: "var(--text-muted)", transition: "var(--transition-smooth)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)"; (e.currentTarget as HTMLElement).style.color = "var(--primary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                    d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={ref}
          className="scrollbar-none"
          style={{
            display: "flex", gap: 18,
            overflowX: "auto", scrollSnapType: "x mandatory",
            paddingBottom: 4,
          }}
        >
          {products.map((product) => (
            <div key={product._id} style={{ flex: "0 0 260px", scrollSnapAlign: "start" }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/products" className="btn btn-outline" style={{ fontSize: "0.88rem" }}>
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
