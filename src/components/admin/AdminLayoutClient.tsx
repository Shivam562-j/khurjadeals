"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import AdminHeader from "@/components/admin/Header";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  hasSession: boolean;
}

export default function AdminLayoutClient({
  children,
  hasSession,
}: AdminLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Ensure PWA and Service Workers are completely deactivated in the Admin Panel
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
    }
  }, []);

  if (!hasSession) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen lg:h-screen lg:overflow-hidden w-full bg-[#f3f4f8] text-gray-900 font-sans selection:bg-[#10b981] selection:text-white"
      style={{ backgroundColor: "#f3f4f8", color: "#111827" }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* ── RIGHT CONTENT (Width: 100% - Sidebar) ── */}
      <div
        className="flex-1 w-full min-w-0 flex flex-col min-h-screen lg:h-screen lg:overflow-hidden bg-[#f3f4f8]"
        style={{ backgroundColor: "#f3f4f8" }}
      >
        {/* White Header matching reference */}
        <AdminHeader
          mobileMenuOpen={mobileOpen}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />

        {/* Content Container (Full width, zero outer scroll on desktop view) */}
        <main className="flex-1 w-full flex flex-col min-h-0 overflow-y-auto lg:overflow-hidden bg-[#f3f4f8]">
          {children}
        </main>
      </div>
    </div>
  );
}
