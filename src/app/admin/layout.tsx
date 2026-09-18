import React from "react";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0a0a0c] text-white selection:bg-[#E8590C] selection:text-white">
      {session && <Sidebar />}
      <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">{children}</main>
    </div>
  );
}

