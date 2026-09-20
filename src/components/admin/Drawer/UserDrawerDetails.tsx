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
    <div className="w-full flex flex-col gap-5 pb-6 text-white">
      {/* ── PROFILE BANNER CARD ── */}
      <div className="flex items-center gap-4 bg-[#1a1a1a] p-4 rounded-xl border border-[#262626]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e8590c] to-[#f59e0b] text-white flex items-center justify-center font-black text-lg shadow-[0_4px_12px_rgba(232,89,12,0.35)] shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white truncate">
              {user.name}
            </h3>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                user.status === "active"
                  ? "bg-[#0a2e1d] text-[#34d399] border-[#065f46]"
                  : "bg-[#222222] text-[#a3a3a3] border-[#333333]"
              }`}
            >
              {user.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-xs text-[#a3a3a3] truncate mt-0.5">{user.email}</p>
        </div>
      </div>

      {/* ── ROLE & ACCESS CARD ── */}
      <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] p-3.5 rounded-xl border border-[#262626]">
        <div>
          <span className="text-xs text-[#a3a3a3] block font-normal">
            Assigned Role
          </span>
          <span
            className={`text-sm font-bold capitalize mt-0.5 inline-flex items-center gap-1 ${
              isAdmin ? "text-[#f59e0b]" : "text-[#60a5fa]"
            }`}
          >
            <MdShield className="text-sm" />
            {isAdmin ? "Administrator" : "Moderator"}
          </span>
        </div>
        <div>
          <span className="text-xs text-[#a3a3a3] block font-normal">
            Account Status
          </span>
          <span
            className={`text-sm font-bold capitalize mt-0.5 block ${
              user.status === "active" ? "text-[#34d399]" : "text-[#a3a3a3]"
            }`}
          >
            {user.status}
          </span>
        </div>
      </div>

      {/* ── BASIC ATTRIBUTES ── */}
      <div className="flex flex-col gap-1">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <MdPerson className="text-base text-[#e8590c]" /> Account Details
        </h4>

        <InfoRow label="Full Name" value={user.name || "─"} />

        <InfoRow
          label="Email Address"
          value={
            <div className="flex items-center gap-2">
              <span className="text-xs text-white font-medium font-mono">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => handleCopyEmail(user.email)}
                title="Copy Email"
                className="p-1 text-[#a3a3a3] hover:text-[#f59e0b] hover:bg-[#222222] rounded transition cursor-pointer"
              >
                {copiedEmail ? (
                  <MdCheck className="text-sm text-green-400" />
                ) : (
                  <MdContentCopy className="text-sm" />
                )}
              </button>
              <a
                href={`mailto:${user.email}`}
                title="Send Email"
                className="p-1 text-[#a3a3a3] hover:text-[#f59e0b] hover:bg-[#222222] rounded transition"
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
                  ? "bg-[#2a170d] text-[#f59e0b] border-[#e8590c]/40"
                  : "bg-[#161b2e] text-[#60a5fa] border-[#2563eb]/40"
              }`}
            >
              {isAdmin ? "Super Administrator" : "Content Moderator"}
            </span>
          }
        />
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── PERMISSIONS / ACCESS PRIVILEGES ── */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <MdSecurity className="text-base text-[#e8590c]" /> Permissions & Access
        </h4>
        <div className="p-3.5 bg-[#1a1a1a] rounded-xl border border-[#262626] text-xs text-[#d4d4d4] leading-relaxed space-y-2">
          {isAdmin ? (
            <>
              <p className="font-semibold text-[#f59e0b]">
                Full Administrative Privileges:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#a3a3a3]">
                <li>Create, update, and delete property listings</li>
                <li>Create, update, and delete Bazaar product listings</li>
                <li>Review and manage customer queries and lead submissions</li>
                <li>Manage platform administrators and moderator roles</li>
                <li>Access platform analytics and export CSV data</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-semibold text-[#60a5fa]">
                Content Moderator Privileges:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#a3a3a3]">
                <li>View and edit property listings</li>
                <li>View and edit Bazaar product listings</li>
                <li>Review and respond to customer queries</li>
                <li>Restricted from modifying administrative user accounts</li>
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="border-b border-[#262626]" />

      {/* ── METADATA ── */}
      <div className="flex flex-col gap-1">
        <InfoRow label="Member Since" value={formatDate(user.createdAt)} />
        <InfoRow label="Last Profile Update" value={formatDate(user.updatedAt)} />
      </div>
    </div>
  );
}
