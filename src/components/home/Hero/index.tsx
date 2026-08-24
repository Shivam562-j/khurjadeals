"use client";
import React from "react";
import Link from "next/link";
import {
  FaBuilding,
  FaKey,
  FaMotorcycle,
  FaMobileAlt,
  FaLaptop,
  FaTv,
  FaHome,
  FaBox,
  FaCheckCircle,
  FaSearch,
  FaPhoneAlt,
  FaCar,
} from "react-icons/fa";

import { useQueryClient } from "@tanstack/react-query";

const stats = [
  { value: "500+",  label: "Active Listings" },
  { value: "200+",  label: "Properties" },
  { value: "1k+",   label: "Happy Buyers" },
  { value: "100%",  label: "Verified" },
];

const hpoints = [
  { icon: <FaHome />, label: "Properties", sub: "Buy, Sell & Rent" },
  { icon: <FaBox />, label: "Used Items", sub: "Bikes, Cars & Tech" },
  { icon: <FaTv />, label: "Appliances", sub: "Fridge, AC & Washer" },
];

const quickLinks = [
  { label: "Buy Property",  href: "/properties?listingType=sell",   icon: <FaBuilding /> },
  { label: "Rent Property", href: "/properties?listingType=rent",   icon: <FaKey /> },
  { label: "Used Bikes & Cars", href: "/products?search=bike",      icon: <FaMotorcycle /> },
  { label: "Mobiles",       href: "/products?search=phone",         icon: <FaMobileAlt /> },
  { label: "Laptops",       href: "/products?search=laptop",        icon: <FaLaptop /> },
  { label: "Appliances (AC/Fridge)", href: "/products?search=fridge", icon: <FaTv /> },
];

export default function Hero() {
  const queryClient = useQueryClient();

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
  return (
    <>
      <section className="hero bg-grid">
        {/* Ambient glow */}
        <div style={{
          position: "absolute", top: "50%", left: "30%",
          transform: "translate(-50%,-50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,89,12,0.13) 0%, transparent 65%)",
          pointerEvents: "none", zIndex: 1,
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-inner">
            {/* ── Left: Copy ── */}
            <div className="hero-copy animate-fade-up">
              <div className="eyebrow animate-fade-up">
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--primary)",
                  display: "inline-block",
                  boxShadow: "0 0 8px var(--primary)",
                  animation: "blink 2s ease-in-out infinite",
                }} />
                Khurja&apos;s #1 Local Marketplace
              </div>

              <h1 className="h1 animate-fade-up delay-100" style={{ marginBottom: 20 }}>
                Buy, Sell &amp; Rent in{" "}
                <span className="accent">Khurja</span>
              </h1>

              <p className="lead animate-fade-up delay-200">
                Khurja ka apna local directory — verified commercial &amp; residential properties,
                plots for sale/rent, used bikes, cars, EVs, laptops, mobiles, fridge, AC &amp; washing machines.
                Sab kuch ek jagah.
              </p>

              <div className="hero-cta animate-fade-up delay-300">
                <Link
                  href="/properties"
                  className="btn btn-primary btn-lg"
                  onMouseEnter={prefetchProperties}
                  onTouchStart={prefetchProperties}
                  onFocus={prefetchProperties}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Explore Properties
                </Link>
                <Link
                  href="/products"
                  className="btn btn-outline btn-lg"
                  onMouseEnter={prefetchProducts}
                  onTouchStart={prefetchProducts}
                  onFocus={prefetchProducts}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  Browse Used Items
                </Link>
              </div>

              {/* Hero points */}
              <div className="hero-points animate-fade-up delay-400">
                {hpoints.map((p) => (
                  <div key={p.label} className="hpoint">
                    <div className="hp-ic" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="flex items-center justify-center text-sm">{p.icon}</span>
                    </div>
                    <div className="hp-label">
                      {p.label}
                      <span>{p.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Cards ── */}
            <div className="animate-fade-up delay-200">
              {/* Stats Grid */}
              <div className="hero-stat-card">
                <div className="hero-stat-grid">
                  {stats.map((s) => (
                    <div key={s.label} className="stat-box">
                      <div className="stat-box-val">{s.value}</div>
                      <div className="stat-box-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini CTA card */}
                <div className="hero-cta-card">
                  <p>Have property or items to sell?</p>
                  <span>List for free — admin calls you in 24h</span>
                  <Link href="/submit-query" className="btn btn-primary" style={{ width: "100%" }}>
                    Post Your Ad — Free
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick Browse ── */}
          <div style={{
            marginTop: 64, paddingTop: 40,
            borderTop: "1px solid var(--border-color)",
          }}>
            <p style={{
              textAlign: "center", fontSize: "0.72rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.22em",
              color: "var(--text-muted)", marginBottom: 24,
            }}>
              Quick Browse Categories
            </p>
            <div style={{
              display: "flex", flexWrap: "wrap",
              justifyContent: "center", gap: 10,
            }}>
              {quickLinks.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "9px 18px", borderRadius: 999,
                    background: "rgba(255,255,255,0.03)",
                    border: "1.5px solid var(--border-color)",
                    color: "var(--text-muted)", fontSize: "0.86rem", fontWeight: 600,
                    transition: "var(--transition-smooth)",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "var(--primary-light)";
                    el.style.borderColor = "var(--primary)";
                    el.style.color = "var(--primary)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.03)";
                    el.style.borderColor = "var(--border-color)";
                    el.style.color = "var(--text-muted)";
                  }}
                >
                  <span className="flex items-center justify-center text-xs">{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <div className="trust-strip">
        <div className="container">
          <div className="trust-row">
            {[
              { icon: <FaCheckCircle />, big: "100% Free", text: "To list your property or product" },
              { icon: <FaSearch />, big: "Admin Verified", text: "Every listing is manually checked" },
              { icon: <FaPhoneAlt />, big: "Direct Contact", text: "Direct owner & buyer connection" },
              { icon: <FaCar />, big: "Local Marketplace", text: "Second-hand bikes, tech & appliances" },
            ].map((item) => (
              <div key={item.big} className="trust-cell">
                <div className="tc-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="flex items-center justify-center text-sm text-[var(--primary)]">{item.icon}</span>
                </div>
                <div>
                  <div className="tc-big">{item.big}</div>
                  <div className="tc-text">{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
