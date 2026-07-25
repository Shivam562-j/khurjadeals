"use client";
import React from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { formatPriceShort } from "@/utils/formatter";
import { FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { title, slug, type, listingType, price, area, areaUnit, location, images, isFeatured } = property;
  const displayImage =
    images && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80";

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

        <div className="listing-location">
          <FaMapMarkerAlt />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {location}
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
