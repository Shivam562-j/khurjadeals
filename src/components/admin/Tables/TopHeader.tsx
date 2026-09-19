"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MdFilterList,
  MdKeyboardArrowDown,
  MdAdd,
  MdNotificationsNone,
  MdSearch,
  MdClose,
} from "react-icons/md";

export interface TopHeaderProps {
  title?: string;
  searchText?: string;
  setSearchText?: (text: string) => void;
  handleSearchEnter?: (text: string) => void;
  filterCount?: number;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  statusOptions?: { label: string; value: string }[];
  actionButtonText?: string;
  handleActionClick?: () => void;
  handleAlertRepeat?: () => void;
}

export const iconButtonStyles = {
  width: "40px",
  height: "40px",
  borderRadius: "100px",
  backgroundColor: "#FCFCFC",
  color: "#555E6F",
  border: "1px solid #D8DDE7",
};

export default function TopHeader({
  title = "Select Asset from List",
  searchText = "",
  setSearchText,
  handleSearchEnter,
  filterCount = 0,
  selectedStatus = "all",
  onStatusChange,
  statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Offline / Pending", value: "pending" },
    { label: "Contacted", value: "contacted" },
    { label: "Online / Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ],
  actionButtonText = "New Entry",
  handleActionClick,
  handleAlertRepeat,
}: TopHeaderProps) {
  const [searchInputOpen, setSearchInputOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close filter popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (searchInputOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputOpen]);

  return (
    <div className="w-full p-4 flex flex-row gap-4 items-center justify-between border-b border-[#E5E9F0] bg-[#FCFCFC] shrink-0 select-none">
      {/* ── LEFT: TITLE ── */}
      <div className="justify-center text-[#252A34] text-sm font-semibold font-['Inter'] leading-5 tracking-tight">
        {title}
      </div>

      {/* ── RIGHT: ACTIONS ── */}
      <div className="flex items-center gap-3 ml-auto">
        {/* 1. SEARCH: Expandable Search Input / Icon Button */}
        {searchInputOpen ? (
          <div className="relative flex items-center bg-[#F3F5F8] border border-[#D8DDE7] rounded-md px-2.5 py-1.5 transition-all w-48 sm:w-64">
            <MdSearch className="text-[#555E6F] text-lg mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText && setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && handleSearchEnter) {
                  handleSearchEnter(searchText);
                }
              }}
              className="w-full bg-transparent text-xs text-[#252A34] font-medium outline-none placeholder-[#949CAC]"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText && setSearchText("")}
                className="text-[#949CAC] hover:text-[#555E6F] mr-1 p-0.5 cursor-pointer"
              >
                <MdClose className="text-sm" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSearchInputOpen(false);
                if (!searchText && setSearchText) setSearchText("");
              }}
              title="Close search"
              className="text-[#555E6F] hover:bg-[#E5E9F0] rounded p-0.5 transition-colors cursor-pointer"
            >
              <MdClose className="text-base" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSearchInputOpen(true)}
            title="Search"
            className="w-10 h-10 rounded-full bg-[#FCFCFC] hover:bg-[#E5E9F0] border border-[#D8DDE7] text-[#555E6F] flex items-center justify-center transition-colors cursor-pointer"
          >
            <MdSearch className="text-xl" />
          </button>
        )}

        {/* 2. FILTER: CustomButton with Badge + Popover */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="h-10 px-3 py-2 bg-[#F3F5F8] hover:bg-[#E5E9F0] text-[#252A34] border border-[#D8DDE7] rounded text-xs font-semibold font-['Inter'] flex items-center gap-2 transition-colors cursor-pointer"
            style={{ minWidth: filterCount === 0 ? "110px" : "140px" }}
          >
            <MdFilterList className="text-base text-[#555E6F]" />
            <span>Filter</span>
            <div className="flex justify-end items-center gap-1.5 ml-auto">
              {filterCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 font-bold rounded-full bg-[#D51D10] text-[#FCFCFC]">
                  {filterCount}
                </span>
              )}
              <MdKeyboardArrowDown
                className={`text-base text-[#555E6F] transition-transform ${
                  filterOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Filter Popover */}
          {filterOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 bg-[#FCFCFC] rounded-md shadow-[0px_4px_32px_0px_rgba(14,17,24,0.12)] border border-[#E5E9F0] p-2 flex flex-col space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#555E6F] uppercase tracking-wider border-b border-[#E5E9F0]">
                Filter by Status
              </div>
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onStatusChange && onStatusChange(opt.value);
                    setFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded transition-colors flex items-center justify-between cursor-pointer ${
                    selectedStatus === opt.value
                      ? "bg-[#E5E9F0] text-[#009E71] font-bold"
                      : "text-[#252A34] hover:bg-[#F3F5F8]"
                  }`}
                >
                  <span>{opt.label}</span>
                  {selectedStatus === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-[#009E71]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. PRIMARY ACTION BUTTON: CustomButton */}
        {actionButtonText && (
          <button
            type="button"
            onClick={handleActionClick}
            className="h-10 px-3.5 py-2 bg-[#F3F5F8] hover:bg-[#E5E9F0] text-[#252A34] border border-[#D8DDE7] rounded text-xs font-semibold font-['Inter'] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MdAdd className="text-base text-[#555E6F]" />
            <span>{actionButtonText}</span>
          </button>
        )}

        {/* 4. NOTIFICATION / ALERT ICON BUTTON */}
        <button
          type="button"
          onClick={handleAlertRepeat}
          title="Notifications"
          className="w-10 h-10 rounded-full bg-[#FCFCFC] hover:bg-[#E5E9F0] border border-[#D8DDE7] text-[#555E6F] active:text-[#008761] flex items-center justify-center transition-colors cursor-pointer"
        >
          <MdNotificationsNone className="text-xl" />
        </button>
      </div>
    </div>
  );
}
