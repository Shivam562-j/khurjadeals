"use client";

import React from "react";
import { MdClose } from "react-icons/md";

export interface CustomModalHeaderProps {
  headerTitle: string;
  handleCloseModal: () => void;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
}

export default function CustomModalHeader({
  headerTitle,
  handleCloseModal,
  badgeText,
  badgeBgColor = "#2a170d",
  badgeTextColor = "#f59e0b",
}: CustomModalHeaderProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#141414] flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <h3 className="text-[#ffffff] text-base sm:text-lg font-bold leading-tight truncate">
          {headerTitle}
        </h3>

        {badgeText && (
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 border border-[#e8590c]/30"
            style={{
              backgroundColor: badgeBgColor,
              color: badgeTextColor,
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleCloseModal}
        title="Close modal"
        className="w-8 h-8 rounded-full flex items-center justify-center text-[#a3a3a3] hover:text-white hover:bg-[#222222] transition-colors cursor-pointer shrink-0"
      >
        <MdClose className="text-xl" />
      </button>
    </div>
  );
}
