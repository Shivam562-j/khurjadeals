"use client";
import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPriceShort } from "@/utils/formatter";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { title, slug, category, condition, price, images, location, isFeatured } = product;
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80";

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

        <div className="listing-location">
          <FaMapMarkerAlt />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {location}
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
