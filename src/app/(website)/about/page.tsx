import React from "react";
import Container from "@/components/layout/Container";
import { SITE_CONFIG } from "@/constants/site";

export default function AboutPage() {
  return (
    <div className="py-16 bg-neutral-950">
      <Container className="max-w-4xl space-y-16">
        {/* Intro */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            About Our Platform
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Khurja&apos;s Premium Property & Products Directory
          </h1>
          <p className="text-base text-neutral-450 leading-relaxed max-w-2xl mx-auto">
            Khurja Deals is the local marketplace specifically designed for the residents of Khurja, Bulandshahr, Uttar Pradesh.
          </p>
        </div>

        {/* Story details */}
        <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-3xl space-y-6 shadow-xl leading-relaxed text-neutral-300">
          <h3 className="text-xl font-bold text-white">Why Khurja Deals?</h3>
          <p className="text-sm">
            Khurja is globally famous for its ceramic industries and beautiful pottery, as well as being a fast-growing hub for local trades. However, finding verified property listings, commercial shops, plots, or second-hand products historically required dealing with high agent fees, unverified dealers, or outdated advertisement boards.
          </p>
          <p className="text-sm">
            We built <strong>{SITE_CONFIG.name}</strong> to fill this gap. Our mission is to digitize Khurja&apos;s real estate directory and local marketplace, allowing buyers to connect directly with owners on call or WhatsApp. We inspect listings to keep our local bazaar clean, scam-free, and accessible to everyone.
          </p>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl text-center space-y-3 shadow">
            <div className="text-3xl select-none">🛡️</div>
            <h4 className="font-bold text-white text-base">Direct & Safe</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No middle-man commissions. Connect directly with dealers, sellers, or landlords via WhatsApp/Call.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl text-center space-y-3 shadow">
            <div className="text-3xl select-none">📍</div>
            <h4 className="font-bold text-white text-base">Hyper Local</h4>
            <p className="text-xs text-neutral-450 leading-relaxed">
              Fully optimized for Khurja. Find properties near GT Road, Junction, City Center, and specific local sectors.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl text-center space-y-3 shadow">
            <div className="text-3xl select-none">🏺</div>
            <h4 className="font-bold text-white text-base">Pottery & Bazaar</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A dedicated pottery listings market for Khurja&apos;s world-class ceramics, pots, and factory-direct deals.
            </p>
          </div>
        </div>

        {/* Address and details */}
        <div className="border-t border-neutral-850 pt-10 text-center space-y-3 text-sm text-neutral-450">
          <h4 className="font-bold text-white text-base">Operating Head Office</h4>
          <p>{SITE_CONFIG.address}</p>
          <p>
            Email:{" "}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-[var(--primary)] hover:underline"
            >
              {SITE_CONFIG.email}
            </a>{" "}
            · Support Call:{" "}
            <a
              href={`tel:${SITE_CONFIG.phone}`}
              className="text-[var(--primary)] hover:underline"
            >
              {SITE_CONFIG.phone}
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}
