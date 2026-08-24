"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPhoneAlt, FaPlus, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";
import { useTheme } from "@/hooks/useTheme";

import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  // Instant preloading handlers for Properties and Products
  const prefetchProperties = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["properties", "", [], [], "", "", ""],
      queryFn: async () => {
        const res = await fetch("/api/properties?page=1&limit=15");
        return res.json();
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 3,
    });
  };

  const prefetchProducts = () => {
    queryClient.prefetchInfiniteQuery({
      queryKey: ["products", "", [], [], "", "", ""],
      queryFn: async () => {
        const res = await fetch("/api/products?page=1&limit=15");
        return res.json();
      },
      initialPageParam: 1,
      staleTime: 1000 * 60 * 3,
    });
  };

  const prefetchReviews = () => {
    queryClient.prefetchQuery({
      queryKey: ["reviews"],
      queryFn: async () => {
        const res = await fetch("/api/reviews");
        return res.json();
      },
      staleTime: 1000 * 60 * 3,
    });
  };

  const handleItemHover = (path: string) => {
    if (path === "/properties") prefetchProperties();
    if (path === "/products") prefetchProducts();
    if (path === "/reviews") prefetchReviews();
  };

  // Close drawer on path change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Reviews", path: "/reviews" },
  ];

  // Mobile drawer shows all links
  const drawerItems = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "Products", path: "/products" },
    { name: "Services", path: "/services" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "About", path: "/about" },
    { name: "Reviews", path: "/reviews" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <>
      <header className={`site-header ${scrolled ? "scrolled" : ""}`} id="header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="KhurjaDeals">
            <img
              src={theme === "light" ? "/logos/logo.webp" : "/logos/white-logo.webp"}
              alt="KhurjaDeals"
              style={{ height: "50px", maxHeight: "50px", width: "auto" }}
              className="object-contain rounded-lg bg-white px-2.5 py-1 shadow-sm transition-transform hover:scale-105"
            />
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={isActive ? "active" : ""}
                  onMouseEnter={() => handleItemHover(item.path)}
                  onTouchStart={() => handleItemHover(item.path)}
                  onFocus={() => handleItemHover(item.path)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="nav-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
            </button>
            <a className="nav-phone" href={`tel:${SITE_CONFIG.phone}`}>
              <FaPhoneAlt />
              <span>{SITE_CONFIG.phone}</span>
            </a>
            <Link className="btn btn-primary" href="/submit-query">
              <FaPlus className="text-xs" />
              Post Free Ad
            </Link>
            <button
              className={`burger ${isOpen ? "open" : ""}`}
              onClick={toggleDrawer}
              aria-label="Menu"
              aria-expanded={isOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Scrim */}
      <div
        className={`scrim ${isOpen ? "open" : ""}`}
        onClick={toggleDrawer}
      ></div>

      {/* Side Navigation Drawer for Mobile/Tablet */}
      <aside className={`drawer ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
        <button
          className="drawer-close"
          onClick={toggleDrawer}
          aria-label="Close menu"
        >
          <FaTimes size={20} />
        </button>

        <div className="drawer-logo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            <img
              src={theme === "light" ? "/logos/logo.webp" : "/logos/white-logo.webp"}
              alt="KhurjaDeals"
              style={{ height: "36px", maxHeight: "36px", width: "auto" }}
              className="object-contain rounded-lg bg-white px-2 py-1 shadow-sm"
            />
          </Link>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
        </div>

        {drawerItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            onMouseEnter={() => handleItemHover(item.path)}
            onTouchStart={() => handleItemHover(item.path)}
            onFocus={() => handleItemHover(item.path)}
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}

        <a className="btn btn-outline" href={`tel:${SITE_CONFIG.phone}`}>
          <FaPhoneAlt />
          Call {SITE_CONFIG.phone}
        </a>
        <Link className="btn btn-primary" href="/submit-query" onClick={() => setIsOpen(false)}>
          <FaPlus className="text-xs" />
          Post Free Ad
        </Link>
      </aside>
    </>
  );
}
