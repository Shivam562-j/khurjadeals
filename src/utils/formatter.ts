/** Format a number as Indian Rupee currency */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style:    "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a price in lakh/crore shorthand */
export function formatPriceShort(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000)    return `₹${(amount / 1_00_000).toFixed(2)} L`;
  if (amount >= 1_000)       return `₹${(amount / 1_000).toFixed(1)} K`;
  return `₹${amount}`;
}

/** Format a date string to a readable format */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  }).format(new Date(date));
}

/** Truncate a string to a given length */
export function truncate(str: string, length: number = 100): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}
