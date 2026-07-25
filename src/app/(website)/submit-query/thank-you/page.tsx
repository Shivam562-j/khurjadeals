import React from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaHome,
  FaBuilding,
  FaShoppingBag,
  FaPhoneAlt,
  FaShieldAlt,
  FaClock,
  FaWhatsapp,
  FaPlusCircle,
} from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function ThankYouPage() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Submission Confirmed
          </div>
          <h1 className="h1">Thank You For Your Submission!</h1>
          <p className="lead max-w-xl mx-auto">
            Your ad inquiry has been successfully received by our local Khurja admin team.
          </p>
        </div>
      </div>

      <section className="section-light py-12 sm:py-16">
        <div className="container max-w-3xl">
          {/* Main Success Card using dedicated .thankyou-card CSS */}
          <div className="thankyou-card">
            {/* Top Radial Ambient Glow */}
            <div className="thankyou-glow-bg" />

            {/* Glowing Success Badge */}
            <div className="thankyou-icon-badge">
              <FaCheckCircle />
            </div>

            {/* Title & Description */}
            <h2 className="thankyou-title">
              Ad Inquiry Received Successfully
            </h2>
            <p className="thankyou-desc">
              Thank you! Our Khurja admin team will review your submitted details, verify your phone number, and contact you directly via Call or WhatsApp within <strong className="text-white">24 hours</strong>.
            </p>

            {/* What Happens Next - 3 Step Progress Timeline */}
            <div className="thankyou-steps-grid">
              {/* Step 1 */}
              <div className="thankyou-step-box">
                <div className="thankyou-step-num bg-emerald-500/20 text-emerald-400">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Form Received</h4>
                  <p className="text-[11px] text-neutral-400 leading-normal mt-0.5">
                    Your query is logged in our local database.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="thankyou-step-box">
                <div className="thankyou-step-num bg-[rgba(232,89,12,0.2)] text-[var(--primary)]">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Admin Verification</h4>
                  <p className="text-[11px] text-neutral-400 leading-normal mt-0.5">
                    Phone &amp; details review within 24h.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="thankyou-step-box">
                <div className="thankyou-step-num bg-neutral-800 text-neutral-400">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Direct Connect</h4>
                  <p className="text-[11px] text-neutral-400 leading-normal mt-0.5">
                    Connect directly with local buyers/sellers.
                  </p>
                </div>
              </div>
            </div>

            {/* Single Row 3 Trust Badges */}
            <div className="thankyou-trust-row">
              <div className="thankyou-trust-chip">
                <FaShieldAlt className="text-amber-500 text-xs sm:text-sm shrink-0" />
                <span>100% Free Listing</span>
              </div>
              <div className="thankyou-trust-chip">
                <FaClock className="text-[var(--primary)] text-xs sm:text-sm shrink-0" />
                <span>24h Fast Review</span>
              </div>
              <div className="thankyou-trust-chip">
                <FaPhoneAlt className="text-emerald-500 text-xs sm:text-sm shrink-0" />
                <span>Direct Contact</span>
              </div>
            </div>

            {/* Direct Support Callout */}
            <div className="thankyou-whatsapp-banner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center text-lg shrink-0">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Need Urgent Help?</h4>
                  <p className="text-[11px] text-neutral-400">
                    Call or WhatsApp our Khurja admin directly anytime.
                  </p>
                </div>
              </div>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1eb956] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <FaPhoneAlt className="text-[10px]" />
                <span>{SITE_CONFIG.phone}</span>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="thankyou-actions">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--primary)] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <FaBuilding className="text-xs" />
                <span>Browse Properties</span>
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1c1c1c] border border-neutral-700 text-white font-bold text-xs sm:text-sm hover:border-[var(--primary)] transition-all"
              >
                <FaShoppingBag className="text-xs" />
                <span>Explore Bazaar</span>
              </Link>
              <Link
                href="/submit-query"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#141414] border border-neutral-800 text-neutral-300 hover:text-white font-bold text-xs sm:text-sm transition-all"
              >
                <FaPlusCircle className="text-xs text-[var(--primary)]" />
                <span>Post Another Ad</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
