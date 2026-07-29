"use client";
import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";

interface PropertyGalleryProps {
  images: string[];
  title?: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"];

  return (
    <div className="det-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Featured Main Image */}
      <div className="det-gallery-main" style={{ maxHeight: 480 }}>
        <img
          src={displayImages[activeIndex]}
          alt={title || `Property photo ${activeIndex + 1}`}
          className="det-gallery-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Counter Pill */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(10, 10, 10, 0.75)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: 50,
            padding: "6px 14px",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FaCamera style={{ color: "var(--primary)" }} />
          {activeIndex + 1} / {displayImages.length} Photos
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="det-gallery-thumbs">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`det-thumb${idx === activeIndex ? " active" : ""}`}
              aria-label={`View photo ${idx + 1}`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="det-thumb-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
