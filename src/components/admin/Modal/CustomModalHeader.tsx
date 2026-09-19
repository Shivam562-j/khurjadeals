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
  badgeBgColor = "#DAF5ED",
  badgeTextColor = "#006C4D",
}: CustomModalHeaderProps) {
  return (
    <div className="p-4 sm:p-5 border-b border-[#E5E9F0] bg-[#FCFCFC] flex items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <h3 className="text-[#252A34] text-base sm:text-lg font-bold leading-tight truncate">
          {headerTitle}
        </h3>

        {badgeText && (
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0"
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
        className="w-8 h-8 rounded-full flex items-center justify-center text-[#555E6F] hover:bg-[#E5E9F0] transition-colors cursor-pointer shrink-0"
      >
        <MdClose className="text-xl" />
      </button>
    </div>
  );
}
