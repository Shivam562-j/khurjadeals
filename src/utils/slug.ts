/** Convert a string to a URL-friendly slug */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generate a unique slug by appending a random suffix */
export function toUniqueSlug(str: string): string {
  const base   = toSlug(str);
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}
