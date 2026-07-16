export const SITE_CONFIG = {
  name: "Khurja Deals",
  tagline: "Khurja's Own Marketplace",
  description:
    "Buy, sell, and rent properties and products in Khurja. Your trusted local marketplace.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://khurjadeals.com",
  phone: "+91 7906896546",
  whatsapp: "917906896546",
  email: "info@khurjadeals.com",
  address: "Khurja, Bulandshahr, Uttar Pradesh, India",
  logo: "/logos/logo.png",
  whiteLogo: "/logos/white-logo.png",
  favicon: "/favicon.ico",
  social: {
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: "",
  },
} as const;
