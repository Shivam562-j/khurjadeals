import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khurja Deals — Coming Soon",
  description:
    "We are currently building our platform. For inquiries, contact us at +91 7906896546.",
  icons: {
    icon: "/logos/logo.png",
    apple: "/logos/logo.png",
  },
  openGraph: {
    title: "Khurja Deals — Coming Soon",
    description:
      "We are currently building our platform. Stay tuned for great deals!",
    images: ["/logos/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
