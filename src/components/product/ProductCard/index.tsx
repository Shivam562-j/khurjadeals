"use client";
import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPriceShort } from "@/utils/formatter";
import { FaMapMarkerAlt, FaArrowRight, FaRegClock } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { title, slug, category, condition, price, images, location, isFeatured, createdAt } = product;
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

  const dateFormatted = createdAt
    ? new Date(createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="listing-card">
      {/* Image */}
      <div className="listing-card-media" style={{ aspectRatio: "1 / 1" }}>
        {isFeatured && <span className="listing-badge">Featured</span>}
        <span className="listing-type-badge">{condition}</span>
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";
          }}
        />
      </div>

      {/* Body */}
      <div className="listing-card-body">
        <div className="listing-tags">
          <span className="listing-tag">{category}</span>
        </div>

        <Link href={`/products/${slug}`} className="listing-title" title={title}>
          {title}
        </Link>

        <div className="listing-location flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 min-w-0">
            <FaMapMarkerAlt className="text-[var(--primary)] shrink-0" />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {location}
            </span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] shrink-0 ml-2">
            <FaRegClock style={{ fontSize: "0.65rem" }} />
            <span>{dateFormatted}</span>
          </span>
        </div>

        <div className="listing-footer">
          <span className="listing-price">{formatPriceShort(price)}</span>
          <Link href={`/products/${slug}`} className="listing-action">
            Details
            <FaArrowRight style={{ fontSize: "0.7rem" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
