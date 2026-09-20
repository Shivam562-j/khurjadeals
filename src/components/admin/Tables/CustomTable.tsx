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
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2d1212] text-[#f87171] border border-[#7f1d1d]/60">
          Offline
        </span>
      );
    case "contacted":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#2e1d09] text-[#fbbf24] border border-[#78350f]/60">
          Contacted
        </span>
      );
    case "resolved":
    case "online":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0a2e1d] text-[#34d399] border border-[#065f46]/60">
          Online
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#222222] text-[#a3a3a3] border border-[#333333]">
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
    <div className="h-full w-full flex flex-col min-h-0 bg-[#171717]">
      {/* Scrollable Container with sticky header & custom dark scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto w-full custom-dark-scrollbar">
        <table className="w-full text-left border-collapse">
          {/* ── STICKY TABLE HEADER ── */}
          <thead className="sticky top-0 z-20 bg-[#121212]">
            <tr className="border-b border-[#262626]">
              {/* Checkbox Column */}
              {isCheckBox && (
                <th className="w-12 px-4 py-3.5 bg-[#121212] text-center">
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
                    className="w-4 h-4 rounded border-[#333333] text-[#e8590c] focus:ring-[#e8590c] cursor-pointer accent-[#e8590c] bg-[#0d0d0d]"
                  />
                </th>
              )}

              {/* S.No Column */}
              {isSno && (
                <th className="w-16 px-4 py-3.5 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider bg-[#121212]">
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
                    className={`px-4 py-3.5 text-xs font-semibold text-[#a3a3a3] uppercase tracking-wider bg-[#121212] ${
                      column.isSortable
                        ? "cursor-pointer hover:bg-[#1a1a1a] hover:text-white transition-colors"
                        : "cursor-default"
                    } ${
                      isAction
                        ? "sticky right-0 z-20 shadow-[-4px_0px_16px_rgba(0,0,0,0.4)] text-right"
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
                          className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#e8590c]/20 text-[#f59e0b] transition-transform duration-200 ${
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
          <tbody className="divide-y divide-[#222222] bg-[#171717] text-xs text-[#e5e5e5]">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (isCheckBox ? 1 : 0) + (isSno ? 1 : 0)
                  }
                  className="py-24 text-center text-sm font-medium text-[#737373]"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-[#e8590c] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#a3a3a3]">Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length + (isCheckBox ? 1 : 0) + (isSno ? 1 : 0)
                  }
                  className="py-24 text-center text-sm font-medium text-[#737373]"
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
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? "bg-[#26170d] hover:bg-[#2e1c10]"
                        : "hover:bg-[#1f1f1f] bg-[#171717]"
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
                          className="w-4 h-4 rounded border-[#333333] text-[#e8590c] focus:ring-[#e8590c] cursor-pointer accent-[#e8590c] bg-[#0d0d0d]"
                        />
                      </td>
                    )}

                    {/* S.No Cell */}
                    {isSno && (
                      <td className="w-16 px-4 py-3.5 font-medium text-[#737373] whitespace-nowrap">
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
                                ? "sticky right-0 z-10 bg-[#171717] group-hover:bg-[#1f1f1f] shadow-[-4px_0px_16px_rgba(0,0,0,0.4)] text-right"
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
                              ? "sticky right-0 z-10 bg-[#171717] group-hover:bg-[#1f1f1f] shadow-[-4px_0px_16px_rgba(0,0,0,0.4)] text-right"
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
