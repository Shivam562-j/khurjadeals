"use client";

import React from "react";
import {
  FaArrowDown,
  FaPhoneAlt,
  FaWhatsapp,
  FaEye,
  FaCheck,
} from "react-icons/fa";

export interface TableColumn<T = any> {
  id: string;
  label: string;
  key1: string;
  key2?: string;
  isSortable?: boolean;
  minWidth?: string | number;
  width?: string | number;
  type?:
    | "text"
    | "status"
    | "action"
    | "dateTime"
    | "badge"
    | "custom";
  render?: (item: T, index: number) => React.ReactNode;
}

interface CustomTableProps<T = any> {
  columns: TableColumn<T>[];
  tableData: T[];
  isCheckBox?: boolean;
  isSno?: boolean;
  selectedRows?: string[];
  handleRowSelect?: (id: string) => void;
  handleSelectAllClick?: () => void;
  handleItemClick?: (item: T) => void;
  sortBy?: string;
  sortOrder?: boolean | "asc" | "desc";
  setSortBy?: (key: string) => void;
  setSortOrder?: (order: any) => void;
  loading?: boolean;
  emptyText?: string;
}

export function getValue(item: any, key1: string, key2?: string) {
  if (!item) return "─";
  if (key2) {
    const val = item?.[key1]?.[key2];
    return val !== undefined && val !== null && val !== "" ? val : "─";
  }
  const val = item?.[key1];
  return val !== undefined && val !== null && val !== "" ? val : "─";
}

export function StatusBadge({ status }: { status: string }) {
  const s = String(status || "").toLowerCase();
  switch (s) {
    case "pending":
    case "offline":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FDE9E7] text-[#D51D10]">
          Offline
        </span>
      );
    case "contacted":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF0E3] text-[#80440C]">
          Contacted
        </span>
      );
    case "resolved":
    case "online":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#DAF5ED] text-[#006C4D]">
          Online
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D8DDE7] text-[#565F70]">
          {status || "Closed"}
        </span>
      );
  }
}

