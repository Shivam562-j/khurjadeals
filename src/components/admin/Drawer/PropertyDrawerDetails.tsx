"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import InfoRow from "./InfoRow";
import {
  MdContentCopy,
  MdCheck,
  MdPhone,
  MdOpenInNew,
  MdLocationOn,
  MdVisibility,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

export interface PropertyDrawerDetailsProps {
  property?: Property | null;
  onOpenLive?: (id: string) => void;
}

export default function PropertyDrawerDetails({
  property,
}: PropertyDrawerDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#555E6F]">
        <p className="text-sm font-medium">No property selected</p>
      </div>
    );
  }

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy phone:", err);
    }
  };

  const images = property.images && property.images.length > 0 ? property.images : [];
  const currentImage = images[selectedImageIndex] || images[0];

  // Format date helper
  const formatDate = (dateStr?: string | Date) => {
    if (!dateStr) return "─";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 pb-6 text-white">
      {/* ── IMAGE SHOWCASE (if available) ── */}
      {images.length > 0 && (
        <div className="flex flex-col gap-2 bg-[#1a1a1a] p-3 rounded-xl border border-[#262626]">
          <div className="relative w-full h-52 rounded-lg overflow-hidden bg-[#0d0d0d]">
            <Image
              src={currentImage}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
              unoptimized
            />
            <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md font-medium border border-white/10">
              {selectedImageIndex + 1} / {images.length}
            </span>
          </div>

          {/* Thumbnails if > 1 */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-12 rounded-lg shrink-0 overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? "border-[#e8590c] ring-1 ring-[#e8590c]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`thumbnail-${idx}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── KEY SPECS GRID ── */}
      <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] p-3.5 rounded-xl border border-[#262626]">
        <div>
          <span className="text-xs text-[#a3a3a3] block font-normal">
            Asking Price
          </span>
          <span className="text-lg font-bold text-[#f59e0b] leading-tight mt-0.5 block">
            ₹{Number(property.price || 0).toLocaleString("en-IN")}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#a3a3a3] block font-normal">
            Total Area
          </span>
          <span className="text-base font-bold text-white leading-tight mt-0.5 block">
            {property.area} {property.areaUnit || "sqft"}
          </span>
        </div>
      </div>

      {/* ── BASIC ATTRIBUTES ── */}
      <div className="flex flex-col gap-1">
        <InfoRow
          label="Property Type"
          value={
            <span className="capitalize font-semibold text-white px-2.5 py-0.5 rounded-md bg-[#1f1f1f] border border-[#333333] text-xs">
              {property.type || "─"}
            </span>
          }
        />

        <InfoRow
          label="Listing Purpose"
          value={
            <span className="capitalize font-semibold text-[#f59e0b] px-2.5 py-0.5 rounded-md bg-[#2a170d] border border-[#e8590c]/30 text-xs">
              For {property.listingType || "Sell"}
            </span>
          }
        />

        <InfoRow
          label="Featured Listing"
          value={
            property.isFeatured ? (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#2a170d] text-[#f59e0b] border border-[#e8590c]/40">
                ★ Featured
              </span>
            ) : (
              <span className="text-xs text-[#a3a3a3]">Standard</span>
            )
          }
        />

        <InfoRow
          label="Status"
          value={
            <span
              className={`capitalize px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                property.status === "active"
                  ? "bg-[#0a2e1d] text-[#34d399] border-[#065f46]"
                  : property.status === "sold"
                  ? "bg-[#2d1212] text-[#f87171] border-[#7f1d1d]"
                  : property.status === "rented"
                  ? "bg-[#161b2e] text-[#60a5fa] border-[#2563eb]"
                  : "bg-[#222222] text-[#a3a3a3] border-[#333333]"
              }`}
            >
              {property.status || "Inactive"}
            </span>
          }
        />
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── LOCATION INFORMATION ── */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MdLocationOn className="text-base text-[#e8590c]" /> Location Details
        </h4>

        <InfoRow label="City / Locality" value={property.location || "─"} />
        <InfoRow label="Exact Address" value={property.address || "─"} />
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── CONTACT INFORMATION ── */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MdPhone className="text-base text-[#e8590c]" /> Contact Person
        </h4>

        <InfoRow label="Name" value={property.contactName || "─"} />

        <InfoRow
          label="Phone Number"
          value={
            property.contactPhone ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white">
                  {property.contactPhone}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(property.contactPhone)}
                  title="Copy Phone"
                  className="p-1 text-[#a3a3a3] hover:text-[#f59e0b] hover:bg-[#222222] rounded transition cursor-pointer"
                >
                  {copied ? (
                    <MdCheck className="text-sm text-green-400" />
                  ) : (
                    <MdContentCopy className="text-sm" />
                  )}
                </button>

                <a
                  href={`tel:${property.contactPhone}`}
                  title="Call"
                  className="p-1 text-[#a3a3a3] hover:text-blue-400 hover:bg-[#222222] rounded transition"
                >
                  <MdPhone className="text-sm" />
                </a>

                <a
                  href={`https://wa.me/91${property.contactPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="p-1 text-green-400 hover:bg-emerald-950/40 rounded transition"
                >
                  <FaWhatsapp className="text-sm" />
                </a>
              </div>
            ) : (
              "─"
            )
          }
        />
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── DESCRIPTION BOX ── */}
      {property.description && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Description
          </h4>
          <div className="p-3 bg-[#1a1a1a] rounded-xl border border-[#262626] text-sm text-[#d4d4d4] leading-relaxed whitespace-pre-wrap">
            {property.description}
          </div>
        </div>
      )}

      {/* ── FEATURES / AMENITIES ── */}
      {property.features && property.features.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Features & Amenities
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {property.features.map((feat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#1f1f1f] border border-[#333333] text-[#d4d4d4] text-xs font-medium rounded-md"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-b border-[#262626]" />

      {/* ── METADATA & STATS ── */}
      <div className="flex flex-col gap-1">
        <InfoRow
          label="Total Views"
          value={
            <span className="flex items-center gap-1.5 text-xs text-[#a3a3a3]">
              <MdVisibility className="text-sm text-[#f59e0b]" />
              {property.views || 0} views
            </span>
          }
        />
        <InfoRow
          label="Listed Date"
          value={formatDate(property.createdAt)}
        />
        <InfoRow
          label="Last Updated"
          value={formatDate(property.updatedAt)}
        />
      </div>

      {/* ── EXTERNAL LIVE LINK BUTTON ── */}
      <div className="pt-2">
        <a
          href={`/properties/${property.slug || property._id}`}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1f1f1f] border border-[#e8590c] text-[#f59e0b] hover:bg-[#e8590c] hover:text-white rounded-lg text-sm font-semibold transition-all shadow-xs"
        >
          <MdOpenInNew className="text-base" />
          Open Public Listing
        </a>
      </div>
    </div>
  );
}
