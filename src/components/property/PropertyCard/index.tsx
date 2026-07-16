import React from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { formatPriceShort } from "@/utils/formatter";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    title,
    slug,
    type,
    listingType,
    price,
    area,
    areaUnit,
    location,
    images,
    isFeatured,
  } = property;

  const displayImage = images && images.length > 0 ? images[0] : "/images/placeholder.jpg";

  return (
    <div className="group flex flex-col bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden hover:border-neutral-750 transition-all duration-300 shadow-lg">
      {/* Media Cover */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
        {isFeatured && (
          <span className="absolute top-3 left-3 z-10 bg-[var(--primary)] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow">
            Featured
          </span>
        )}
        <span className="absolute top-3 right-3 z-10 bg-neutral-950/85 backdrop-blur text-white text-xs px-2.5 py-1 rounded-md border border-neutral-800 capitalize font-medium">
          For {listingType}
        </span>
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Tags */}
          <div className="flex gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            <span>{type}</span>
            <span>•</span>
            <span>
              {area} {areaUnit}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white leading-snug line-clamp-1 group-hover:text-[var(--primary)] transition-colors">
            <Link href={`/properties/${slug}`}>{title}</Link>
          </h3>

          {/* Location */}
          <p className="text-xs text-neutral-450 flex items-center gap-1">
            <svg
              className="h-3.5 w-3.5 text-neutral-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span className="truncate">{location}</span>
          </p>
        </div>

        {/* Pricing footer */}
        <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
          <span className="text-lg font-black text-[var(--primary)]">
            {formatPriceShort(price)}
          </span>
          <Link
            href={`/properties/${slug}`}
            className="text-xs font-semibold text-white hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1"
          >
            Details
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