export default function CustomTable<T extends { id?: string; _id?: string }>({
  columns,
  tableData = [],
  isCheckBox = false,
  isSno = false,
  selectedRows = [],
  handleRowSelect,
  handleSelectAllClick,
  handleItemClick,
  sortBy,
  sortOrder = true,
  setSortBy,
  setSortOrder,
  loading = false,
  emptyText = "No result found!",
}: CustomTableProps<T>) {
  const isAllSelected =
    tableData.length > 0 && selectedRows.length === tableData.length;
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < tableData.length;

  const handleHeaderSort = (column: TableColumn<T>) => {
    if (!column.isSortable || !setSortBy) return;
    if (sortBy === column.key1) {
      if (setSortOrder) {
        setSortOrder(
          typeof sortOrder === "boolean"
            ? !sortOrder
            : sortOrder === "asc"
            ? "desc"
            : "asc"
        );
      }
    } else {
      setSortBy(column.key1);
      if (setSortOrder) {
        setSortOrder(typeof sortOrder === "boolean" ? true : "asc");
      }
    }
  };

  const isAscending =
    typeof sortOrder === "boolean" ? sortOrder : sortOrder === "asc";

  return (
    <div className="h-full w-full flex flex-col min-h-0 bg-white select-none">
      {/* Scrollable Container with sticky header */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          {/* ── STICKY TABLE HEADER (bg: #E5E9F0, text: #252A34, font-weight: 500, height: 44px) ── */}
          <thead className="sticky top-0 z-20 bg-[#E5E9F0]">
            <tr className="border-b border-[#D8DDE7]">
              {/* Checkbox Column */}
              {isCheckBox && (
                <th className="w-12 px-4 py-3 bg-[#E5E9F0] text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectAllClick && handleSelectAllClick();
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-[#009E71] focus:ring-[#009E71] cursor-pointer accent-[#009E71]"
                  />
                </th>
              )}

              {/* S.No Column */}
              {isSno && (
                <th className="w-16 px-4 py-3 text-xs font-semibold text-[#252A34] uppercase tracking-wider bg-[#E5E9F0]">
                  S. No.
                </th>
              )}

              {/* Dynamic Columns */}
              {columns.map((column) => {
                const isCurrentSort = sortBy === column.key1;
                const isAction = column.type === "action";

                return (
                  <th
                    key={column.id}
                    onClick={() => handleHeaderSort(column)}
                    style={{
                      minWidth: column.minWidth,
                      width: column.width,
                    }}
                    className={`px-4 py-3 text-xs font-semibold text-[#252A34] uppercase tracking-wider bg-[#E5E9F0] ${
                      column.isSortable
                        ? "cursor-pointer hover:bg-[#d8dde7] transition-colors"
                        : "cursor-default"
                    } ${
                      isAction
                        ? "sticky right-0 z-20 shadow-[-4px_0px_16px_rgba(0,0,0,0.06)] text-right"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        isAction ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className="whitespace-nowrap">{column.label}</span>

                      {/* Sort Indicator Arrow */}
                      {column.isSortable && isCurrentSort && (
                        <span
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#009E71]/15 text-[#009E71] transition-transform duration-200 ${
                            !isAscending ? "rotate-180" : ""
                          }`}
                        >
                          <FaArrowDown className="text-[10px]" />
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ── TABLE BODY ── */}
          <tbody className="divide-y divide-gray-100 bg-white text-xs text-[#252A34]">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (isCheckBox ? 1 : 0) + (isSno ? 1 : 0)
                  }
                  className="py-24 text-center text-sm font-medium text-[#555e6f]"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#009E71] border-t-transparent rounded-full animate-spin" />
                    <span>Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (isCheckBox ? 1 : 0) + (isSno ? 1 : 0)
                  }
                  className="py-24 text-center text-sm font-medium text-[#555e6f]"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              tableData.map((item, index) => {
                const rowId = item.id || item._id || String(index);
                const isSelected = selectedRows.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={() => handleItemClick && handleItemClick(item)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#ebfaf6]"
                        : "hover:bg-[#ebfaf6] bg-white"
                    }`}
                  >
                    {/* Checkbox Cell */}
                    {isCheckBox && (
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className="w-12 px-4 py-3.5 text-center"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleRowSelect && handleRowSelect(rowId)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-[#009E71] focus:ring-[#009E71] cursor-pointer accent-[#009E71]"
                        />
                      </td>
                    )}

                    {/* S.No Cell */}
                    {isSno && (
                      <td className="w-16 px-4 py-3.5 font-medium text-gray-500 whitespace-nowrap">
                        {index + 1}
                      </td>
                    )}

                    {/* Columns */}
                    {columns.map((column) => {
                      const isAction = column.type === "action";

                      if (column.render) {
                        return (
                          <td
                            key={column.id}
                            className={`px-4 py-3.5 whitespace-nowrap ${
                              isAction
                                ? "sticky right-0 z-10 bg-white/95 backdrop-blur-xs shadow-[-4px_0px_16px_rgba(0,0,0,0.06)] text-right"
                                : ""
                            }`}
                          >
                            {column.render(item, index)}
                          </td>
                        );
                      }

                      if (column.type === "status") {
                        const statusVal = getValue(
                          item,
                          column.key1,
                          column.key2
                        );
                        return (
                          <td
                            key={column.id}
                            className="px-4 py-3.5 whitespace-nowrap"
                          >
                            <StatusBadge status={statusVal} />
                          </td>
                        );
                      }

                      return (
                        <td
                          key={column.id}
                          className={`px-4 py-3.5 max-w-xs truncate ${
                            isAction
                              ? "sticky right-0 z-10 bg-white/95 backdrop-blur-xs shadow-[-4px_0px_16px_rgba(0,0,0,0.06)] text-right"
                              : ""
                          }`}
                        >
                          {getValue(item, column.key1, column.key2)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
