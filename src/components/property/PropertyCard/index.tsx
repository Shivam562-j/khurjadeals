"use client";
import React from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { formatPriceShort } from "@/utils/formatter";
import { FaMapMarkerAlt, FaArrowRight, FaRegClock } from "react-icons/fa";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { title, slug, type, listingType, price, area, areaUnit, location, images, isFeatured, createdAt } = property;
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

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
      <div className="listing-card-media" style={{ aspectRatio: "16 / 10" }}>
        {isFeatured && <span className="listing-badge">Featured</span>}
        <span className="listing-type-badge">For {listingType}</span>
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";
          }}
        />
      </div>

      {/* Body */}
      <div className="listing-card-body">
        <div className="listing-tags">
          <span className="listing-tag">{type}</span>
          <span className="listing-tag">
            {area} {areaUnit}
          </span>
        </div>

        <Link href={`/properties/${slug}`} className="listing-title" title={title}>
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
          <Link href={`/properties/${slug}`} className="listing-action">
            Details
            <FaArrowRight style={{ fontSize: "0.7rem" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
