import { SITE_CONFIG } from "./site";

export const FOOTER_CONFIG = {
  tagline: "Your trusted local marketplace for properties and products in Khurja.",
  copyright: `© ${new Date().getFullYear()} ${SITE_CONFIG.name}. All rights reserved.`,
  contact: {
    phone: SITE_CONFIG.phone,
    whatsapp: SITE_CONFIG.whatsapp,
    email: SITE_CONFIG.email,
    address: SITE_CONFIG.address,
  },
} as const;
