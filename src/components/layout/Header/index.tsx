"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaPhoneAlt, FaPlus, FaTimes } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-gradient)] text-white font-black text-lg flex items-center justify-center shadow-lg tracking-wider">
                KD
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-white tracking-tight leading-none">
                  Khurja<span className="text-[var(--primary)]">Deals</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] font-bold mt-1">
                  Local Marketplace
                </span>
              </div>
            </div>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={isActive ? "active" : ""}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="nav-actions">
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

        <div className="drawer-logo">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-gradient)] text-white font-black text-lg flex items-center justify-center shadow-lg">
              KD
            </div>
            <span className="font-black text-xl text-white tracking-tight">
              Khurja<span className="text-[var(--primary)]">Deals</span>
            </span>
          </div>
        </div>

        {drawerItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
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
