"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";
import { SITE_CONFIG } from "@/constants/site";
import Container from "../Container";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTarget, setSearchTarget] = useState<"property" | "product">("property");
  const [headerQuery, setHeaderQuery] = useState("");

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerQuery.trim()) return;
    const url = searchTarget === "property"
      ? `/properties?search=${encodeURIComponent(headerQuery.trim())}`
      : `/products?search=${encodeURIComponent(headerQuery.trim())}`;
    router.push(url);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-neutral-950/85 backdrop-blur-md">
      <Container className="max-w-5xl mx-auto">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/logos/white-logo.png"
              alt={SITE_CONFIG.name}
              className="h-10 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logos/logo.png";
              }}
            />
          </Link>

          {/* Inline Header Search Bar - Desktop Only */}
          <form
            onSubmit={handleHeaderSearch}
            className="hidden lg:flex items-center flex-1 w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden px-2 py-1 gap-1"
          >
            <select
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value as "property" | "product")}
              className="bg-transparent text-neutral-300 text-xs font-bold px-2 py-1 outline-none border-r border-neutral-850 cursor-pointer"
            >
              <option value="property">🏢 Prop</option>
              <option value="product">📦 Baz</option>
            </select>
            <input
              type="text"
              placeholder="Khurja mein khojein..."
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-xs outline-none px-2 py-1 placeholder-neutral-500"
            />
            <button
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              🔎
            </button>
          </form>

          {/* Desktop Nav Links & CTAs */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {NAV_LINKS.slice(0, 3).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-[var(--primary)]"
                        : "text-neutral-350 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/submit-query"
                className="inline-flex items-center justify-center font-bold rounded-lg px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs uppercase tracking-wide shadow-md transition-colors"
              >
                Post Ad
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center font-bold rounded-lg px-4 py-2 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-xs uppercase tracking-wide transition-colors"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-900 bg-neutral-950 px-4 py-6 space-y-4">
          {/* Mobile Search Bar */}
          <form
            onSubmit={handleHeaderSearch}
            className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden px-2 py-1 gap-1"
          >
            <select
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value as "property" | "product")}
              className="bg-transparent text-neutral-350 text-sm font-bold px-2 py-1 outline-none border-r border-neutral-800 cursor-pointer"
            >
              <option value="property">🏢 Prop</option>
              <option value="product">📦 Baz</option>
            </select>
            <input
              type="text"
              placeholder="Khurja mein khojein..."
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none px-2 py-1 placeholder-neutral-500"
            />
            <button
              type="submit"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              🔎
            </button>
          </form>

          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium tracking-wide transition-colors px-2 py-1.5 rounded-lg ${
                    isActive
                      ? "text-[var(--primary)] bg-neutral-900/50"
                      : "text-neutral-350 hover:text-white hover:bg-neutral-900/30"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-neutral-900 flex flex-col gap-3">
            <Link
              href="/submit-query"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center font-bold rounded-lg px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-base shadow-md transition-colors"
            >
              Post Ad
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center font-bold rounded-lg px-4 py-2.5 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-base transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
