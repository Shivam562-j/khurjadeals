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
import "./thankyou.css";

export default function ThankYouPage() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container text-center">
          <div className="thankyou-badge-eyebrow">
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
          {/* Main Success Card using dedicated thankyou.css */}
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
              Thank you! Our Khurja admin team will review your submitted details, verify your phone number, and contact you directly via Call or WhatsApp within <strong className="text-[var(--text-white)]">24 hours</strong>.
            </p>

            {/* What Happens Next - 3 Step Progress Timeline */}
            <div className="thankyou-steps-grid">
              {/* Step 1 */}
              <div className="thankyou-step-box">
                <div className="thankyou-step-num green">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-white)]">Form Received</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-normal mt-0.5">
                    Your query is logged in our local database.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="thankyou-step-box">
                <div className="thankyou-step-num orange">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-white)]">Admin Verification</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-normal mt-0.5">
                    Phone &amp; details review within 24h.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="thankyou-step-box">
                <div className="thankyou-step-num gray">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-white)]">Direct Connect</h4>
                  <p className="text-[11px] text-[var(--text-muted)] leading-normal mt-0.5">
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

            {/* Direct Support Callout Banner (Image 2 UI Enhanced) */}
            <div className="thankyou-whatsapp-banner">
              <div className="flex items-center gap-3">
                <div className="thankyou-whatsapp-badge">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-white)]">Need Urgent Help?</h4>
                  <p className="text-xs text-[var(--text-muted)]">
                    Call or WhatsApp our Khurja admin directly anytime.
                  </p>
                </div>
              </div>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="thankyou-whatsapp-btn"
              >
                <FaPhoneAlt className="text-xs" />
                <span>{SITE_CONFIG.phone}</span>
              </a>
            </div>

            {/* Enhanced 3 Action Buttons */}
            <div className="thankyou-actions">
              <Link
                href="/properties"
                className="btn-thankyou-primary"
              >
                <FaBuilding className="text-xs" />
                <span>Browse Properties</span>
              </Link>
              <Link
                href="/products"
                className="btn-thankyou-dark"
              >
                <FaShoppingBag className="text-xs" />
                <span>Explore Bazaar</span>
              </Link>
              <Link
                href="/submit-query"
                className="btn-thankyou-outline"
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
