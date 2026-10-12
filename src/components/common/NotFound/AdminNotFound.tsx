"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaBuilding,
  FaBox,
  FaQuestionCircle,
  FaUsers,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaShieldAlt,
} from "react-icons/fa";

export default function AdminNotFound() {
  const router = useRouter();

  const adminNav = [
    {
      icon: <FaTachometerAlt className="text-lg text-[#e8590c]" />,
      title: "Dashboard Overview",
      desc: "View platform statistics, deal counts, and metrics.",
      href: "/admin/dashboard",
    },
    {
      icon: <FaBuilding className="text-lg text-[#e8590c]" />,
      title: "Properties Manager",
      desc: "Manage and approve real estate listings.",
      href: "/admin/properties",
    },
    {
      icon: <FaBox className="text-lg text-[#e8590c]" />,
      title: "Products & Vehicles",
      desc: "Manage verified vehicles, bikes, and products.",
      href: "/admin/products",
    },
    {
      icon: <FaQuestionCircle className="text-lg text-[#e8590c]" />,
      title: "Customer Queries",
      desc: "Review buyer inquiries and call requests.",
      href: "/admin/queries",
    },
    {
      icon: <FaUsers className="text-lg text-[#e8590c]" />,
      title: "Users Management",
      desc: "Manage registered accounts and roles.",
      href: "/admin/users",
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-6 md:p-12 text-white bg-[#0d0d0d]">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#e8590c]/40 text-[#f97316] px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg">
          <FaShieldAlt className="text-xs text-[#e8590c]" />
          <span>Admin Portal &bull; 404 Route</span>
        </div>

        {/* 404 Visual Number */}
        <div>
          <div className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#e8590c] via-[#f97316] to-[#fb923c] leading-none mb-4 select-none">
            404
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Admin Resource Not Found
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
            The admin route or management page you are trying to access does not exist,
            has been relocated, or is restricted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700 bg-[#161616] hover:bg-[#222222] text-sm font-semibold transition-all cursor-pointer text-white shadow-sm"
          >
            <FaArrowLeft className="text-xs text-[#e8590c]" />
            Go Back
          </button>

          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#e8590c] to-[#f97316] hover:brightness-110 text-white text-sm font-bold shadow-lg shadow-[#e8590c]/25 transition-all cursor-pointer"
          >
            <FaTachometerAlt className="text-xs" />
            Go to Admin Dashboard
          </Link>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-700 bg-transparent hover:bg-neutral-800 text-sm font-medium transition-all text-neutral-300 hover:text-white"
          >
            <span>View Public Website</span>
            <FaExternalLinkAlt className="text-[10px]" />
          </Link>
        </div>

        {/* Quick Admin Nav Shortcuts */}
        <div className="pt-8 border-t border-neutral-800/80 text-left">
          <h2 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-4 text-center">
            Quick Navigation Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {adminNav.map((nav) => (
              <Link
                key={nav.title}
                href={nav.href}
                className="group p-3.5 rounded-xl bg-[#141414] hover:bg-[#1c1c1c] border border-neutral-800/80 hover:border-[#e8590c]/50 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-neutral-900 group-hover:bg-[#e8590c]/15 transition-colors shrink-0">
                  {nav.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-[#e8590c] transition-colors">
                    {nav.title}
                  </div>
                  <div className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                    {nav.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
