"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Query, QueryStatus } from "@/types/query";
import InfoRow from "./InfoRow";
import {
  MdContentCopy,
  MdCheck,
  MdPhone,
  MdEmail,
  MdOpenInNew,
  MdPerson,
  MdOutlineMessage,
  MdHome,
  MdShoppingBag,
} from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

export interface QueryDrawerDetailsProps {
  query?: Query | null;
  onStatusChange?: (id: string, status: QueryStatus) => void;
}

const STATUS_OPTIONS: { label: string; value: QueryStatus; bg: string; text: string }[] = [
  { label: "Pending", value: "pending", bg: "#FEF3C7", text: "#B45309" },
  { label: "Contacted", value: "contacted", bg: "#E5EBFD", text: "#1249ED" },
  { label: "Resolved", value: "resolved", bg: "#DAF5ED", text: "#006C4D" },
  { label: "Closed", value: "closed", bg: "#F3F5F8", text: "#555E6F" },
];

export default function QueryDrawerDetails({
  query,
  onStatusChange,
}: QueryDrawerDetailsProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#555E6F]">
        <p className="text-sm font-medium">No enquiry selected</p>
      </div>
    );
  }

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      console.error("Failed to copy phone:", err);
    }
  };

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

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

  const currentStatusObj =
    STATUS_OPTIONS.find((s) => s.value === query.status) || STATUS_OPTIONS[0];

  return (
    <div className="w-full flex flex-col gap-5 pb-6">
      {/* ── KEY STATUS & TYPE CARD ── */}
      <div className="grid grid-cols-2 gap-2 bg-[#F3F5F8] p-3.5 rounded-lg border border-[#E5E9F0]">
        <div>
          <span className="text-xs text-[#555E6F] block font-normal">
            Enquiry Type
          </span>
          <span className="text-base font-bold capitalize text-[#252A34] leading-tight mt-0.5 block">
            {query.type || "General"}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#555E6F] block font-normal mb-1">
            Current Status
          </span>
          {onStatusChange ? (
            <select
              value={query.status}
              onChange={(e) => onStatusChange(query._id, e.target.value as QueryStatus)}
              className="text-xs font-bold rounded px-2 py-1 outline-none border border-[#D8DDE6] cursor-pointer bg-white"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <span
              className="capitalize px-2 py-0.5 rounded text-xs font-bold inline-block"
              style={{
                backgroundColor: currentStatusObj.bg,
                color: currentStatusObj.text,
              }}
            >
              {query.status}
            </span>
          )}
        </div>
      </div>

      {/* ── CONTACT PERSON DETAILS ── */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MdPerson className="text-base text-[#008761]" /> User Information
        </h4>

        <InfoRow label="Customer Name" value={query.name || "─"} />

        <InfoRow
          label="Phone Number"
          value={
            query.phone ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-[#252A34]">
                  {query.phone}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(query.phone)}
                  title="Copy Phone"
                  className="p-1 text-gray-500 hover:text-[#008761] hover:bg-[#E5E9F0] rounded transition cursor-pointer"
                >
                  {copiedPhone ? (
                    <MdCheck className="text-sm text-green-600" />
                  ) : (
                    <MdContentCopy className="text-sm" />
                  )}
                </button>

                <a
                  href={`tel:${query.phone}`}
                  title="Call"
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-[#E5EBFD] rounded transition"
                >
                  <MdPhone className="text-sm" />
                </a>

                <a
                  href={`https://wa.me/91${query.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="p-1 text-green-600 hover:bg-emerald-50 rounded transition"
                >
                  <FaWhatsapp className="text-sm" />
                </a>
              </div>
            ) : (
              "─"
            )
          }
        />

        {query.email && (
          <InfoRow
            label="Email Address"
            value={
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#252A34] font-medium">
                  {query.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(query.email!)}
                  title="Copy Email"
                  className="p-1 text-gray-500 hover:text-[#008761] hover:bg-[#E5E9F0] rounded transition cursor-pointer"
                >
                  {copiedEmail ? (
                    <MdCheck className="text-sm text-green-600" />
                  ) : (
                    <MdContentCopy className="text-sm" />
                  )}
                </button>
                <a
                  href={`mailto:${query.email}`}
                  title="Send Email"
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-[#E5EBFD] rounded transition"
                >
                  <MdEmail className="text-sm" />
                </a>
              </div>
            }
          />
        )}

        {query.referenceId && (
          <InfoRow
            label="Reference ID"
            value={
              <span className="font-mono text-xs text-[#555E6F]">
                {query.referenceId}
              </span>
            }
          />
        )}
      </div>

      <div className="border-b border-[#E5E9F0]" />

      {/* ── MESSAGE / QUERY DETAILS ── */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider flex items-center gap-1.5">
          <MdOutlineMessage className="text-base text-[#008761]" /> Enquiry Message
        </h4>
        <div className="p-3.5 bg-[#F3F5F8] rounded-md border border-[#E5E9F0] text-sm text-[#252A34] leading-relaxed whitespace-pre-wrap">
          {query.message || "No message content provided."}
        </div>
      </div>

      <div className="border-b border-[#E5E9F0]" />

      {/* ── CONVERT TO LISTING ACTIONS ── */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider">
          Quick Conversions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href={`/admin/properties?add=true&title=${encodeURIComponent("Listing from " + query.name)}&description=${encodeURIComponent(query.message)}&contactName=${encodeURIComponent(query.name)}&contactPhone=${encodeURIComponent(query.phone)}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-[#008761] text-[#008761] hover:bg-[#008761] hover:text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            <MdHome className="text-sm" />
            Convert to Property
          </Link>

          <Link
            href={`/admin/products?add=true&title=${encodeURIComponent("Listing from " + query.name)}&description=${encodeURIComponent(query.message)}&contactName=${encodeURIComponent(query.name)}&contactPhone=${encodeURIComponent(query.phone)}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
          >
            <MdShoppingBag className="text-sm" />
            Convert to Product
          </Link>
        </div>
      </div>

      <div className="border-b border-[#E5E9F0]" />

      {/* ── METADATA ── */}
      <div className="flex flex-col gap-1">
        <InfoRow
          label="Received Date"
          value={formatDate(query.createdAt)}
        />
        <InfoRow
          label="Last Status Update"
          value={formatDate(query.updatedAt)}
        />
      </div>
    </div>
  );
}
