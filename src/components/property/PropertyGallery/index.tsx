"use client";
import React, { useState } from "react";

interface PropertyGalleryProps {
  images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"];

  return (
    <div className="flex flex-col gap-4">
      {/* Featured Big Image */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-850 shadow-md">
        <img
          src={displayImages[activeIndex]}
          alt={`Property image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";
          }}
        />
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-neutral-950 border-2 transition-all cursor-pointer ${
                  isActive
                    ? "border-[var(--primary)] scale-95 shadow-md"
                    : "border-neutral-800 hover:border-neutral-600"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80";
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
