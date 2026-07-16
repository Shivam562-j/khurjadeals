import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhurjaDeals — Khurja's Local Marketplace",
  description:
    "Khurja ka apna local directory. Verified properties, second-hand vehicles, electronics & handcrafted pottery — sab ek jagah.",
  icons: {
    icon: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
  openGraph: {
    title: "KhurjaDeals — Khurja's Local Marketplace",
    description:
      "Buy, sell & rent in Khurja. Properties, vehicles, mobiles, laptops, pottery — all in one place.",
    images: ["/logos/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
