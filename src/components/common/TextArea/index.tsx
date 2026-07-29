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
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] pl-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full bg-white border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-4 py-3 outline-none transition-all duration-200 placeholder-neutral-400 focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] resize-y ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
