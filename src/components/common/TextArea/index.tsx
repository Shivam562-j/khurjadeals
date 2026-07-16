import React from "react";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  id,
  className = "",
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-350">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-4 py-2.5 outline-none transition-colors duration-250 placeholder-neutral-550 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-y ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
