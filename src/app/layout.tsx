import type { Metadata } from "next";
import "./globals.css";
import InstallBanner from "@/components/common/InstallBanner";

export const metadata: Metadata = {
  title: "KhurjaDeals — Khurja's Local Marketplace",
  description:
    "Khurja ka apna local directory. Verified properties, used vehicles, EVs, mobiles, laptops & home appliances — sab ek jagah.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logos/logo.webp",
    apple: "/logos/logo.webp",
  },
  openGraph: {
    title: "KhurjaDeals — Khurja's Local Marketplace",
    description:
      "Buy, sell & rent in Khurja. Verified properties, used bikes, cars, EVs, mobiles, laptops & appliances — all in one place.",
    images: ["/logos/logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#e8590c" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('theme');
                  var theme = storedTheme || 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <InstallBanner />
      </body>
    </html>
  );
}