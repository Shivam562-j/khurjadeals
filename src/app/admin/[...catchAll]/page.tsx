import React from "react";
import type { Metadata } from "next";
import AdminNotFound from "@/components/common/NotFound/AdminNotFound";

export const metadata: Metadata = {
  title: "Admin 404 — Page Not Found",
};

export default function AdminCatchAllPage() {
  return <AdminNotFound />;
}
