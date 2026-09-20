"use client";

import React from "react";
import CustomTable, { TableColumn } from "./CustomTable";
import Pagination from "./Pagination";

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  tableData: T[];
  page: number; // 0-indexed
  rowsPerPage: number;
  totalCount: number;
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (newRowsPerPage: number) => void;
  sortBy?: string;
  sortOrder?: boolean | "asc" | "desc";
  setSortBy?: (key: string) => void;
  setSortOrder?: (order: any) => void;
  isCheckBox?: boolean;
  isSno?: boolean;
  selectedRows?: string[];
  handleRowSelect?: (id: string) => void;
  handleSelectAllClick?: () => void;
  handleItemClick?: (item: T) => void;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export default function Table<T extends { id?: string; _id?: string }>({
  columns = [],
  tableData = [],
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  sortBy,
  sortOrder = true,
  setSortBy,
  setSortOrder,
  isCheckBox = false,
  isSno = false,
  selectedRows = [],
  handleRowSelect,
  handleSelectAllClick,
  handleItemClick,
  loading = false,
  emptyText = "No result found!",
  className = "",
}: TableProps<T>) {
  return (
    <div
      className={`flex-1 min-h-0 w-full flex flex-col bg-[#171717] overflow-hidden ${className}`}
    >
      {/* ── TABLE CONTAINER (Takes full flex height) ── */}
      <div className="flex-1 min-h-0 w-full overflow-hidden">
        <CustomTable
          columns={columns}
          tableData={tableData}
          isCheckBox={isCheckBox}
          isSno={isSno}
          selectedRows={selectedRows}
          handleRowSelect={handleRowSelect}
          handleSelectAllClick={handleSelectAllClick}
          handleItemClick={handleItemClick}
          sortBy={sortBy}
          sortOrder={sortOrder}
          setSortBy={setSortBy}
          setSortOrder={setSortOrder}
          loading={loading}
          emptyText={emptyText}
        />
      </div>

      {/* ── BOTTOM PAGINATION BAR ── */}
      {totalCount > 0 && (
        <Pagination
          dataLength={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}
