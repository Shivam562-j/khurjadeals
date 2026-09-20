"use client";

import React, { useEffect, useState, useRef, memo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdChevronRight,
  MdKeyboardArrowDown,
  MdOutlineSettings,
  MdHelpOutline,
  MdLogout,
} from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { AuthUser } from "@/types/user";
import { toast } from "react-toastify";
import Api from "@/api/endPoints";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

const Header = memo(({ onToggleMobileMenu, mobileMenuOpen }: HeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data?.session) {
          setUserName(data.session.name || "shivam");
          setUser(data.session);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setAnchorEl(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenu = () => {
    setAnchorEl((prev) => !prev);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  const handleLogout = async () => {
    try {
      await Api.logout();
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.dispatchEvent(new Event("localStorageChanged"));
      }
      handleClose();
      router.push("/admin/login");
      router.refresh();
    }
  };

  // Generate dynamic breadcrumbs (matching state: [{ title: 'Home', link: '/' }, { title: 'Master Dashboard', current: true }])
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const items = [
      { title: "Home", link: "/admin/dashboard", current: segments.length <= 1 },
    ];

    if (segments.length > 1) {
      const currentSegment = segments[1];
      let title = "Master Dashboard";

      if (currentSegment === "dashboard") title = "Master Dashboard";
      else if (currentSegment === "properties") title = "Properties";
      else if (currentSegment === "products") title = "Bazaar Products";
      else if (currentSegment === "queries") title = "Customer Queries";
      else if (currentSegment === "users") title = "Administrators";
      else if (currentSegment === "profile") title = "Settings";

      items.push({
        title,
        link: `/admin/${currentSegment}`,
        current: true,
      });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();
  const initialLetter = (user?.name || userName || "S").charAt(0).toUpperCase();
  const roleName = user?.role ? `${user.role} Admin` : "Super Admin Copy";

  return (
    <div
      className="bg-[#141414] w-full flex justify-between py-3 px-6 sticky top-0 z-[999] border-b border-[#262626]"
      style={{
        backgroundColor: "#141414",
        borderBottom: "1px solid #262626",
      }}
    >
      <div className="flex items-center content-between justify-between w-full">
        {/* ── LEFT SIDE: BREADCRUMBS & MOBILE TOGGLE ── */}
        <div style={{ display: "flex", alignItems: "center" }} className="gap-2 min-w-0">
          {/* Mobile Sidebar Hamburger Toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded bg-[#1f1f1f] text-gray-300 hover:bg-[#282828] border border-[#333333] mr-2 cursor-pointer transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
            </button>
          )}

          {/* Breadcrumb Links */}
          {breadcrumbs.map((e, i) => (
            <div key={i} className="flex items-center">
              {i !== 0 && (
                <span className="text-[#555555] mx-2 flex items-center">
                  <MdChevronRight fontSize={18} />
                </span>
              )}
              {e.current ? (
                <span
                  style={{
                    color: "#ffffff",
                    fontWeight: "600",
                    cursor: "default",
                  }}
                  className="text-sm"
                >
                  {e.title}
                </span>
              ) : (
                <Link
                  href={e.link}
                  style={{
                    color: "#a3a3a3",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  className="text-sm hover:text-[#e8590c] transition-colors"
                >
                  {e.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* ── RIGHT SIDE: USER PROFILE TRIGGER & POPUP MENU ── */}
        <div className="flex flex-row gap-4 items-center relative" ref={dropdownRef}>
          <div
            onClick={handleMenu}
            className="flex flex-row items-center justify-center gap-2 hover:bg-[#1f1f1f] px-2 py-1 transition-all ease-in rounded-lg cursor-pointer border border-transparent hover:border-[#333333]"
          >
            <div className="w-9 h-9 p-0.5 flex-shrink-0 bg-[#26170d] border border-[#e8590c]/40 rounded-full flex items-center justify-center object-cover object-center overflow-hidden shadow-xs">
              {user?.avatar || (user as any)?.imageUrl ? (
                <img
                  src={user?.avatar || (user as any)?.imageUrl}
                  alt="User-Image"
                  loading="lazy"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-[#f59e0b] text-base font-bold">
                  {(user?.name || userName || "S").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="w-5 h-5 flex items-center justify-center cursor-pointer">
              <MdKeyboardArrowDown fontSize={18} className="text-[#a3a3a3]" />
            </div>
          </div>

          {/* ── POPUP MENU (Matching login card styling, width: 250px) ── */}
          {anchorEl && (
            <div
              id="menu-appbar"
              aria-modal="true"
              className="absolute right-0 top-12 bg-[#171717] rounded-xl shadow-2xl border border-[#2e2e2e] py-2 z-[1000] animate-in fade-in duration-150"
              style={{ width: "250px", backgroundColor: "#171717", borderColor: "#2e2e2e" }}
            >
              <div className="p-4 w-full flex flex-row gap-3 items-center justify-start">
                <div className="w-12 h-12 p-0.5 flex-shrink-0 bg-[#26170d] border border-[#e8590c]/40 rounded-full flex items-center justify-center object-cover object-center overflow-hidden">
                  {user?.avatar || (user as any)?.imageUrl ? (
                    <img
                      src={user?.avatar || (user as any)?.imageUrl}
                      alt="User-Image"
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-[#f59e0b] text-xl font-bold">
                      {(user?.name || userName || "S").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[#ffffff] text-sm font-semibold leading-tight truncate">
                    {userName || user?.name || "Shivam"}
                  </div>
                  <div className="text-[#a3a3a3] text-xs font-medium leading-none mt-1.5 truncate">
                    {roleName}
                  </div>
                </div>
              </div>
              <hr className="border-[#262626] my-1" />
              <li
                onClick={() => {
                  handleClose();
                  router.push("/admin/users");
                }}
                className="text-[#d4d4d4] text-sm font-medium flex flex-row items-center justify-start px-4 py-2.5 cursor-pointer ease-in transition-colors hover:text-[#ffffff] hover:bg-[#222222] gap-2.5 list-none"
              >
                <MdOutlineSettings fontSize={18} className="text-[#a3a3a3]" />
                <p> Settings </p>
              </li>
              <li
                onClick={() => {
                  handleClose();
                  router.push("/");
                }}
                className="text-[#d4d4d4] text-sm font-medium flex flex-row items-center justify-start px-4 py-2.5 cursor-pointer ease-in transition-colors hover:text-[#ffffff] hover:bg-[#222222] gap-2.5 list-none"
              >
                <MdHelpOutline fontSize={18} className="text-[#a3a3a3]" />
                <p> Back to KhurjaDeals </p>
              </li>
              <hr className="border-[#262626] my-1" />
              <li
                onClick={handleLogout}
                className="text-[#ef4444] text-sm font-medium flex flex-row items-center justify-start px-4 py-2.5 cursor-pointer ease-in transition-colors hover:text-[#f87171] hover:bg-red-950/30 gap-2.5 list-none"
              >
                <MdLogout fontSize={18} className="text-[#ef4444]" />
                <p> Log out </p>
              </li>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Header.displayName = "Header";
export default Header;
