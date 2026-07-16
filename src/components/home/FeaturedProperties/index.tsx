"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import PropertyCard from "@/components/property/PropertyCard";

interface FeaturedPropertiesProps { properties: Property[]; }

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const ref = useRef<HTMLDivElement>(null);
  if (!properties?.length) return null;

  const scroll = (dir: "left" | "right") => {
    if (ref.current) {
      const amount = ref.current.clientWidth * 0.75;
      ref.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  return (
    <section className="section-light">
      <div className="container">
        {/* Head */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 48 }}>
          <div className="sec-head" style={{ marginBottom: 0 }}>
            <div className="eyebrow">🔥 Latest Listings</div>
            <h2 className="h2">Featured Properties</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: 12 }}>
              Verified commercial, residential &amp; agricultural listings in Khurja
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <Link
              href="/properties"
              className="linkarrow"
              style={{ display: "none", fontSize: "0.9rem" }}
              id="fp-view-all"
            >
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
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--primary)";
                  el.style.color = "var(--primary)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border-color)";
                  el.style.color = "var(--text-muted)";
                }}
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
            display: "flex", gap: 20,
            overflowX: "auto", scrollSnapType: "x mandatory",
            paddingBottom: 4,
          }}
        >
          {properties.map((property) => (
            <div key={property._id} style={{ flex: "0 0 360px", scrollSnapAlign: "start" }}>
              <PropertyCard property={property} />
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/properties" className="btn btn-outline" style={{ fontSize: "0.88rem" }}>
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  );
}
