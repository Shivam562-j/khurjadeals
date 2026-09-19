"use client";

import React, { useEffect } from "react";
import { MdClose, MdEdit, MdDeleteOutline } from "react-icons/md";

export interface RightDrawerProps {
  openModal: boolean;
  handleCloseRightModal: () => void;
  headingText?: string;
  subheadingText?: string;
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  isMoreViewEdit?: boolean;
  isMoreViewDelete?: boolean;
  handleEditClick?: () => void;
  handleDeleteClick?: () => void;
  children: React.ReactNode;
  widthClass?: string;
}

export default function RightDrawer({
  openModal = false,
  handleCloseRightModal,
  headingText = "Details",
  subheadingText,
  badgeText,
  badgeBgColor = "#DAF5ED",
  badgeTextColor = "#006C4D",
  isMoreViewEdit = false,
  isMoreViewDelete = false,
  handleEditClick,
  handleDeleteClick,
  children,
  widthClass = "w-full sm:w-[480px] md:w-[540px]",
}: RightDrawerProps) {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openModal) {
        handleCloseRightModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal, handleCloseRightModal]);

  // Prevent background body scrolling when open
  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openModal]);

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      {/* ── BACKDROP OVERLAY (Click away to close) ── */}
      <div
        onClick={handleCloseRightModal}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
      />

      {/* ── RIGHT DRAWER PANEL ── */}
      <div
        className={`relative z-10 h-full ${widthClass} bg-[#FCFCFC] shadow-[-8px_0px_32px_rgba(14,17,24,0.14)] border-l border-[#E5E9F0] flex flex-col font-sans animate-in slide-in-from-right duration-250`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── DRAWER HEADER ── */}
        <div className="p-4 sm:p-5 border-b border-[#E5E9F0] bg-[#FCFCFC] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="min-w-0">
              <h3
                className="text-[#252A34] text-base font-bold leading-tight truncate"
                title={headingText}
              >
                {headingText}
              </h3>
              {subheadingText && (
                <p className="text-xs text-[#555E6F] truncate mt-0.5">
                  {subheadingText}
                </p>
              )}
            </div>

            {/* Status Badge */}
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

          {/* Action Buttons: Edit, Delete, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isMoreViewEdit && (
              <button
                type="button"
                onClick={handleEditClick}
                title="Edit"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#555E6F] hover:bg-[#E5E9F0] hover:text-[#008761] transition-colors cursor-pointer"
              >
                <MdEdit className="text-lg" />
              </button>
            )}

            {isMoreViewDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                title="Delete"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#555E6F] hover:bg-[#FDE9E7] hover:text-[#D51D10] transition-colors cursor-pointer"
              >
                <MdDeleteOutline className="text-lg" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCloseRightModal}
              title="Close drawer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#555E6F] hover:bg-[#E5E9F0] transition-colors cursor-pointer"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* ── DRAWER CONTENT (Directly details, no tabs as requested) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
