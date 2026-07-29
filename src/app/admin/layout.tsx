import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If no session exists, we don't block layout render for login route itself
  // Note: we let login bypass the sidebar check by checking route inside page or redirecting here.
  // Actually, we can just redirect if not on /admin/login
  return (
    <div className="flex min-h-screen bg-neutral-950 text-white selection:bg-[var(--primary)] selection:text-white">
      {session && <Sidebar />}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
