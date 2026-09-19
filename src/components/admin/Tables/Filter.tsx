"use client";

import React from "react";
import { MdClose, MdCheck } from "react-icons/md";

export interface FilterFormData {
  status: string[];
  type: string[];
  [key: string]: any;
}

export interface FilterProps {
  handleCloseFilter?: () => void;
  filterFormData: FilterFormData;
  handleFilterFormDataChange: (key: string, value: string[]) => void;
  setFilterFormData: React.Dispatch<React.SetStateAction<FilterFormData>>;
  filterCount: number;
}

interface CustomCheckBoxProps {
  label: string;
  isChecked: boolean;
  onChange: () => void;
}

function CustomCheckBox({ label, isChecked, onChange }: CustomCheckBoxProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="inline-flex items-center gap-2 cursor-pointer select-none group text-left"
    >
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
          isChecked
            ? "bg-[#008761] border-[#008761] text-white"
            : "bg-white border-[#D8DDE7] group-hover:border-[#008761]"
        }`}
      >
        {isChecked && <MdCheck className="text-xs stroke-[1.5]" />}
      </div>
      <span className="text-[#252A34] text-xs font-medium leading-tight">
        {label}
      </span>
    </button>
  );
}

export default function Filter({
  handleCloseFilter = () => {},
  filterFormData = { status: [], type: [] },
  handleFilterFormDataChange = () => {},
  setFilterFormData,
  filterCount = 0,
}: FilterProps) {
  // Clear all filters
  const handleClearAllFilter = () => {
    handleFilterFormDataChange("status", []);
    handleFilterFormDataChange("type", []);
    setFilterFormData({
      status: [],
      type: [],
    });
  };

  const toggleStatus = (val: string) => {
    const current = filterFormData?.status || [];
    const updated = current.includes(val)
      ? current.filter((item) => item !== val)
      : [...current, val];
    handleFilterFormDataChange("status", updated);
  };

  const toggleType = (val: string) => {
    const current = filterFormData?.type || [];
    const updated = current.includes(val)
      ? current.filter((item) => item !== val)
      : [...current, val];
    handleFilterFormDataChange("type", updated);
  };

  return (
    <div className="flex flex-col w-[360px] sm:w-[420px] bg-[#FCFCFC] rounded-lg shadow-[0px_4px_32px_0px_rgba(14,17,24,0.12)] border border-[#E5E9F0] overflow-hidden select-none font-sans">
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
        {/* 1. STATUS SECTION */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center gap-1">
            <p className="text-[#252A34] text-xs font-semibold uppercase tracking-wider">
              Status
            </p>
            {(filterFormData?.status || []).length > 0 && (
              <span
                className="cursor-pointer text-[#006C4D] text-xs font-medium hover:underline transition-all"
                onClick={() => handleFilterFormDataChange("status", [])}
              >
                Clear
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <CustomCheckBox
              label="Offline / Pending"
              isChecked={(filterFormData?.status || []).includes("pending")}
              onChange={() => toggleStatus("pending")}
            />
            <CustomCheckBox
              label="Contacted"
              isChecked={(filterFormData?.status || []).includes("contacted")}
              onChange={() => toggleStatus("contacted")}
            />
            <CustomCheckBox
              label="Online / Resolved"
              isChecked={(filterFormData?.status || []).includes("resolved")}
              onChange={() => toggleStatus("resolved")}
            />
            <CustomCheckBox
              label="Closed"
              isChecked={(filterFormData?.status || []).includes("closed")}
              onChange={() => toggleStatus("closed")}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#E5E9F0]"></div>

        {/* 2. INQUIRY / ASSET TYPE SECTION */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center gap-1">
            <p className="text-[#252A34] text-xs font-semibold uppercase tracking-wider">
              Inquiry / Asset Type
            </p>
            {(filterFormData?.type || []).length > 0 && (
              <span
                className="cursor-pointer text-[#006C4D] text-xs font-medium hover:underline transition-all"
                onClick={() => handleFilterFormDataChange("type", [])}
              >
                Clear
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            <CustomCheckBox
              label="Property"
              isChecked={(filterFormData?.type || []).includes("property")}
              onChange={() => toggleType("property")}
            />
            <CustomCheckBox
              label="Product"
              isChecked={(filterFormData?.type || []).includes("product")}
              onChange={() => toggleType("product")}
            />
            <CustomCheckBox
              label="General"
              isChecked={(filterFormData?.type || []).includes("general")}
              onChange={() => toggleType("general")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
