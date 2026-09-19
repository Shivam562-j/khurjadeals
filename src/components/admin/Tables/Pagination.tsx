"use client";

import React, { useState, useEffect, memo } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
} from "react-icons/md";

interface PaginationProps {
  dataLength: number;
  rowsPerPage: number;
  page: number; // 0-indexed or 1-indexed (we handle 0-indexed like MUI)
  handleChangePage: (newPage: number) => void;
  handleChangeRowsPerPage: (newRowsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export const TablePaginationActions = memo(
  ({
    count,
    page,
    rowsPerPage,
    onPageChange,
  }: {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
  }) => {
    const totalPages = Math.ceil(count / rowsPerPage) || 1;
    const [inputValue, setInputValue] = useState<string | number>(page + 1);

    useEffect(() => {
      setInputValue(page + 1);
    }, [page]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
        onPageChange(parsed - 1);
      }
    };

    if (count === 0) return null;

    return (
      <div className="flex items-center justify-center gap-1.5 shrink-0 select-none">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={page === 0}
          title="First page"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#555e6f] hover:bg-[#E5E9F0] active:text-[#008761] disabled:text-[#949CAC] disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <MdFirstPage className="text-xl" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          title="Previous page"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#555e6f] hover:bg-[#E5E9F0] active:text-[#008761] disabled:text-[#949CAC] disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <MdKeyboardArrowLeft className="text-xl" />
        </button>

        {/* Input [ 1 ] of N pages */}
        <div className="flex items-center gap-2 text-[#252A34] text-sm font-medium px-2">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={handleInputChange}
            className="w-14 h-9 text-center bg-white border border-[#D8DDE7] rounded text-sm font-normal text-[#252A34] outline-none focus:border-[#009E71] transition-colors"
          />
          <span className="whitespace-nowrap text-[#555e6f]">
            of {totalPages} pages
          </span>
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          title="Next page"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#555e6f] hover:bg-[#E5E9F0] active:text-[#008761] disabled:text-[#949CAC] disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <MdKeyboardArrowRight className="text-xl" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={page >= totalPages - 1}
          title="Last page"
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#555e6f] hover:bg-[#E5E9F0] active:text-[#008761] disabled:text-[#949CAC] disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <MdLastPage className="text-xl" />
        </button>
      </div>
    );
  }
);

TablePaginationActions.displayName = "TablePaginationActions";

const Pagination = memo(
  ({
    dataLength = 0,
    rowsPerPage = 10,
    page = 0,
    handleChangePage,
    handleChangeRowsPerPage,
    itemsPerPageOptions = [10, 25, 50, 100],
  }: PaginationProps) => {
    const from = dataLength === 0 ? 0 : page * rowsPerPage + 1;
    const to = Math.min((page + 1) * rowsPerPage, dataLength);

    return (
      <div className="w-full overflow-x-auto bg-[#FCFCFC] border-t border-[#E5E9F0] shrink-0 select-none">
        <div className="min-w-[640px] flex flex-row justify-between items-center px-6 py-3 text-nowrap gap-4">
          {/* Left: Showing X - Y out of Z */}
          <h4 className="text-[#252A34] text-sm font-medium">
            Showing {from} - {to} out of {dataLength}
          </h4>

          {/* Center: Pagination Actions */}
          <TablePaginationActions
            count={dataLength}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />

          {/* Right: Items per page */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[#252A34] text-sm font-medium">
              Items per page:
            </span>
            <div className="relative inline-block">
              <select
                value={rowsPerPage}
                onChange={(e) =>
                  handleChangeRowsPerPage(Number(e.target.value))
                }
                className="appearance-none bg-white border border-[#D8DDE7] text-[#252A34] text-sm font-medium rounded px-3 py-1.5 pr-8 outline-none hover:bg-[#F3F5F8] focus:border-[#009E71] cursor-pointer transition-colors"
              >
                {itemsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <MdKeyboardArrowDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-lg pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";
export default Pagination;
