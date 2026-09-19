import React from "react";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel — KhurjaDeals",
  manifest: null,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <AdminLayoutClient hasSession={!!session}>
      {children}
    </AdminLayoutClient>
  );
}
