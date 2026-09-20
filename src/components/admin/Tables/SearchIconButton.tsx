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
      className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#222222] text-[#a3a3a3] hover:text-white transition-colors cursor-pointer"
    >
      <MdSearch className="text-xl" />
    </button>
  );
}
