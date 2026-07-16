import { SITE_CONFIG } from "./site";
import type { Metadata } from "next";

export const DEFAULT_METADATA: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [SITE_CONFIG.logo],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
};
