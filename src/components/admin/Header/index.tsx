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
      className="bg-[#fcfcfc] w-full flex justify-between py-3 px-6 sticky top-0 z-[999] border-b border-[#e5e9f0]"
      style={{
        backgroundColor: "#fcfcfc",
        borderBottom: "1px solid #e5e9f0",
      }}
    >
      <div className="flex items-center content-between justify-between w-full">
        {/* ── LEFT SIDE: BREADCRUMBS & MOBILE TOGGLE ── */}
        <div style={{ color: "black", display: "flex", alignItems: "center" }} className="gap-2 min-w-0">
          {/* Mobile Sidebar Hamburger Toggle */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 mr-2 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
            </button>
          )}

          {/* Breadcrumb Links matching provided code */}
          {breadcrumbs.map((e, i) => (
            <div key={i} className="flex items-center">
              {i !== 0 && (
                <span className="text-[#717B8C] mx-2 flex items-center">
                  <MdChevronRight fontSize={18} />
                </span>
              )}
              {e.current ? (
                <span
                  style={{
                    color: "#2E3542",
                    fontWeight: "500",
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
                    color: "#717B8C",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                  className="text-sm hover:underline"
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
            className="flex flex-row items-center justify-center gap-2 hover:bg-slate-200 transition-all ease-in rounded cursor-pointer"
          >
            <div className="w-10 h-10 p-1 flex-shrink-0 bg-[#fde9e7] rounded-full flex items-center justify-center object-cover object-center overflow-hidden">
              {user?.avatar || (user as any)?.imageUrl ? (
                <img
                  src={user?.avatar || (user as any)?.imageUrl}
                  alt="User-Image"
                  loading="lazy"
                />
              ) : (
                <span className="text-[#d51d10] text-xl font-semibold">
                  {(user?.name || userName || "S").charAt(0)}
                </span>
              )}
            </div>
            <div className="p-1 w-6 h-6 flex items-center justify-center cursor-pointer rounded-[100%] hover:bg-slate-200 transition-all ease-in">
              <MdKeyboardArrowDown fontSize={20} className="text-[#717B8C]" />
            </div>
          </div>

          {/* ── POPUP MENU (Matching exact Menu styling, width: 250px) ── */}
          {anchorEl && (
            <div
              id="menu-appbar"
              aria-modal="true"
              className="absolute right-0 top-12 bg-white rounded-lg shadow-2xl border border-[#e5e9f0] py-2 z-[1000] animate-in fade-in duration-150"
              style={{ width: "250px" }}
            >
              <div className="p-4 w-full flex flex-row gap-4 items-center justify-start">
                <div className="w-14 h-14 p-1 flex-shrink-0 bg-[#fde9e7] rounded-full flex items-center justify-center object-cover object-center overflow-hidden">
                  {user?.avatar || (user as any)?.imageUrl ? (
                    <img
                      src={user?.avatar || (user as any)?.imageUrl}
                      alt="User-Image"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[#d51d10] text-3xl font-semibold">
                      {(user?.name || userName || "S").charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-[#252a34] text-md font-medium leading-tight">
                    {userName || user?.name || "Shivam"}
                  </div>
                  <div className="text-[#555e6f] text-sm font-normal leading-none mt-1">
                    {roleName}
                  </div>
                </div>
              </div>
              <hr className="border-[#e5e9f0]" />
              <li
                onClick={() => {
                  handleClose();
                  router.push("/admin/users");
                }}
                className="text-[#252a34] text-sm font-normal leading-tight flex flex-row items-center justify-start px-4 py-2 cursor-pointer ease-in transition-all hover:text-[#252a34] hover:bg-[#f3f5f8] gap-2 list-none"
              >
                <MdOutlineSettings fontSize={18} className="text-[#555e6f]" />
                <p> Settings </p>
              </li>
              <li
                onClick={() => {
                  handleClose();
                  router.push("/");
                }}
                className="text-[#252a34] text-sm font-normal leading-tight flex flex-row items-center justify-start px-4 py-2 cursor-pointer ease-in transition-all hover:text-[#252a34] hover:bg-[#f3f5f8] gap-2 list-none"
              >
                <MdHelpOutline fontSize={18} className="text-[#555e6f]" />
                <p> Help </p>
              </li>
              <li
                onClick={handleLogout}
                className="text-[#d51d10] text-sm font-normal leading-tight flex flex-row items-center justify-start px-4 py-2 cursor-pointer ease-in transition-all hover:text-[#d51d10] hover:bg-[#f3f5f8] gap-2 list-none"
              >
                <MdLogout fontSize={18} className="text-[#d51d10]" />
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
