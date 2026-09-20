"use client";

import React from "react";

export interface InfoRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

export default function InfoRow({ label, value, className = "" }: InfoRowProps) {
  return (
    <div
      className={`flex justify-between flex-row gap-4 cursor-default py-1.5 ${className}`}
    >
      <p className="text-[#a3a3a3] text-sm font-normal leading-tight w-5/12 shrink-0">
        {label}
      </p>
      <div className="text-[#ffffff] text-sm font-medium leading-tight w-7/12 break-words text-right sm:text-left">
        {value ?? "─"}
      </div>
    </div>
  );
}
