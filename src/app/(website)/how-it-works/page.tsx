import React from "react";
import Link from "next/link";
import {
  FaSearch,
  FaPhoneAlt,
  FaHandshake,
  FaShieldAlt,
  FaChevronRight,
  FaMoneyBillWave,
  FaMapMarkedAlt,
  FaStore,
  FaRocket,
  FaClock,
} from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      icon: <FaSearch />,
      title: "Browse or Post Listing",
      desc: "Explore verified residential properties, commercial shops, plots, or second-hand items. Or post your own ad for free in 2 minutes.",
    },
    {
      num: "02",
      icon: <FaPhoneAlt />,
      title: "Connect Directly on Call/WhatsApp",
      desc: "No brokers or agent fees. Click to call or WhatsApp the verified property owner or seller directly to ask questions.",
    },
    {
      num: "03",
      icon: <FaHandshake />,
      title: "Inspect & Close the Deal",
      desc: "Meet in person at a safe local location in Khurja, inspect the property or product, verify documents, and finalize the deal.",
    },
  ];

  const benefitsList = [
    {
      icon: <FaMoneyBillWave />,
      title: "Zero Brokerage Fees",
      desc: "Deal directly with real owners & buyers. Save 100% of broker fees and agent commissions.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Admin Verified Contacts",
      desc: "All phone numbers and listings undergo manual verification to ensure a safe, scam-free experience.",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Hyper-Local Coverage",
      desc: "Custom tailored for GT Road, Khurja Junction, Subhash Road, and surrounding Bulandshahr sectors.",
    },
    {
      icon: <FaStore />,
      title: "Pottery & Ceramics Hub",
      desc: "Direct access to factory-rate ceramic items and art from Khurja's world-famous master artisans.",
    },
    {
      icon: <FaRocket />,
      title: "100% Free Ad Posting",
      desc: "Post your residential house, commercial plot, or second-hand items with zero listing charges.",
    },
    {
      icon: <FaClock />,
      title: "Fast 24-Hour Activation",
      desc: "Our active local admin team reviews and approves your submitted listings within 24 hours.",
    },
  ];

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Simple Process</span>
          <h1 className="h1">How KhurjaDeals Works</h1>
          <p className="lead">
            Three simple steps to buy, sell, or rent properties and products directly in Khurja.
          </p>
        </div>
      </div>

      {/* 3 Step Guide Section */}
      <section className="section-light">
        <div className="container">
          <div className="cards">
            {steps.map((step) => (
              <div key={step.num} className="card relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="card-ic">{step.icon}</div>
                  <span className="text-3xl font-black text-[var(--primary)] opacity-40">
                    {step.num}
                  </span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Use KhurjaDeals Section */}
      <section className="section-alt-light">
        <div className="container">
          <div className="sec-head center">
            <span className="eyebrow">Platform Advantage</span>
            <h2 className="h2">Why Use KhurjaDeals?</h2>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Built specifically for Khurja residents to make local buying, selling, and renting seamless, transparent, and completely free.
            </p>
          </div>

          <div className="about-features">
            {benefitsList.map((item, idx) => (
              <div key={idx} className="about-feat-card">
                <div className="about-feat-icon">
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section Banner */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="h2">Ready to Get Started?</h2>
            <p>
              Post your ad for free or search through hundreds of active properties and products in Khurja today.
            </p>
            <div className="cta-actions">
              <Link className="btn btn-light btn-lg" href="/submit-query">
                Post Free Ad
                <FaChevronRight className="text-xs" />
              </Link>
              <a className="btn btn-ghost btn-lg" href={`tel:${SITE_CONFIG.phone}`}>
                <FaPhoneAlt style={{ color: "var(--primary)" }} />
                {SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
