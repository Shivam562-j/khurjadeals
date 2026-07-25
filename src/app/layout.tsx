import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhurjaDeals — Khurja's Local Marketplace",
  description:
    "Khurja ka apna local directory. Verified properties, used vehicles, EVs, mobiles, laptops & home appliances — sab ek jagah.",
  icons: {
    icon: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
  openGraph: {
    title: "KhurjaDeals — Khurja's Local Marketplace",
    description:
      "Buy, sell & rent in Khurja. Verified properties, used bikes, cars, EVs, mobiles, laptops & appliances — all in one place.",
    images: ["/logos/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}