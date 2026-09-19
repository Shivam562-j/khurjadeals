"use client";

import React, { memo } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import { searchActions } from "@/reducer/searchReducer";

export interface CustomSearchProps {
  searchText?: string;
  cacheSearchText?: string;
  searchDispatch?: (action: any) => void;
  setSearchInput?: (open: boolean) => void;
  onEnter?: (text: string) => void;
  isClosable?: boolean;
  isAutoFocus?: boolean;
  placeholder?: string;
}

const CustomSearch = memo(function CustomSearch({
  searchText = "",
  cacheSearchText = "",
  searchDispatch = () => {},
  setSearchInput = () => {},
  onEnter = () => {},
  isClosable = true,
  isAutoFocus = true,
  placeholder = "Search...",
}: CustomSearchProps) {
  // Handle enter key to execute search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      if (cacheSearchText !== "") {
        onEnter(searchText);
      }
    }
  };

  // Handle typing inside input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchDispatch({
      type: searchActions.SET_SEARCH_TEXT,
      payload: e.target.value,
    });
    if (e.target.value?.trim()?.length > 0) {
      searchDispatch({
        type: searchActions.SET_CACHE_TEXT,
        payload: e.target.value,
      });
    }
  };

  // Handle close icon button click
  const handleClose = () => {
    setSearchInput(false);
    searchDispatch({ type: searchActions.RESET_SEARCH });
    if (searchText?.trim()?.length === 0) return;
    onEnter("");
  };

  return (
    <div className="relative flex items-center h-9 bg-white border border-[#008761] ring-2 ring-[#008761]/15 rounded-md px-3 transition-all duration-200 w-56 sm:w-72 shadow-xs">
      {/* Search Icon */}
      <MdSearch className="text-[#565F70] text-lg mr-2 shrink-0" />

      {/* Input */}
      <input
        autoFocus={isAutoFocus}
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="w-full bg-transparent text-xs sm:text-sm text-[#252A34] font-normal leading-tight outline-none placeholder-[#949CAC]"
      />

      {/* Helper pill indicating Enter to search */}
      {searchText?.trim().length > 0 && (
        <span className="hidden sm:inline-flex items-center text-[10px] font-medium text-[#008761] bg-[#DAF5ED] px-1.5 py-0.5 rounded mr-1.5 shrink-0 select-none">
          ↵ Enter
        </span>
      )}

      {/* Circular Rounded Close Button */}
      {isClosable && (
        <button
          type="button"
          onClick={handleClose}
          title="Clear search"
          className="w-6 h-6 rounded-full flex items-center justify-center text-[#555E6F] hover:text-[#252A34] bg-[#F3F5F8] hover:bg-[#E5E9F0] transition-colors cursor-pointer shrink-0 ml-0.5"
        >
          <MdClose className="text-xs" />
        </button>
      )}
    </div>
  );
});

export default CustomSearch;
