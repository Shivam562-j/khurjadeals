import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KhurjaDeals - Real Estate & Local Marketplace",
    short_name: "KhurjaDeals",
    description: "Buy, sell, and rent properties, vehicles, electronics, and local products in Khurja.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1117",
    theme_color: "#e8590c",
    orientation: "portrait",
    icons: [
      {
        src: "/logos/logo.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "any",
      },
      {
        src: "/logos/logo.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
