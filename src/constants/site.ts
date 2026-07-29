export const SITE_CONFIG = {
  name: "Khurja Deals",
  tagline: "Khurja's Own Marketplace",
  description:
    "Buy, sell, and rent properties and products in Khurja. Your trusted local marketplace.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://khurjadeals.com",
  phone: "+91 9258550570",
  whatsapp: "917906896546",
  email: "info@khurjadeals.com",
  address: "Khurja, Bulandshahr, Uttar Pradesh, India",
  logo: "/logos/logo.webp",
  whiteLogo: "/logos/white-logo.webp",
  favicon: "/favicon.ico",
  social: {
    instagram: "https://www.instagram.com/khurjadeals_",
    facebook: "https://www.facebook.com/share/1EkNBfPMHr/",
    twitter: "",
    youtube: "https://www.youtube.com/@khurjadeal",
  },
} as const;
