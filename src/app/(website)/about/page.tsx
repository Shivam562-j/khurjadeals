import React from "react";
import Link from "next/link";
import { FaShieldAlt, FaStar, FaUserCheck, FaClock, FaCheckCircle, FaChevronRight, FaPhoneAlt, FaBuilding, FaStore } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function AboutPage() {
  const differentiators = [
    {
      title: "Direct Owner Contact",
      desc: "Connect directly with property owners, sellers, and landlords on Call or WhatsApp. Zero middle-man agent commissions.",
      icon: <FaUserCheck />
    },
    {
      title: "Verified Local Listings",
      desc: "Every plot, house, commercial shop, and second-hand item is manually inspected and verified by our Khurja admin team.",
      icon: <FaShieldAlt />
    },
    {
      title: "Famous Pottery Bazaar",
      desc: "Explore factory-direct ceramics, decorative pots, and traditional Khurja pottery directly from local artisans.",
      icon: <FaStore />
    },
    {
      title: "24/7 Local Support",
      desc: "Our dedicated Khurja support team is available round the clock to answer your queries and assist with listings.",
      icon: <FaClock />
    },
    {
      title: "Transparent & Free Listings",
      desc: "Post your residential property, commercial shop, or second-hand products 100% free with no hidden charges.",
      icon: <FaCheckCircle />
    },
    {
      title: "Hyper-Local Directory",
      desc: "Designed specifically for Khurja, GT Road, Junction, and surrounding sectors in Bulandshahr.",
      icon: <FaBuilding />
    }
  ];

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1 className="h1">Khurja&apos;s Trusted Local Marketplace</h1>
          <p className="lead">Your dependable directory partner across Khurja — for real estate, second-hand items, and pottery ceramics.</p>
        </div>
      </div>

      <section className="section-light">
        <div className="container about-grid">
          <div className="card space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xl shrink-0 border border-[var(--primary-glow)]">
              <FaStar />
            </div>
            <span className="eyebrow">Who We Are</span>
            <h2 className="h2" style={{ color: "var(--text-white)", marginBottom: "16px" }}>
              Empowering Khurja&apos;s Local Commerce
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              At <strong>{SITE_CONFIG.name}</strong>, we&apos;re more than just a listing website — we&apos;re your dependable local marketplace partner across Khurja, Bulandshahr, Uttar Pradesh.
            </p>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Khurja is globally famous for its ceramic industries and beautiful pottery, as well as being a fast-growing hub for local trades. However, finding verified property listings, commercial shops, plots, or second-hand products historically required dealing with high agent fees or unverified brokers.
            </p>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              We built <strong>{SITE_CONFIG.name}</strong> to digitize Khurja&apos;s real estate directory and bazaar, allowing buyers to connect directly with owners on call or WhatsApp.
            </p>
          </div>

          <div className="space-y-6">
            <div className="card border-[var(--border-color)] space-y-4">
              <h3 className="text-xl font-bold text-white">Our Mission</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                To create a clean, scam-free, transparent digital directory where every resident of Khurja can buy, sell, or rent properties and products with zero middleman commissions.
              </p>
            </div>
            <div className="card border-[var(--border-color)] space-y-4">
              <h3 className="text-xl font-bold text-white">Our Vision</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                To showcase Khurja&apos;s pottery craftsmanship worldwide while building the most reliable hyper-local marketplace in Western Uttar Pradesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-alt-light">
        <div className="container">
          <div className="sec-head center">
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="h2">What Sets Us Apart</h2>
          </div>

          <div className="about-features">
            {differentiators.map((diff, index) => (
              <div className="about-feat-card" key={index}>
                <div className="about-feat-icon">
                  {diff.icon}
                </div>
                <h3>{diff.title}</h3>
                <p>{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section banner */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="h2">Ready to Post Your Ad?</h2>
            <p>Post your property or second-hand product for free today. Our admin team verifies and activates your listing within 24 hours.</p>
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
