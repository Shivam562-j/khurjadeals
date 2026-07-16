"use client";
import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPriceShort } from "@/utils/formatter";

interface ProductCardProps { product: Product; }

export default function ProductCard({ product }: ProductCardProps) {
  const { title, slug, category, condition, price, images, location, isFeatured } = product;
  const displayImage = images?.[0] ?? "/images/placeholder.jpg";

  return (
    <div className="listing-card">
      {/* Image */}
      <div className="listing-card-media" style={{ aspectRatio: "1/1" }}>
        {isFeatured && <span className="listing-badge">Featured</span>}
        <span className="listing-type-badge">{condition}</span>
        <img src={displayImage} alt={title} loading="lazy" />
      </div>

      {/* Body */}
      <div className="listing-card-body">
        <div className="listing-tags">
          <span className="listing-tag">{category}</span>
        </div>

        <Link href={`/products/${slug}`} className="listing-title">{title}</Link>

        <div className="listing-location">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{location}</span>
        </div>

        <div className="listing-footer">
          <span className="listing-price">{formatPriceShort(price)}</span>
          <Link href={`/products/${slug}`} className="listing-action">
            Buy Now
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
