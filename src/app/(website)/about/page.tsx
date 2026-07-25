import React from "react";
import { FaShieldAlt, FaMapMarkerAlt, FaStore } from "react-icons/fa";
import Container from "@/components/layout/Container";
import { SITE_CONFIG } from "@/constants/site";

export default function AboutPage() {
  return (
    <div className="py-16 bg-[var(--bg-dark)]">
      <Container className="max-w-4xl space-y-16">
        {/* Intro */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] border border-[rgba(232,89,12,0.15)] px-3.5 py-1.5 rounded-full">
            About Our Platform
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-white)]">
            Khurja&apos;s Premium Property &amp; Products Directory
          </h1>
          <p className="text-base text-[var(--text-muted)] leading-relaxed max-w-2xl mx-auto">
            Khurja Deals is the local marketplace specifically designed for the residents of Khurja, Bulandshahr, Uttar Pradesh.
          </p>
        </div>

        {/* Story details */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 rounded-3xl space-y-6 shadow-sm leading-relaxed text-[var(--text-main)]">
          <h3 className="text-xl font-bold text-[var(--text-white)]">Why Khurja Deals?</h3>
          <p className="text-sm">
            Khurja is globally famous for its ceramic industries and beautiful pottery, as well as being a fast-growing hub for local trades. However, finding verified property listings, commercial shops, plots, or second-hand products historically required dealing with high agent fees, unverified dealers, or outdated advertisement boards.
          </p>
          <p className="text-sm">
            We built <strong>{SITE_CONFIG.name}</strong> to fill this gap. Our mission is to digitize Khurja&apos;s real estate directory and local marketplace, allowing buyers to connect directly with owners on call or WhatsApp. We inspect listings to keep our local bazaar clean, scam-free, and accessible to everyone.
          </p>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-center space-y-3 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xl shadow-sm">
              <FaShieldAlt />
            </div>
            <h4 className="font-bold text-[var(--text-white)] text-base">Direct &amp; Safe</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              No middle-man commissions. Connect directly with dealers, sellers, or landlords via WhatsApp/Call.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-center space-y-3 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xl shadow-sm">
              <FaMapMarkerAlt />
            </div>
            <h4 className="font-bold text-[var(--text-white)] text-base">Hyper Local</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Fully optimized for Khurja. Find properties near GT Road, Junction, City Center, and specific local sectors.
            </p>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl text-center space-y-3 shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xl shadow-sm">
              <FaStore />
            </div>
            <h4 className="font-bold text-[var(--text-white)] text-base">Pottery &amp; Bazaar</h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              A dedicated pottery listings market for Khurja&apos;s world-class ceramics, pots, and factory-direct deals.
            </p>
          </div>
        </div>

        {/* Address and details */}
        <div className="border-t border-[var(--border-color)] pt-10 text-center space-y-3 text-sm text-[var(--text-muted)]">
          <h4 className="font-bold text-[var(--text-white)] text-base">Operating Head Office</h4>
          <p>{SITE_CONFIG.address}</p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-[var(--primary)] hover:underline font-semibold"
            >
              {SITE_CONFIG.email}
            </a>{" "}
            · Support Call:{" "}
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="text-[var(--primary)] hover:underline font-semibold"
            >
              {SITE_CONFIG.phone}
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}
