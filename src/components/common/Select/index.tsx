import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export default function Select({
  label,
  options,
  error,
  id,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-350">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-4 py-2.5 outline-none transition-colors duration-250 appearance-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-neutral-950">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}
