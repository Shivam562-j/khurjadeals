"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaChartBar,
  FaSignOutAlt,
  FaGlobe,
  FaBuilding,
  FaShoppingBag,
  FaEnvelopeOpenText,
  FaUserShield,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";
import { AuthUser } from "@/types/user";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [collapsed, setCollapsed] = useState(false);

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

  const navSections = [
    {
      title: "Main Menu",
      items: [
        { label: "Website Home", href: "/", icon: <FaGlobe /> },
        { label: "Dashboard", href: "/admin/dashboard", icon: <FaChartBar /> },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Properties", href: "/admin/properties", icon: <FaBuilding /> },
        { label: "Bazaar Products", href: "/admin/products", icon: <FaShoppingBag /> },
        { label: "Customer Queries", href: "/admin/queries", icon: <FaEnvelopeOpenText /> },
      ],
    },
  ];

  if (user?.role === "admin") {
    navSections.push({
      title: "Administration",
      items: [
        { label: "Administrators", href: "/admin/users", icon: <FaUserShield /> },
      ],
    });
  }

  return (
    <aside
      className={`shrink-0 bg-[#121214] border-r border-neutral-800/80 flex flex-col min-h-screen text-neutral-400 transition-all duration-300 relative z-30 selection:bg-[#E8590C] selection:text-white ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* ── Top Header / Brand Logo & Collapse Toggle ── */}
      <div
        className={`h-20 border-b border-neutral-800/80 flex items-center px-4 justify-between relative ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-3 group min-w-0">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-xl border border-white/10 shrink-0 transition-transform group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #E8590C 0%, #f59e0b 100%)",
              boxShadow: "0 8px 20px rgba(232, 89, 12, 0.35)",
            }}
          >
            KD
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h2 className="font-black text-white text-base leading-tight tracking-tight truncate group-hover:text-[#E8590C] transition-colors">
                Khurja Deals
              </h2>
              <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#E8590C] mt-0.5">
                <FaShieldAlt className="text-[9px]" />
                <span>Admin Platform</span>
              </div>
            </div>
          )}
        </Link>

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer border border-neutral-700/50 shadow-sm"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <FaChevronRight className="text-xs" /> : <FaChevronLeft className="text-xs" />}
        </button>
      </div>

      {/* ── User Profile Badge (Shown when expanded) ── */}
      {!collapsed && user && (
        <div className="mx-4 my-4 p-3 rounded-2xl bg-[#19191d] border border-neutral-800/80 flex items-center gap-3 shadow-md">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0 border border-white/10"
            style={{ background: "linear-gradient(135deg, #E8590C 0%, #f59e0b 100%)" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden min-w-0">
            <h4 className="font-extrabold text-white truncate text-xs leading-tight">
              {user.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-extrabold text-emerald-400 capitalize">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav Links by Section ── */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        {navSections.map((section, secIdx) => (
          <div key={secIdx} className="space-y-1.5">
            {!collapsed && (
              <div className="px-3 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {section.title}
              </div>
            )}

            {section.items.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <div key={item.href} className="relative group/tooltip">
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-2xl text-xs sm:text-sm transition-all duration-200 ${
                      collapsed
                        ? "justify-center p-3"
                        : "justify-between px-3.5 py-3 border-l-4"
                    } ${
                      isActive
                        ? "bg-gradient-to-r from-[#E8590C]/20 via-[#E8590C]/10 to-transparent text-white font-black border-[#E8590C] shadow-lg shadow-[#E8590C]/10"
                        : "text-neutral-400 font-bold hover:bg-neutral-800/60 hover:text-white border-transparent hover:translate-x-0.5"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 transition-all ${
                          isActive
                            ? "bg-[#E8590C] text-white shadow-md shadow-[#E8590C]/40"
                            : "bg-neutral-800/80 text-neutral-400 group-hover/tooltip:bg-neutral-800 group-hover/tooltip:text-[#E8590C] group-hover/tooltip:scale-105"
                        }`}
                      >
                        {item.icon}
                      </div>
                      {!collapsed && <span className="truncate tracking-wide">{item.label}</span>}
                    </div>

                    {!collapsed && isActive && (
                      <FaChevronRight className="text-[10px] text-[#E8590C] shrink-0" />
                    )}
                  </Link>

                  {/* Tooltip bubble when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-neutral-900 text-white text-xs font-bold rounded-xl shadow-2xl border border-neutral-700 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}

            {secIdx < navSections.length - 1 && (
              <div className="pt-2">
                <hr className="border-t border-neutral-800/80" />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Footer Branding & Logout ── */}
      <div className="border-t border-neutral-800/80 p-3 space-y-2 bg-[#0f0f11]">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-xl text-xs font-extrabold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer ${
            collapsed ? "justify-center p-2.5" : "px-3.5 py-2.5"
          }`}
          title="Log Out"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm shrink-0 border border-rose-500/30">
            <FaSignOutAlt />
          </div>
          {!collapsed && <span>Log Out</span>}
        </button>

        {!collapsed && (
          <div className="pt-2 text-center text-[10px] text-neutral-500 font-bold border-t border-neutral-800/60">
            Powered by <strong className="text-neutral-400">Khurja Deals v2.0</strong>
          </div>
        )}
      </div>
    </aside>
  );
}

