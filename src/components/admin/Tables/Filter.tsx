"use client";

import React from "react";
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
  handleFilterFormDataChange: (key: string, value: string[]) => void;
  setFilterFormData: React.Dispatch<React.SetStateAction<FilterFormData>>;
  filterCount: number;
  sections?: FilterSection[];
}

interface CustomCheckBoxProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

function CustomCheckBox({ label, isChecked, onChange }: CustomCheckBoxProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer text-left">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-[#009E71] focus:ring-[#009E71] cursor-pointer accent-[#009E71]"
      />
      <span className="text-[#252A34] text-xs font-medium leading-tight">
        {label}
      </span>
    </label>
  );
}

const defaultSections: FilterSection[] = [
  {
    id: "status",
    title: "Status",
    gridCols: 2,
    options: [
      { label: "Offline / Pending", value: "pending" },
      { label: "Contacted", value: "contacted" },
      { label: "Online / Resolved", value: "resolved" },
      { label: "Closed", value: "closed" },
    ],
  },
  {
    id: "type",
    title: "Inquiry / Asset Type",
    gridCols: 3,
    options: [
      { label: "Property", value: "property" },
      { label: "Product", value: "product" },
      { label: "General", value: "general" },
    ],
  },
];

export default function Filter({
  handleCloseFilter = () => {},
  filterFormData = {},
  handleFilterFormDataChange = () => {},
  setFilterFormData,
  filterCount = 0,
  sections = defaultSections,
}: FilterProps) {
  // Clear all filters
  const handleClearAllFilter = () => {
    sections.forEach((sec) => {
      handleFilterFormDataChange(sec.id, []);
    });
    setFilterFormData({});
  };

  const toggleOption = (sectionId: string, val: string) => {
    const current = filterFormData?.[sectionId] || [];
    const updated = current.includes(val)
      ? current.filter((item) => item !== val)
      : [...current, val];
    handleFilterFormDataChange(sectionId, updated);
  };

  return (
    <div className="flex flex-col w-[360px] sm:w-[420px] bg-[#FCFCFC] rounded-lg shadow-[0px_4px_32px_0px_rgba(14,17,24,0.12)] border border-[#E5E9F0] overflow-hidden font-sans">
      {/* ── FILTER HEADER ── */}
      <div className="border-b border-[#E5E9F0] flex justify-between items-center w-full px-6 py-4 bg-[#FCFCFC]">
        <h4 className="text-[#252A34] text-sm font-semibold">Filter</h4>
        <div className="flex items-center gap-2">
          {filterCount !== 0 && (
            <span
              className="mr-1 pr-2 cursor-pointer text-xs font-semibold border-r border-[#E5E9F0] text-[#006C4D] hover:underline transition-all"
              onClick={handleClearAllFilter}
            >
              Clear All
            </span>
          )}
          <button
            type="button"
            onClick={handleCloseFilter}
            title="Close filter"
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#E5E9F0] text-[#555E6F] transition-colors cursor-pointer"
          >
            <MdClose className="text-base" />
          </button>
        </div>
      </div>

      {/* ── FILTER BODY ── */}
      <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
        {sections.map((section, idx) => {
          const selectedVals = filterFormData?.[section.id] || [];
          const gridColsClass =
            section.gridCols === 3
              ? "grid-cols-3"
              : section.gridCols === 1
              ? "grid-cols-1"
              : "grid-cols-2";

          return (
            <React.Fragment key={section.id}>
              {idx > 0 && (
                <div className="w-full border-t border-[#E5E9F0]"></div>
              )}

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center gap-1">
                  <p className="text-[#252A34] text-xs font-semibold uppercase tracking-wider">
                    {section.title}
                  </p>
                  {selectedVals.length > 0 && (
                    <span
                      className="cursor-pointer text-[#006C4D] text-xs font-medium hover:underline transition-all"
                      onClick={() =>
                        handleFilterFormDataChange(section.id, [])
                      }
                    >
                      Clear
                    </span>
                  )}
                </div>

                <div className={`grid ${gridColsClass} gap-3 pt-1`}>
                  {section.options.map((opt) => (
                    <CustomCheckBox
                      key={opt.value}
                      label={opt.label}
                      isChecked={selectedVals.includes(opt.value)}
                      onChange={() => toggleOption(section.id, opt.value)}
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
