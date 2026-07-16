export const BRAND_COLORS = {
  primary:      "#E8590C",
  primaryDark:  "#C2410C",
  primaryLight: "#FFF4E6",
  dark:         "#1B1B1B",
  surface:      "#F5F5F0",
  white:        "#FFFFFF",
  border:       "#E5E7EB",
  muted:        "#6B7280",
  success:      "#059669",
  warning:      "#D97706",
  error:        "#DC2626",
  info:         "#2563EB",
  whatsapp:     "#25D366",
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;
