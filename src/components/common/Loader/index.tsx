import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export default function Loader({ size = "md", fullPage = false }: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size]}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center p-8">{spinner}</div>;
}
