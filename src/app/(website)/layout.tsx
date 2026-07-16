import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/constants/metadata";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstallBanner from "@/components/common/InstallBanner";

export const metadata: Metadata = DEFAULT_METADATA;

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white selection:bg-[var(--primary)] selection:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <InstallBanner />
    </div>
  );
}
