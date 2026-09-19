"use client";

import React from "react";
import { MdSearch } from "react-icons/md";

export interface SearchIconButtonProps {
  onClick?: () => void;
  title?: string;
}

export default function SearchIconButton({
  onClick,
  title = "Search",
}: SearchIconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#E5E9F0] text-[#555E6F] transition-colors cursor-pointer"
    >
      <MdSearch className="text-xl" />
    </button>
  );
}
