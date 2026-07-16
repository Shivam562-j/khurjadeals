"use client";
import React, { useState } from "react";

interface SearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function Search({
  placeholder = "Search...",
  onSearch,
  initialValue = "",
}: SearchProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-3 bg-neutral-900 border border-neutral-800 text-white rounded-xl placeholder-neutral-500 outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-colors text-sm"
      />

      <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1.5">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-450 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        <button
          type="submit"
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
}
