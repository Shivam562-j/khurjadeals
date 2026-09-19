"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import {
  FaHome,
  FaChartBar,
  FaBuilding,
  FaShoppingBag,
  FaEnvelopeOpenText,
  FaUserShield,
  FaTimes,
  FaSignOutAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { AuthUser } from "@/types/user";
import { toast } from "react-toastify";
import Api from "@/api/endPoints";

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

interface MenuItemType {
  item: string;
  link: string;
  icon: React.ReactNode;
  external?: boolean;
  role?: string;
}

interface MenuSectionType {
  items: MenuItemType[];
}

export default function AppSidebar({
  mobileOpen: controlledMobileOpen,
  setMobileOpen: controlledSetMobileOpen,
}: SidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const mobileOpen =
    controlledMobileOpen !== undefined
      ? controlledMobileOpen
      : internalMobileOpen;
  const setMobileOpen = controlledSetMobileOpen || setInternalMobileOpen;

  // Fetch logged in admin user
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.session) {
          setUser(data.session);
        }
      })
      .catch(() => {});
  }, []);

  // Responsive auto-collapse based on window size (matching provided code)
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 789 && !collapsed) {
        setCollapsed(true);
      } else if (width >= 789 && collapsed) {
        setCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const menuSections: MenuSectionType[] = [
    {
      items: [
        {
          item: "Home",
          link: "/",
          icon: <FaHome className="text-lg" />,
          external: true,
        },
        {
          item: "Dashboard",
          link: "/admin/dashboard",
          icon: <FaChartBar className="text-lg" />,
        },
      ],
    },
    {
      items: [
        {
          item: "Properties",
          link: "/admin/properties",
          icon: <FaBuilding className="text-lg" />,
        },
        {
          item: "Bazaar Products",
          link: "/admin/products",
          icon: <FaShoppingBag className="text-lg" />,
        },
        {
          item: "Customer Queries",
          link: "/admin/queries",
          icon: <FaEnvelopeOpenText className="text-lg" />,
        },
      ],
    },
    {
      items: [
        {
          item: "Administrators",
          link: "/admin/users",
          icon: <FaUserShield className="text-lg" />,
          role: "admin",
        },
      ],
    },
  ];

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
      router.push("/admin/login");
      router.refresh();
    }
  };

  const renderSidebarContent = (isMobile: boolean = false) => {
    const isEffectivelyCollapsed = collapsed && !isMobile;

    return (
      <div
        className="flex flex-col h-full bg-[#252A34] text-[#E5E9F0] font-sans"
        style={{
          width: isEffectivelyCollapsed ? "80px" : "260px",
          transition: "width 0.3s ease",
        }}
      >
        {/* ── TOP HEADER / BRANDING (h-[86px], matching provided code) ── */}
        <div
          className={`flex px-4 py-5 items-center gap-2.5 self-stretch h-[86px] my-1 ${
            isEffectivelyCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {/* Logo circle */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 min-w-0"
          >
            <div
              className="flex w-8 h-8 flex-col justify-center items-center rounded-full bg-[#3F4653] shrink-0 text-white font-black text-xs shadow"
              style={{ width: "32px", height: "32px" }}
            >
              <span className="text-[#00be88] font-black tracking-tighter text-sm">
                KD
              </span>
            </div>

            {/* Brand Title */}
            {!isEffectivelyCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-[#e5e9f0] text-sm font-semibold leading-tight truncate">
                  Khurja Deals
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button (Matching TbLayoutSidebarLeftCollapse / RightCollapse) */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-[#D8DDE7] p-[6px] rounded-[4px] hover:bg-[#2e3542] transition-colors cursor-pointer"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {!collapsed ? (
                <TbLayoutSidebarLeftCollapse fontSize={24} />
              ) : (
                <TbLayoutSidebarRightCollapse fontSize={24} />
              )}
            </button>
          )}

          {/* Mobile Drawer Close Button */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="text-[#D8DDE7] p-[6px] rounded-[4px] hover:bg-[#2e3542] transition-colors"
            >
              <FaTimes className="text-sm" />
            </button>
          )}
        </div>

        {/* ── MENU ITEMS CONTAINER (h-[calc(100vh-154px)] matching provided code) ── */}
        <div className="h-[calc(100vh-154px)] no-scrollbar overflow-y-auto flex-1 py-1">
          {menuSections.map((section, sectionIndex) => {
            // Filter section items by role if needed
            const visibleItems = section.items.filter((item) => {
              if (item.role && user?.role !== item.role) return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={sectionIndex} className="mb-2">
                <div className="space-y-1">
                  {visibleItems.map((menuItem) => {
                    const isActive =
                      menuItem.link === "/"
                        ? pathname === "/"
                        : pathname.startsWith(menuItem.link);
                    const isHovered = hoveredItem === menuItem.item;

                    return (
                      <div
                        key={menuItem.item}
                        className="relative group/tooltip"
                        onMouseEnter={() => setHoveredItem(menuItem.item)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <Link
                          href={menuItem.link}
                          target={menuItem.external ? "_blank" : undefined}
                          onClick={() => isMobile && setMobileOpen(false)}
                          className={`w-full px-4 py-2 flex items-center gap-3 rounded-lg transition-all duration-200 no-underline cursor-pointer ${
                            isEffectivelyCollapsed
                              ? "justify-center !px-2.5"
                              : "justify-start"
                          }`}
                          style={{
                            color: isActive ? "#00be88" : "#B0B7C5",
                            fontWeight: isActive ? 600 : 500,
                            backgroundColor:
                              isActive || isHovered ? "#2e3542" : "transparent",
                            padding: isEffectivelyCollapsed
                              ? "8px 10px"
                              : "8px 16px",
                          }}
                        >
                          {/* Icon Container */}
                          <span
                            className="icon-container flex items-center justify-center shrink-0 text-xl transition-colors"
                            style={{
                              color:
                                isActive || isHovered ? "#00be88" : "#B0B7C5",
                            }}
                          >
                            {menuItem.icon}
                          </span>

                          {/* Menu Item Text with increased font size */}
                          {!isEffectivelyCollapsed && (
                            <span
                              className="menu-item-text text-[15px] font-semibold truncate flex-1 tracking-wide"
                              style={{
                                color:
                                  isActive || isHovered
                                    ? "#E5E9F0"
                                    : "#B0B7C5",
                                fontWeight: isActive ? 600 : 500,
                              }}
                            >
                              {menuItem.item}
                            </span>
                          )}

                          {!isEffectivelyCollapsed && menuItem.external && (
                            <FaExternalLinkAlt className="text-xs opacity-60 ml-auto" />
                          )}
                        </Link>

                        {/* Collapsed Tooltip */}
                        {isEffectivelyCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-[#565f70] text-[#fcfcfc] text-xs font-semibold rounded-md shadow-xl pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 whitespace-nowrap">
                            {menuItem.item}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Section Divider (height 2px, background #2E3542, margin 24px 0 matching provided code) */}
                {sectionIndex < menuSections.length - 1 && (
                  <div
                    className="my-4 mx-3"
                    style={{
                      height: "2px",
                      backgroundColor: "#2E3542",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ── FOOTER (h-[56px] matching provided code: Powered by SaasOrgName) ── */}
        <div className="p-4 px-3 border-t border-[#0000001f] bg-[#252a34] h-[56px] shrink-0 flex items-center">
          <div
            className={`flex flex-row items-center gap-2.5 w-full ${
              isEffectivelyCollapsed ? "justify-center" : "justify-start"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#3F4653] flex items-center justify-center text-[10px] text-[#00be88] font-black shrink-0">
              KD
            </div>

            {!isEffectivelyCollapsed && (
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="text-[#717b8c] text-[10px] font-medium leading-3">
                  Powered by
                </div>
                <div className="text-[#717b8c] text-xs font-semibold leading-none truncate">
                  Khurja Deals
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}

      {/* ── DESKTOP STICKY SIDEBAR (Matching Box position: sticky, height: 100vh from provided code) ── */}
      <aside
        className="hidden md:flex sticky top-0 bottom-0 h-screen shrink-0 z-30 overflow-hidden"
        style={{
          width: collapsed ? "80px" : "260px",
          transition: "width 0.3s ease",
        }}
      >
        {renderSidebarContent(false)}
      </aside>
    </>
  );
}
