import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/constants/metadata";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InstallBanner from "@/components/common/InstallBanner";
import FloatingActions from "@/components/common/FloatingActions";

export const metadata: Metadata = DEFAULT_METADATA;

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <InstallBanner />
      {/* Floating scroll-to-top (left) + WhatsApp/Phone (right) */}
      <FloatingActions />
    </div>
  );
}
