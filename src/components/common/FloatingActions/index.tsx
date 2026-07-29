"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaWhatsapp, FaPhoneAlt, FaArrowUp } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  // Show scroll-to-top button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hello! I need assistance from KhurjaDeals.")}`;
  const phoneUrl = `tel:${SITE_CONFIG.phone}`;

  return (
    <>
      {/* Scroll to Top - Left side */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`floating-scroll-top ${showScrollTop ? "visible" : ""}`}
      >
        <FaArrowUp />
      </button>

      {/* Right side floating buttons */}
      <div className="floating-right-actions">
        {/* WhatsApp - always visible */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="floating-btn floating-whatsapp"
        >
          <FaWhatsapp />
          <span className="floating-btn-tooltip">WhatsApp Us</span>
        </a>

        {/* Phone - visible only on mobile */}
        <a
          href={phoneUrl}
          aria-label="Call us"
          className="floating-btn floating-phone mobile-only-flex"
        >
          <FaPhoneAlt />
          <span className="floating-btn-tooltip">Call Us</span>
        </a>
      </div>
    </>
  );
}
