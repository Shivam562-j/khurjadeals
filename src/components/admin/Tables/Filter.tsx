"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

export interface FilterFormData {
  [key: string]: string[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  gridCols?: number;
}

export interface FilterProps {
  handleCloseFilter?: () => void;
  filterFormData: FilterFormData;
  handleFilterFormDataChange?: (key: string, value: string[]) => void;
  setFilterFormData: React.Dispatch<React.SetStateAction<FilterFormData>>;
  filterCount?: number;
  sections?: FilterSection[];
  refetch?: () => void;
  anchorEl?: HTMLElement | null;
}

interface CustomCheckBoxProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

export function CustomCheckBox({
  label,
  isChecked,
  onChange,
}: CustomCheckBoxProps) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer text-left select-none py-1.5 w-full">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[#333333] text-[#e8590c] focus:ring-[#e8590c] cursor-pointer accent-[#e8590c] shrink-0 bg-[#0d0d0d]"
      />
      <span className="text-[#d4d4d4] text-xs font-medium leading-tight select-none">
        {label}
      </span>
    </label>
  );
}

const defaultSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Sold", value: "sold" },
      { label: "Rented", value: "rented" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    id: "type",
    title: "Property Type",
    options: [
      { label: "Residential", value: "residential" },
      { label: "Commercial", value: "commercial" },
      { label: "Plot", value: "plot" },
      { label: "Agricultural", value: "agricultural" },
    ],
  },
  {
    id: "listingType",
    title: "Purpose",
    options: [
      { label: "For Sell", value: "sell" },
      { label: "For Rent", value: "rent" },
      { label: "For Lease", value: "lease" },
    ],
  },
];

export function FilterTabContentHeader({
  selected = 0,
  total = 0,
  handleClearFilter = () => {},
}: {
  selected?: number;
  total?: number;
  handleClearFilter?: () => void;
}) {
  return (
    <div className="w-full h-9 px-3.5 sm:px-4 inline-flex justify-between items-center border-b border-[#262626] bg-[#141414] shrink-0">
      <div className="text-[#a3a3a3] text-[11px] sm:text-xs font-semibold leading-4 select-none">
        {`${selected}/${total}`} item selected
      </div>

      {Boolean(selected) && (
        <span
          className="cursor-pointer text-[11px] sm:text-xs font-medium text-[#f59e0b] hover:text-[#e8590c] hover:underline transition-all select-none"
          onClick={handleClearFilter}
        >
          Clear
        </span>
      )}
    </div>
  );
}

