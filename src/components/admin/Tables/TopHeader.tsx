"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MdFilterList,
  MdKeyboardArrowDown,
  MdFileDownload,
  MdSearch,
  MdClose,
  MdAdd,
} from "react-icons/md";
import Filter, { FilterFormData, FilterSection } from "./Filter";
import CustomSearch from "./CustomSearch";
import SearchIconButton from "./SearchIconButton";

export interface TopHeaderProps {
  title?: string;
  searchInput?: boolean;
  searchText?: string;
  cacheSearchText?: string;
  dispatchSearch?: (action: any) => void;
  searchActions?: any;
  setSearchText?: (text: string) => void;
  handleSearchEnter?: (text: string) => void;
  filterFormData?: FilterFormData;
  handleFilterFormDataChange?: (key: string, value: string[]) => void;
  setFilterFormData?: React.Dispatch<React.SetStateAction<FilterFormData>>;
  filterCount?: number;
  filterSections?: FilterSection[];
  actionButtonText?: string;
  actionButtonColor?: "green" | "gray";
  handleActionClick?: () => void;
  handleExportClick?: () => void;
  exportTitle?: string;
  showFilter?: boolean;
  refetch?: () => void;
}

export default function TopHeader({
  title = "Inquiries List",
  searchInput,
  searchText = "",
  cacheSearchText = "",
  dispatchSearch,
  searchActions,
  setSearchText,
  handleSearchEnter,
  filterFormData = {},
  handleFilterFormDataChange = () => {},
  setFilterFormData = () => {},
  filterCount = 0,
  filterSections,
  actionButtonText,
  actionButtonColor = "green",
  handleActionClick,
  handleExportClick,
  exportTitle = "Export (CSV)",
  showFilter = true,
  refetch,
}: TopHeaderProps) {
  const [searchInputOpen, setSearchInputOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search input on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
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
    <div className="w-full p-4 flex flex-row gap-4 items-center justify-between border-b border-[#E5E9F0] bg-[#FCFCFC] shrink-0 font-sans">
      {/* ── LEFT: TITLE ── */}
      <div className="justify-center text-[#252A34] text-sm font-semibold leading-5 tracking-tight font-sans">
        {title}
      </div>

      {/* ── RIGHT: ACTIONS ── */}
      <div className="flex items-center gap-3 ml-auto">
        {/* 1. SEARCH: Controlled CustomSearch (onEnter only) matching Vecmocon UX */}
        {dispatchSearch !== undefined ? (
          searchInput ? (
            <CustomSearch
              searchText={searchText}
              cacheSearchText={cacheSearchText}
              searchDispatch={dispatchSearch}
              setSearchInput={(val) =>
                dispatchSearch({
                  type: searchActions?.SET_SEARCH_INPUT || "SET_SEARCH_INPUT",
                  payload: val,
                })
              }
              onEnter={handleSearchEnter}
            />
          ) : (
            <SearchIconButton
              onClick={() =>
                dispatchSearch({
                  type: searchActions?.SET_SEARCH_INPUT || "SET_SEARCH_INPUT",
                  payload: true,
                })
              }
            />
          )
        ) : searchInputOpen ? (
          <div
            ref={searchContainerRef}
            className="relative flex items-center h-9 bg-white border border-[#008761] ring-2 ring-[#008761]/15 rounded-md px-3 transition-all duration-200 w-56 sm:w-72 shadow-xs"
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
              className="w-full bg-transparent text-xs sm:text-sm text-[#252A34] font-normal leading-tight outline-none placeholder-[#949CAC]"
            />
            {searchText?.trim().length > 0 && (
              <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-[#008761] bg-[#DAF5ED] px-1.5 py-0.5 rounded mr-1.5 shrink-0 select-none">
                ↵ Enter
              </span>
            )}
            {/* Circular rounded close button */}
            <button
              type="button"
              onClick={() => {
                if (searchText) {
                  setSearchText && setSearchText("");
                  handleSearchEnter && handleSearchEnter("");
                } else {
                  setSearchInputOpen(false);
                }
              }}
              title={searchText ? "Clear search" : "Close search"}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#555E6F] hover:text-[#252A34] bg-[#F3F5F8] hover:bg-[#E5E9F0] transition-colors cursor-pointer shrink-0 ml-0.5"
            >
              <MdClose className="text-xs" />
            </button>
          </div>
        ) : (
          <SearchIconButton onClick={() => setSearchInputOpen(true)} />
        )}

        {/* 2. FILTER: CustomButton with Badge + Rich Filter Popover */}
        {showFilter && (
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
              <Filter
                handleCloseFilter={() => setFilterOpen(false)}
                filterFormData={filterFormData}
                handleFilterFormDataChange={handleFilterFormDataChange}
                setFilterFormData={setFilterFormData}
                filterCount={filterCount}
                sections={filterSections}
                refetch={refetch}
                anchorEl={filterRef.current}
              />
            )}
          </div>
        )}

        {/* 3. PRIMARY ACTION BUTTON (e.g. New Property, matching user screenshot) */}
        {actionButtonText && (
          <button
            type="button"
            onClick={handleActionClick}
            className={`h-10 px-3.5 sm:px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap shrink-0 ${
              actionButtonColor === "green"
                ? "bg-[#008761] hover:bg-[#006C4D] text-white border border-[#008761]"
                : "bg-[#F3F5F8] hover:bg-[#E5E9F0] text-[#252A34] border border-[#D8DDE7]"
            }`}
          >
            <MdAdd className="text-base shrink-0" />
            <span>{actionButtonText.replace(/^\+\s*/, "")}</span>
          </button>
        )}

        {/* 4. EXPORT BUTTON (CSV Download) */}
        {handleExportClick && (
          <button
            type="button"
            onClick={handleExportClick}
            title={exportTitle}
            className="w-10 h-10 rounded-full bg-[#FCFCFC] hover:bg-[#E5E9F0] border border-[#D8DDE7] text-[#555E6F] active:text-[#008761] flex items-center justify-center transition-colors cursor-pointer"
          >
            <MdFileDownload className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
}
