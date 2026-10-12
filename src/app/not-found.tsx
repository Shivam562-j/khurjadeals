"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WebsiteNotFound from "@/components/common/NotFound/WebsiteNotFound";
import AdminNotFound from "@/components/common/NotFound/AdminNotFound";

export default function GlobalNotFound() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname || pathname || "";
      if (currentPath.startsWith("/admin")) {
        setIsAdmin(true);
      }
    }
  }, [pathname]);

  if (isAdmin) {
    return <AdminNotFound />;
  }

  return <WebsiteNotFound />;
}
