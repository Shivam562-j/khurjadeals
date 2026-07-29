"use client";
import { useState } from "react";

interface UsePaginationOptions {
  totalItems:  number;
  itemsPerPage?: number;
  initialPage?: number;
}

export function usePagination({
  totalItems,
  itemsPerPage = 12,
  initialPage  = 1,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages  = Math.ceil(totalItems / itemsPerPage);
  const offset      = (currentPage - 1) * itemsPerPage;

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage, totalPages, offset,
    goToPage, nextPage, prevPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}
