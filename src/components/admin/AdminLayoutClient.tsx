"use client";

import React, { useState } from "react";
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

  if (!hasSession) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen w-full bg-[#f3f4f8] text-gray-900 font-sans selection:bg-[#10b981] selection:text-white"
      style={{ backgroundColor: "#f3f4f8", color: "#111827" }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* ── RIGHT CONTENT (Width: 100% - Sidebar) ── */}
      <div
        className="flex-1 w-full min-w-0 flex flex-col min-h-screen bg-[#f3f4f8]"
        style={{ backgroundColor: "#f3f4f8" }}
      >
        {/* White Header matching reference */}
        <AdminHeader
          mobileMenuOpen={mobileOpen}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />

        {/* Content Container (100vh - header with full width and generous padding) */}
        <main className="flex-1 w-full overflow-y-auto p-6 lg:p-8 space-y-6 min-h-[calc(100vh-74px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
