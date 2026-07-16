"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser } from "@/types/user";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Fetch logged in admin user
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session) {
          setUser(data.session);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch {}
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Properties", href: "/admin/properties", icon: "🏠" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Queries", href: "/admin/queries", icon: "✉️" },
  ];

  // Only admin role can see Users manager
  if (user?.role === "admin") {
    navItems.push({ label: "Administrators", href: "/admin/users", icon: "👥" });
  }

  return (
    <aside className="w-64 shrink-0 border-r border-neutral-900 bg-neutral-950 flex flex-col min-h-screen text-neutral-450">
      {/* Header / Brand */}
      <div className="h-20 border-b border-neutral-900 flex items-center px-6 gap-3">
        <div className="w-8 h-8 rounded bg-[var(--primary)] flex items-center justify-center font-bold text-white text-base shadow">
          KD
        </div>
        <div>
          <h2 className="font-bold text-white leading-none text-sm">
            Khurja Deals
          </h2>
          <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Profile summary */}
      {user && (
        <div className="px-6 py-5 border-b border-neutral-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-850 flex items-center justify-center font-bold text-white select-none border border-neutral-800">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-semibold text-white truncate text-sm">
              {user.name}
            </h4>
            <span className="text-xs text-[var(--primary)] font-medium capitalize">
              {user.role}
            </span>
          </div>
        </div>
      )}

      {/* Nav Link List */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-900/40 hover:text-white"
              }`}
            >
              <span className="text-base select-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-neutral-900">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-950/20 transition-all cursor-pointer"
        >
          <span className="text-base select-none">🚪</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