export default function FilterUi({
  handleCloseFilter = () => {},
  filterFormData = {},
  setFilterFormData,
  sections = defaultSections,
  refetch = () => {},
  anchorEl,
}: FilterProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position coordinates for desktop anchored popover
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 550,
  });

  // Local draft filter state for pending changes
  const [localFormData, setLocalFormData] = useState<FilterFormData>(() => {
    return JSON.parse(JSON.stringify(filterFormData));
  });

  const [appliedFilter, setAppliedFilter] = useState<FilterFormData>(() => {
    return JSON.parse(JSON.stringify(filterFormData));
  });

  // Client-side mount & screen size check
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Synchronize draft state when parent filterFormData updates externally
  useEffect(() => {
    setLocalFormData(JSON.parse(JSON.stringify(filterFormData)));
    setAppliedFilter(JSON.parse(JSON.stringify(filterFormData)));
  }, [filterFormData]);

  // Compute smart desktop positioning that NEVER cuts off on left/right/bottom
  useEffect(() => {
    if (isMobile || !anchorEl) return;

    const updatePosition = () => {
      if (!anchorEl) return;
      const rect = anchorEl.getBoundingClientRect();
      const popoverWidth = Math.min(550, window.innerWidth - 32);
      const popoverHeight = 450;

      // Detect card boundaries to avoid overflow
      const cardEl = anchorEl.closest(".rounded-lg, [class*='bg-[#fcfcfc]']");
      const cardRect = cardEl?.getBoundingClientRect();

      const minLeft = cardRect ? Math.max(16, cardRect.left + 8) : 16;
      const maxRight = cardRect
        ? Math.min(window.innerWidth - 16, cardRect.right - 8)
        : window.innerWidth - 16;

      // Start by attempting to align right edge of popover with right edge of button
      let left = rect.right - popoverWidth;

      // If it extends past the left boundary (like in the user's issue), clamp to minLeft
      if (left < minLeft) {
        // Try aligning with button's left edge
        left = Math.max(minLeft, rect.left);
      }

      // If it now extends past the right boundary, clamp to maxRight
      if (left + popoverWidth > maxRight) {
        left = maxRight - popoverWidth;
      }

      // Final safeguard for smaller desktop/tablet screens
      if (left < minLeft) {
        left = minLeft;
      }

      // Vertical position calculation
      let top = rect.bottom + 8;
      // If it overflows viewport bottom, check if space above is available
      if (top + popoverHeight > window.innerHeight - 16) {
        const spaceAbove = rect.top - 16;
        if (spaceAbove >= popoverHeight) {
          top = rect.top - popoverHeight - 8;
        } else {
          top = Math.max(16, window.innerHeight - popoverHeight - 16);
        }
      }

      setCoords({
        top,
        left,
        width: Math.min(popoverWidth, maxRight - minLeft > 320 ? maxRight - minLeft : popoverWidth),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorEl, isMobile]);

  // Handle escape key (optional safety, can still press Escape or click close button)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseFilter();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleCloseFilter]);

  // Tab mapping from sections
  const tabs = useMemo(() => {
    return sections.map((sec, idx) => ({
      id: idx,
      label: sec.title,
      key: sec.id,
      options: sec.options || [],
    }));
  }, [sections]);

  const currentTabObj = tabs[activeTab] || tabs[0];

  // Checkbox toggle inside local draft
  const handleFilterItemToggle = (key: string, value: string) => {
    setLocalFormData((prev) => {
      const currentList = prev[key] || [];
      const updated = currentList.includes(value)
        ? currentList.filter((v) => v !== value)
        : [...currentList, value];
      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  // Clear single tab
  const handleClearSingleTab = (key: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      [key]: [],
    }));
  };

  // Clear all filters
  const handleClearAllFilter = () => {
    const cleared: FilterFormData = {};
    sections.forEach((sec) => {
      cleared[sec.id] = [];
    });
    setLocalFormData(cleared);
  };

  // Selection count in current local draft
  const localFilterCount = useMemo(() => {
    return Object.values(localFormData).reduce(
      (acc, arr) => acc + (arr?.length || 0),
      0
    );
  }, [localFormData]);

  // Compare draft vs applied state for enabling Apply button
  const isFilterChanged = useMemo(() => {
    if (!appliedFilter) return false;
    return JSON.stringify(localFormData) !== JSON.stringify(appliedFilter);
  }, [localFormData, appliedFilter]);

  // Commit changes and close
  const handleApply = () => {
    setFilterFormData(localFormData);
    setAppliedFilter(JSON.parse(JSON.stringify(localFormData)));
    if (refetch) {
      refetch();
    }
    handleCloseFilter();
  };

  const hasTabActiveFilter = (key: string) => {
    return (localFormData[key]?.length || 0) > 0;
  };

  if (!mounted) return null;

  // Inner content of the Filter card
  const filterCardContent = (
    <div className="w-full h-full flex flex-col select-none bg-[#171717] text-[#ffffff]">
      {/* ── 1. POPUP HEADER ── */}
      <div className="border-b border-[#262626] flex gap-2 justify-between items-center w-full px-4 py-2.5 bg-[#141414] shrink-0">
        <h4 className="text-[#ffffff] text-sm font-semibold">Filter</h4>

        <div className="flex items-center gap-2">
          {localFilterCount !== 0 && (
            <span
              className="mr-1 pr-1 cursor-pointer text-xs sm:text-sm font-medium text-[#f59e0b] hover:text-[#e8590c] hover:underline transition-all select-none"
              onClick={handleClearAllFilter}
            >
              Clear All
            </span>
          )}

          <button
            type="button"
            onClick={handleCloseFilter}
            title="Close filter"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#222222] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer"
          >
            <MdClose className="text-base" />
          </button>
        </div>
      </div>

      {/* ── 2. TWO-COLUMN TABBED BODY ── */}
      <div className="w-full flex flex-row flex-1 min-h-0">
        {/* Left: Tab Navigation list */}
        <div className="w-[130px] sm:w-[160px] h-full border-r border-[#262626] bg-[#121212] overflow-y-auto shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const showDot = hasTabActiveFilter(tab.key);

            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer flex items-center py-3 pl-3 sm:pl-4 pr-2 border-b border-[#1f1f1f] transition-all duration-200 select-none ${
                  isActive
                    ? "bg-[#1c1c1c] text-[#f59e0b] font-semibold"
                    : "bg-transparent text-[#a3a3a3] hover:bg-[#181818] hover:text-white font-normal"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#e8590c] to-[#f59e0b] rounded-tr-[10px] rounded-br-[10px]" />
                )}

                <span className="text-[11px] sm:text-xs leading-4 truncate max-w-[90px] sm:max-w-[120px]">
                  {tab.label}
                </span>

                {showDot && (
                  <span className="w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full absolute top-1/2 -translate-y-1/2 right-2.5 sm:right-3.5 bg-[#e8590c] shadow-[0_0_6px_#e8590c]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Tab Content (Header + Checkbox list) */}
        <div className="flex-1 h-full flex flex-col bg-[#171717] min-w-0">
          {currentTabObj && (
            <>
              <FilterTabContentHeader
                total={currentTabObj.options.length}
                selected={localFormData[currentTabObj.key]?.length || 0}
                handleClearFilter={() =>
                  handleClearSingleTab(currentTabObj.key)
                }
              />

              <div className="flex flex-col w-full flex-1 overflow-y-auto py-1.5 px-1">
                {currentTabObj.options.map((option, index) => {
                  const isChecked = (
                    localFormData[currentTabObj.key] || []
                  ).includes(option.value);

                  return (
                    <div
                      className="px-3 sm:px-4 py-1.5 w-full hover:bg-[#1f1f1f] rounded transition-colors"
                      key={index}
                    >
                      <CustomCheckBox
                        isChecked={isChecked}
                        label={option.label}
                        onChange={() =>
                          handleFilterItemToggle(currentTabObj.key, option.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 3. POPUP FOOTER ── */}
      <div className="p-3 sm:p-3.5 px-4 border-t border-[#262626] flex gap-3 w-full justify-end items-center bg-[#141414] shrink-0">
        <button
          type="button"
          onClick={handleApply}
          disabled={!isFilterChanged}
          className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all select-none shadow-xs ${
            isFilterChanged
              ? "bg-gradient-to-r from-[#e8590c] to-[#f59e0b] hover:from-[#d04a04] hover:to-[#e08e00] text-white cursor-pointer shadow-[0_4px_12px_rgba(232,89,12,0.35)]"
              : "bg-[#262626] text-[#666666] cursor-not-allowed opacity-60"
          }`}
        >
          Apply
        </button>
      </div>
    </div>
  );

  // ── Render on Mobile as centered modal with dimmed backdrop ──
  if (isMobile) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
        <div
          ref={popoverRef}
          id="admin-filter-popover"
          className="w-full max-w-[420px] h-[460px] max-h-[85vh] rounded-xl shadow-2xl border border-[#2e2e2e] flex flex-col overflow-hidden bg-[#171717] font-sans"
        >
          {filterCardContent}
        </div>
      </div>,
      document.body
    );
  }

  // ── Render on Desktop via Portal anchored to anchorEl without clipping ──
  return createPortal(
    <div
      ref={popoverRef}
      id="admin-filter-popover"
      style={{
        position: "fixed",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: `${coords.width}px`,
        maxHeight: "460px",
        zIndex: 9999,
      }}
      className="h-[450px] rounded-xl shadow-[0px_16px_40px_0px_rgba(0,0,0,0.6)] border border-[#2e2e2e] flex flex-col overflow-hidden bg-[#171717] font-sans transition-all duration-75"
    >
      {filterCardContent}
    </div>,
    document.body
  );
}
