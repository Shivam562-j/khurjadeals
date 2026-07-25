import React from "react";
import Link from "next/link";
import { FaSearch, FaPhoneAlt, FaHandshake, FaShieldAlt, FaChevronRight, FaCheckCircle } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      icon: <FaSearch />,
      title: "Browse or Post Listing",
      desc: "Explore verified residential properties, commercial shops, plots, or second-hand items. Or post your own ad for free in 2 minutes."
    },
    {
      num: "02",
      icon: <FaPhoneAlt />,
      title: "Connect Directly on Call/WhatsApp",
      desc: "No brokers or agent fees. Click to call or WhatsApp the verified property owner or seller directly to ask questions."
    },
    {
      num: "03",
      icon: <FaHandshake />,
      title: "Inspect & Close the Deal",
      desc: "Meet in person at a safe local location in Khurja, inspect the property or product, verify documents, and finalize the deal."
    }
  ];

  const benefits = [
    "Zero Brokerage or Commission Fees",
    "Admin Verified Local Phone Numbers",
    "Hyper-Local Khurja Coverage & Directions",
    "Specialized Pottery Ceramics Category",
    "100% Free Listing Uploads for Residents",
    "Fast Admin Response Within 24 Hours"
  ];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Simple Process</span>
          <h1 className="h1">How KhurjaDeals Works</h1>
          <p className="lead">Three simple steps to buy, sell, or rent properties and products directly in Khurja.</p>
        </div>
      </div>

      <section className="section-light">
        <div className="container">
          <div className="cards">
            {steps.map((step) => (
              <div key={step.num} className="card relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="card-ic">
                    {step.icon}
                  </div>
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

      <section className="section-alt-light">
        <div className="container">
          <div className="sec-head center">
            <span className="eyebrow">Platform Advantage</span>
            <h2 className="h2">Why Use KhurjaDeals?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="about-feat-card flex items-center gap-3">
                <FaCheckCircle className="text-[var(--primary)] text-lg shrink-0" />
                <span className="font-bold text-white text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section banner */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="h2">Ready to Get Started?</h2>
            <p>Post your ad for free or search through hundreds of active properties and products in Khurja today.</p>
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
