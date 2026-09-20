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
        className={`relative z-10 h-full ${widthClass} bg-[#141414] shadow-[-8px_0px_32px_rgba(0,0,0,0.6)] border-l border-[#262626] flex flex-col font-sans animate-in slide-in-from-right duration-250`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── DRAWER HEADER ── */}
        <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#121212] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="min-w-0">
              <h3
                className="text-[#ffffff] text-base font-bold leading-tight truncate"
                title={headingText}
              >
                {headingText}
              </h3>
              {subheadingText && (
                <p className="text-xs text-[#a3a3a3] truncate mt-0.5">
                  {subheadingText}
                </p>
              )}
            </div>

            {/* Status Badge */}
            {badgeText && (
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 border border-[#e8590c]/30"
                style={{
                  backgroundColor: badgeBgColor || "#2a170d",
                  color: badgeTextColor || "#f59e0b",
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
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-[#f59e0b] transition-colors cursor-pointer"
              >
                <MdEdit className="text-lg" />
              </button>
            )}

            {isMoreViewDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                title="Delete"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#2d1212] hover:text-[#f87171] transition-colors cursor-pointer"
              >
                <MdDeleteOutline className="text-lg" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCloseRightModal}
              title="Close drawer"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#a3a3a3] hover:bg-[#1f1f1f] hover:text-white transition-colors cursor-pointer"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        </div>

        {/* ── DRAWER CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 bg-[#141414] text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
