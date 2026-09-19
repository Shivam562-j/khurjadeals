"use client";

import React, { useState } from "react";
import { User } from "@/types/user";
import InfoRow from "./InfoRow";
import {
  MdContentCopy,
  MdCheck,
  MdEmail,
  MdPerson,
  MdShield,
  MdSecurity,
} from "react-icons/md";

export interface UserDrawerDetailsProps {
  user?: User | null;
}

export default function UserDrawerDetails({ user }: UserDrawerDetailsProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[#555E6F]">
        <p className="text-sm font-medium">No administrator selected</p>
      </div>
    );
  }

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

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  const isAdmin = user.role === "admin";

  return (
    <div className="w-full flex flex-col gap-5 pb-6">
      {/* ── PROFILE BANNER CARD ── */}
      <div className="flex items-center gap-4 bg-[#F3F5F8] p-4 rounded-lg border border-[#E5E9F0]">
        <div className="w-14 h-14 rounded-full bg-[#008761] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#252A34] truncate">
              {user.name}
            </h3>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                user.status === "active"
                  ? "bg-[#DAF5ED] text-[#006C4D]"
                  : "bg-[#D8DDE7] text-[#565F70]"
              }`}
            >
              {user.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-xs text-[#555E6F] truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* ── ROLE & ACCESS CARD ── */}
      <div className="grid grid-cols-2 gap-2 bg-[#F3F5F8] p-3.5 rounded-lg border border-[#E5E9F0]">
        <div>
          <span className="text-xs text-[#555E6F] block font-normal">
            Assigned Role
          </span>
          <span
            className={`text-sm font-bold capitalize mt-0.5 inline-flex items-center gap-1 ${
              isAdmin ? "text-amber-700" : "text-[#1249ED]"
            }`}
          >
            <MdShield className="text-sm" />
            {isAdmin ? "Administrator" : "Moderator"}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#555E6F] block font-normal">
            Account Status
          </span>
          <span
            className={`text-sm font-bold capitalize mt-0.5 block ${
              user.status === "active" ? "text-[#006C4D]" : "text-[#565F70]"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* ── BASIC ATTRIBUTES ── */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MdPerson className="text-base text-[#008761]" /> Account Details
        </h4>

        <InfoRow label="Full Name" value={user.name || "─"} />

        <InfoRow
          label="Email Address"
          value={
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#252A34] font-medium font-mono">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => handleCopyEmail(user.email)}
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
                href={`mailto:${user.email}`}
                title="Send Email"
                className="p-1 text-gray-500 hover:text-blue-600 hover:bg-[#E5EBFD] rounded transition"
              >
                <MdEmail className="text-sm" />
              </a>
            </div>
          }
        />

        <InfoRow
          label="System Role"
          value={
            <span
              className={`capitalize px-2.5 py-0.5 rounded text-xs font-bold border ${
                isAdmin
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-blue-50 text-blue-800 border-blue-200"
              }`}
            >
              {isAdmin ? "Super Administrator" : "Content Moderator"}
            </span>
          }
        />
      </div>

      <div className="border-b border-[#E5E9F0]" />

      {/* ── PERMISSIONS / ACCESS PRIVILEGES ── */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider flex items-center gap-1.5">
          <MdSecurity className="text-base text-[#008761]" /> Permissions & Access
        </h4>
        <div className="p-3.5 bg-[#F3F5F8] rounded-md border border-[#E5E9F0] text-xs text-[#252A34] leading-relaxed space-y-2">
          {isAdmin ? (
            <>
              <p className="font-semibold text-amber-800">
                Full Administrative Privileges:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#555E6F]">
                <li>Create, update, and delete property listings</li>
                <li>Create, update, and delete Bazaar product listings</li>
                <li>Review and manage customer queries and lead submissions</li>
                <li>Manage platform administrators and moderator roles</li>
                <li>Access platform analytics and export CSV data</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-semibold text-blue-800">
                Content Moderator Privileges:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#555E6F]">
                <li>View and edit property listings</li>
                <li>View and edit Bazaar product listings</li>
                <li>Review and respond to customer queries</li>
                <li>Restricted from modifying administrative user accounts</li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border-b border-[#E5E9F0]" />

      {/* ── METADATA ── */}
      <div className="flex flex-col gap-1">
        <InfoRow label="Member Since" value={formatDate(user.createdAt)} />
        <InfoRow label="Last Profile Update" value={formatDate(user.updatedAt)} />
      </div>
    </div>
  );
}
