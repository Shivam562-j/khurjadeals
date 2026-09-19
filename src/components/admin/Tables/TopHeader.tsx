"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MdFilterList,
  MdKeyboardArrowDown,
  MdFileDownload,
  MdSearch,
  MdClose,
} from "react-icons/md";
import Filter, { FilterFormData } from "./Filter";

export interface TopHeaderProps {
  title?: string;
  searchText?: string;
  setSearchText?: (text: string) => void;
  handleSearchEnter?: (text: string) => void;
  filterFormData?: FilterFormData;
  handleFilterFormDataChange?: (key: string, value: string[]) => void;
  setFilterFormData?: React.Dispatch<React.SetStateAction<FilterFormData>>;
  filterCount?: number;
  handleExportClick?: () => void;
}

export default function TopHeader({
  title = "Inquiries List",
  searchText = "",
  setSearchText,
  handleSearchEnter,
  filterFormData = { status: [], type: [] },
  handleFilterFormDataChange = () => {},
  setFilterFormData = () => {},
  filterCount = 0,
  handleExportClick,
}: TopHeaderProps) {
  const [searchInputOpen, setSearchInputOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (!searchText) {
          setSearchInputOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchText]);

  // Focus search input when opened
  useEffect(() => {
    if (searchInputOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputOpen]);

  return (
    <div className="w-full p-4 flex flex-row gap-4 items-center justify-between border-b border-[#E5E9F0] bg-[#FCFCFC] shrink-0 select-none font-sans">
      {/* ── LEFT: TITLE ── */}
      <div className="justify-center text-[#252A34] text-sm font-semibold leading-5 tracking-tight font-sans">
        {title}
      </div>

      {/* ── RIGHT: ACTIONS ── */}
      <div className="flex items-center gap-3 ml-auto">
        {/* 1. SEARCH: Expandable Search Input / Icon Button with Single Close Button */}
        {searchInputOpen ? (
          <div
            ref={searchContainerRef}
            className="relative flex items-center bg-[#F3F5F8] border border-[#D8DDE7] rounded-md px-2.5 py-1.5 transition-all w-52 sm:w-64"
          >
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
                if (e.key === "Escape") {
                  if (searchText) {
                    setSearchText && setSearchText("");
                  } else {
                    setSearchInputOpen(false);
                  }
                }
              }}
              className="w-full bg-transparent text-xs text-[#252A34] font-medium outline-none placeholder-[#949CAC]"
            />
            {/* Single clean close/clear button (NO duplicate 'x' icons!) */}
            <button
              type="button"
              onClick={() => {
                if (searchText) {
                  setSearchText && setSearchText("");
                } else {
                  setSearchInputOpen(false);
                }
              }}
              title={searchText ? "Clear search" : "Close search"}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[#555E6F] hover:bg-[#E5E9F0] transition-colors cursor-pointer shrink-0 ml-1"
            >
              <MdClose className="text-xs" />
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

        {/* 2. FILTER: CustomButton with Badge + Rich Filter Popover */}
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="h-10 px-3 py-2 bg-[#F3F5F8] hover:bg-[#E5E9F0] text-[#252A34] border border-[#D8DDE7] rounded text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            style={{ minWidth: filterCount === 0 ? "110px" : "140px" }}
          >
            <MdFilterList className="text-base text-[#555E6F]" />
            <span>Filter</span>
            <div className="flex justify-end items-center gap-1.5 ml-auto">
              {filterCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 font-bold rounded-full bg-[#D51D10] text-[#FCFCFC]">
                  {filterCount}
                </span>
              )}
              <MdKeyboardArrowDown
                className={`text-base text-[#555E6F] transition-transform duration-200 ${
                  filterOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {/* Filter Popover matching user specification */}
          {filterOpen && (
            <div className="absolute right-0 top-12 z-50">
              <Filter
                handleCloseFilter={() => setFilterOpen(false)}
                filterFormData={filterFormData}
                handleFilterFormDataChange={handleFilterFormDataChange}
                setFilterFormData={setFilterFormData}
                filterCount={filterCount}
              />
            </div>
          )}
        </div>

        {/* 3. EXPORT BUTTON (CSV Download) */}
        <button
          type="button"
          onClick={handleExportClick}
          title="Export Inquiries (CSV)"
          className="w-10 h-10 rounded-full bg-[#FCFCFC] hover:bg-[#E5E9F0] border border-[#D8DDE7] text-[#555E6F] active:text-[#008761] flex items-center justify-center transition-colors cursor-pointer"
        >
          <MdFileDownload className="text-xl" />
        </button>
      </div>
    </div>
  );
}
