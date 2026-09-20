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

const STATUS_OPTIONS: { label: string; value: QueryStatus; bg: string; text: string; border: string }[] = [
  { label: "Pending", value: "pending", bg: "rgba(120, 53, 15, 0.25)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.4)" },
  { label: "Contacted", value: "contacted", bg: "rgba(30, 58, 138, 0.25)", text: "#60a5fa", border: "rgba(96, 165, 250, 0.4)" },
  { label: "Resolved", value: "resolved", bg: "rgba(6, 78, 59, 0.25)", text: "#34d399", border: "rgba(52, 211, 153, 0.4)" },
  { label: "Closed", value: "closed", bg: "rgba(39, 39, 42, 0.5)", text: "#a1a1aa", border: "rgba(113, 113, 122, 0.4)" },
];

export default function QueryDrawerDetails({
  query,
  onStatusChange,
}: QueryDrawerDetailsProps) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#737373]">
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
    <div className="w-full flex flex-col gap-5 pb-6 text-white">
      {/* ── KEY STATUS & TYPE CARD ── */}
      <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] p-3.5 rounded-xl border border-[#262626]">
        <div>
          <span className="text-xs text-[#a3a3a3] block font-normal">
            Enquiry Type
          </span>
          <span className="text-base font-bold capitalize text-white leading-tight mt-0.5 block">
            {query.type || "General"}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#a3a3a3] block font-normal mb-1">
            Current Status
          </span>
          {onStatusChange ? (
            <select
              value={query.status}
              onChange={(e) => onStatusChange(query._id, e.target.value as QueryStatus)}
              className="text-xs font-bold rounded-lg px-2.5 py-1 outline-none border border-[#333333] cursor-pointer bg-[#0d0d0d] text-white focus:border-[#e8590c]"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#171717] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <span
              className="capitalize px-2.5 py-0.5 rounded-full text-xs font-bold inline-block border"
              style={{
                backgroundColor: currentStatusObj.bg,
                color: currentStatusObj.text,
                borderColor: currentStatusObj.border,
              }}
            >
              {query.status}
            </span>
          )}
        </div>
      </div>

      {/* ── CONTACT PERSON DETAILS ── */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MdPerson className="text-base text-[#f59e0b]" /> User Information
        </h4>

        <InfoRow label="Customer Name" value={query.name || "─"} />

        <InfoRow
          label="Phone Number"
          value={
            query.phone ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white">
                  {query.phone}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyPhone(query.phone)}
                  title="Copy Phone"
                  className="p-1 text-[#a3a3a3] hover:text-[#f59e0b] hover:bg-[#262626] rounded-md transition cursor-pointer"
                >
                  {copiedPhone ? (
                    <MdCheck className="text-sm text-emerald-400" />
                  ) : (
                    <MdContentCopy className="text-sm" />
                  )}
                </button>

                <a
                  href={`tel:${query.phone}`}
                  title="Call"
                  className="p-1 text-[#a3a3a3] hover:text-blue-400 hover:bg-[#1a2234] rounded-md transition"
                >
                  <MdPhone className="text-sm" />
                </a>

                <a
                  href={`https://wa.me/91${query.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  title="WhatsApp"
                  className="p-1 text-emerald-400 hover:bg-emerald-950/50 rounded-md transition"
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
                <span className="text-xs text-white font-medium">
                  {query.email}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyEmail(query.email!)}
                  title="Copy Email"
                  className="p-1 text-[#a3a3a3] hover:text-[#f59e0b] hover:bg-[#262626] rounded-md transition cursor-pointer"
                >
                  {copiedEmail ? (
                    <MdCheck className="text-sm text-emerald-400" />
                  ) : (
                    <MdContentCopy className="text-sm" />
                  )}
                </button>
                <a
                  href={`mailto:${query.email}`}
                  title="Send Email"
                  className="p-1 text-[#a3a3a3] hover:text-blue-400 hover:bg-[#1a2234] rounded-md transition"
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
              <span className="font-mono text-xs text-[#a3a3a3]">
                {query.referenceId}
              </span>
            }
          />
        )}
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── MESSAGE / QUERY DETAILS ── */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <MdOutlineMessage className="text-base text-[#f59e0b]" /> Enquiry Message
        </h4>
        <div className="p-3.5 bg-[#171717] rounded-xl border border-[#262626] text-sm text-[#e5e5e5] leading-relaxed whitespace-pre-wrap">
          {query.message || "No message content provided."}
        </div>
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── CONVERT TO LISTING ACTIONS ── */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Quick Conversions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Link
            href={`/admin/properties?add=true&title=${encodeURIComponent("Listing from " + query.name)}&description=${encodeURIComponent(query.message)}&contactName=${encodeURIComponent(query.name)}&contactPhone=${encodeURIComponent(query.phone)}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#2a170d] border border-[#e8590c]/40 text-[#f59e0b] hover:bg-gradient-to-r hover:from-[#e8590c] hover:to-[#f59e0b] hover:text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <MdHome className="text-sm" />
            Convert to Property
          </Link>

          <Link
            href={`/admin/products?add=true&title=${encodeURIComponent("Listing from " + query.name)}&description=${encodeURIComponent(query.message)}&contactName=${encodeURIComponent(query.name)}&contactPhone=${encodeURIComponent(query.phone)}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#1a2234] border border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <MdShoppingBag className="text-sm" />
            Convert to Product
          </Link>
        </div>
      </div>

      <div className="border-b border-[#262626]" />

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
