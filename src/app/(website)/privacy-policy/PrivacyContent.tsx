"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaShieldAlt,
  FaLock,
  FaUserCheck,
  FaEnvelope,
  FaPhoneAlt,
  FaHome,
  FaDatabase,
  FaEye,
  FaGlobe,
  FaCookieBite,
  FaChild,
  FaLink,
  FaSyncAlt,
  FaChevronRight,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

const SECTIONS = [
  { id: "info-collect", label: "1. Information We Collect", icon: FaDatabase },
  { id: "how-use", label: "2. How We Use Information", icon: FaUserCheck },
  { id: "publicly-visible", label: "3. Publicly Visible Info", icon: FaEye },
  { id: "data-sharing", label: "4. Data Sharing & Disclosure", icon: FaGlobe },
  { id: "cookies", label: "5. Cookies & Tracking", icon: FaCookieBite },
  { id: "your-rights", label: "6. Your Rights (DPDP 2023)", icon: FaShieldAlt },
  { id: "retention", label: "7. Data Retention & Security", icon: FaLock },
  { id: "children", label: "8. Children's Privacy", icon: FaChild },
  { id: "third-party", label: "9. Third-Party Links", icon: FaLink },
  { id: "changes", label: "10. Policy Changes", icon: FaSyncAlt },
  { id: "grievance", label: "11. Grievance Officer & Contact", icon: FaEnvelope },
] as const;

export default function PrivacyContent() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => {
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Legal Compliance — DPDP Act 2023</span>
          <h1 className="h1">Privacy Policy</h1>
          <p className="lead">
            Effective Date:{" "}
            <span style={{ color: "var(--text-white)", fontWeight: 600 }}>July 23, 2026</span>
            &nbsp;&middot;&nbsp; Website:{" "}
            <span style={{ color: "var(--primary)" }}>khurjadeals.com</span>
          </p>
        </div>
      </div>

      <section className="section-light">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="terms-layout">

            {/* ── Sticky Sidebar TOC (Hidden on Phone/Mobile) ── */}
            <aside className="terms-sidebar">
              <p className="terms-toc-label">Sections</p>
              <nav>
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`terms-toc-btn${activeSection === s.id ? " active" : ""}`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ── Main Content ── */}
            <div className="terms-content">

              {/* Intro card */}
              <div className="terms-intro-card">
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                  <div className="terms-sec-icon" style={{ flexShrink: 0 }}><FaShieldAlt /></div>
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-white)", marginBottom: 8 }}>
                      Welcome to KhurjaDeals
                    </h3>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.75 }}>
                      Your privacy is extremely important to us. This Privacy Policy explains how we collect, use, disclose, and
                      safeguard your personal information when you visit and use{" "}
                      <a href="https://khurjadeals.com/" className="terms-link">https://khurjadeals.com/</a> — in compliance
                      with the{" "}
                      <strong style={{ color: "var(--text-white)" }}>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>{" "}
                      and the{" "}
                      <strong style={{ color: "var(--text-white)" }}>Information Technology Act, 2000</strong>.
                    </p>
                  </div>
                </div>
                <div className="pp-meta-row">
                  <div className="pp-meta-chip">
                    <FaEnvelope /> {SITE_CONFIG.email}
                  </div>
                  <div className="pp-meta-chip">
                    <FaPhoneAlt /> {SITE_CONFIG.phone}
                  </div>
                  <div className="pp-meta-chip">
                    <FaGlobe /> khurjadeals.com
                  </div>
                </div>
              </div>

              {/* Section 1 */}
              <section id="info-collect" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaDatabase /></div>
                  <h2>1. Information We Collect</h2>
                </div>
                <p className="terms-sec-lead">
                  We collect personal information that you voluntarily provide when registering an account, posting listings, or
                  communicating with us:
                </p>
                <div className="pp-info-grid">
                  <div className="pp-info-card">
                    <div className="pp-info-icon"><FaUserCheck /></div>
                    <h4>Personal &amp; Contact Details</h4>
                    <p>Full Name, Mobile Number, Email Address provided during registration or inquiry submission.</p>
                  </div>
                  <div className="pp-info-card">
                    <div className="pp-info-icon"><FaHome /></div>
                    <h4>Listing Information</h4>
                    <p>Property details, vehicle info, second-hand product descriptions, pricing, location, and photos uploaded by you.</p>
                  </div>
                  <div className="pp-info-card">
                    <div className="pp-info-icon"><FaEnvelope /></div>
                    <h4>Communications</h4>
                    <p>Messages sent through our contact forms or community section for support and inquiry purposes.</p>
                  </div>
                  <div className="pp-info-card">
                    <div className="pp-info-icon"><FaDatabase /></div>
                    <h4>Technical &amp; Usage Data</h4>
                    <p>IP address, browser type, device details, OS, and access logs — collected automatically for performance and security.</p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-use" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaUserCheck /></div>
                  <h2>2. How We Use Your Information &amp; Legal Basis</h2>
                </div>
                <p className="terms-sec-lead">
                  We process your personal data strictly based on your consent and for legitimate business purposes:
                </p>
                <ul className="terms-list">
                  {[
                    "To create, verify, and manage your user account.",
                    "To display and publish your listings (real estate, vehicles, goods) so potential buyers/tenants can contact you.",
                    "To facilitate communication in our local community section.",
                    "To prevent fraud, spam, fake listings, and unauthorized access.",
                    "To improve platform functionality, user experience, and technical security.",
                    "To comply with statutory legal obligations and law enforcement requests.",
                  ].map((item, i) => (
                    <li key={i} className="terms-list-item">
                      <FaCheckCircle className="terms-list-icon green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 3 */}
              <section id="publicly-visible" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaEye /></div>
                  <h2>3. Publicly Visible Information</h2>
                </div>
                <div className="terms-alert amber">
                  <div className="terms-alert-title">
                    <FaExclamationTriangle /> Important Notice
                  </div>
                  <p>
                    When you post a listing on KhurjaDeals (e.g., real estate or second-hand items), your{" "}
                    <strong>listing details, photos, city/location,</strong> and your chosen contact method{" "}
                    <strong>(Mobile Number/Email)</strong> will be visible to other visitors on the platform — to facilitate
                    buyers and sellers reaching out to you directly.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="data-sharing" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaGlobe /></div>
                  <h2>4. Data Sharing &amp; Disclosure</h2>
                </div>
                <p className="terms-sec-lead">
                  We do <strong style={{ color: "var(--text-white)" }}>not sell, rent, or trade</strong> your personal information
                  to third parties for marketing purposes. We may disclose your information only in the following circumstances:
                </p>
                <div className="terms-two-col">
                  <div className="terms-box">
                    <h4><FaShieldAlt /> Legal Requirements</h4>
                    <p>When required by law, court orders, subpoena, or government authorities under Indian law.</p>
                  </div>
                  <div className="terms-box">
                    <h4><FaExclamationTriangle /> Safety &amp; Fraud Prevention</h4>
                    <p>To enforce our Terms &amp; Conditions, investigate potential fraud, or protect user safety and rights.</p>
                  </div>
                  <div className="terms-box">
                    <h4><FaDatabase /> Service Providers</h4>
                    <p>To trusted third-party technical infrastructure providers (hosting, database) bound by confidentiality obligations.</p>
                  </div>
                  <div className="terms-box">
                    <h4><FaLock /> No Marketing Sharing</h4>
                    <p>We never sell or share your data with advertisers, telemarketers, or third-party marketers under any circumstance.</p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="cookies" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaCookieBite /></div>
                  <h2>5. Cookies &amp; Tracking Technologies</h2>
                </div>
                <p className="terms-sec-lead">
                  KhurjaDeals uses cookies and similar session technologies to:
                </p>
                <div className="terms-chip-grid">
                  {[
                    "Keep you logged in across sessions.",
                    "Remember your preferences and search filters.",
                    "Enhance platform security and detect suspicious activity.",
                    "Analyze platform traffic and improve user experience.",
                  ].map((item, i) => (
                    <div key={i} className="terms-chip">
                      <span className="terms-chip-dot" />
                      {item}
                    </div>
                  ))}
                </div>
                <p style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                  You can manage or disable cookies through your browser settings. However, some features of the platform may not
                  function properly if cookies are disabled.
                </p>
              </section>

              {/* Section 6 */}
              <section id="your-rights" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaShieldAlt /></div>
                  <h2>6. Your Rights — DPDP Act, 2023</h2>
                </div>
                <p className="terms-sec-lead">
                  As a <strong style={{ color: "var(--text-white)" }}>Data Principal</strong> under Indian law, you have the
                  following rights regarding your personal data:
                </p>
                <div className="pp-rights-grid">
                  {[
                    {
                      icon: <FaEye />,
                      title: "Right to Access",
                      desc: "Request summary details of the personal data we hold about you at any time.",
                    },
                    {
                      icon: <FaCheckCircle />,
                      title: "Right to Correction & Erasure",
                      desc: "Request correction of inaccurate data or deletion of your account and associated listings.",
                    },
                    {
                      icon: <FaLock />,
                      title: "Right to Withdraw Consent",
                      desc: "You may withdraw your consent for data processing at any time by deleting your account or contacting us.",
                    },
                    {
                      icon: <FaShieldAlt />,
                      title: "Right to Grievance Redressal",
                      desc: "You have the right to register a complaint regarding how your personal data is being processed.",
                    },
                  ].map((right, i) => (
                    <div key={i} className="pp-right-card">
                      <div className="pp-right-icon">{right.icon}</div>
                      <h4>{right.title}</h4>
                      <p>{right.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 7 */}
              <section id="retention" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaLock /></div>
                  <h2>7. Data Retention &amp; Security</h2>
                </div>
                <div className="terms-two-col">
                  <div className="terms-box">
                    <h4><FaDatabase /> Data Retention</h4>
                    <p>
                      We retain your personal data only as long as your account is active or as necessary to fulfill the purposes
                      outlined in this policy. Upon account deletion, your data is removed within a reasonable period.
                    </p>
                  </div>
                  <div className="terms-box">
                    <h4><FaLock /> Security Measures</h4>
                    <p>
                      We implement industry-standard technical and organizational security measures to protect your data against
                      unauthorized access, alteration, or disclosure. No internet transmission is 100% secure — users share data
                      at their own discretion.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8 */}
              <section id="children" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaChild /></div>
                  <h2>8. Children&apos;s Privacy</h2>
                </div>
                <div className="terms-alert amber">
                  <div className="terms-alert-title">
                    <FaChild /> Age Restriction Notice
                  </div>
                  <ul className="terms-list" style={{ marginTop: 8 }}>
                    <li className="terms-list-item">
                      <span className="terms-chip-dot" style={{ marginTop: 6, flexShrink: 0 }} />
                      <span>KhurjaDeals is intended for users aged <strong>13 years or older</strong>.</span>
                    </li>
                    <li className="terms-list-item">
                      <span className="terms-chip-dot" style={{ marginTop: 6, flexShrink: 0 }} />
                      <span>Users under 18 years of age should use the platform under parental or guardian guidance.</span>
                    </li>
                    <li className="terms-list-item">
                      <span className="terms-chip-dot" style={{ marginTop: 6, flexShrink: 0 }} />
                      <span>We do not knowingly collect personal data directly from children under 13.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section id="third-party" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaLink /></div>
                  <h2>9. Third-Party Links &amp; Services</h2>
                </div>
                <p className="terms-sec-lead">
                  Our platform may contain links to third-party websites or services. KhurjaDeals is{" "}
                  <strong style={{ color: "var(--text-white)" }}>not responsible</strong> for the privacy practices, content, or
                  policies of external sites. We encourage you to carefully read their privacy policies before sharing any
                  personal information on those platforms.
                </p>
              </section>

              {/* Section 10 */}
              <section id="changes" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaSyncAlt /></div>
                  <h2>10. Changes to This Privacy Policy</h2>
                </div>
                <p className="terms-sec-lead">
                  We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this
                  page with an updated <strong style={{ color: "var(--text-white)" }}>&ldquo;Effective Date.&rdquo;</strong>{" "}
                  Continued use of KhurjaDeals after modifications signifies your acceptance of the revised policy. We recommend
                  checking this page periodically.
                </p>
              </section>

              {/* Section 11 — Grievance */}
              <section id="grievance" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaEnvelope /></div>
                  <h2>11. Grievance Officer &amp; Contact Us</h2>
                </div>
                <p className="terms-sec-lead">
                  In accordance with the <strong style={{ color: "var(--text-white)" }}>Information Technology Act, 2000</strong> and
                  the <strong style={{ color: "var(--text-white)" }}>Digital Personal Data Protection Act, 2023</strong>, if you
                  have any questions, concerns, or grievances regarding your data privacy, please contact:
                </p>

                <div className="terms-contact-card" style={{ marginBottom: 20 }}>
                  <div className="terms-contact-row">
                    <div className="terms-contact-icon"><FaShieldAlt /></div>
                    <div>
                      <span className="terms-contact-label">Platform Name</span>
                      <span style={{ color: "var(--text-white)", fontWeight: 700, fontSize: "0.95rem" }}>KhurjaDeals</span>
                    </div>
                  </div>
                  <div className="terms-contact-row">
                    <div className="terms-contact-icon"><FaEnvelope /></div>
                    <div>
                      <span className="terms-contact-label">Email</span>
                      <a href={`mailto:${SITE_CONFIG.email}`} className="terms-link">{SITE_CONFIG.email}</a>
                    </div>
                  </div>
                  <div className="terms-contact-row">
                    <div className="terms-contact-icon"><FaPhoneAlt /></div>
                    <div>
                      <span className="terms-contact-label">Phone</span>
                      <a href={`tel:${SITE_CONFIG.phone}`} className="terms-link">{SITE_CONFIG.phone}</a>
                    </div>
                  </div>
                  <div className="terms-contact-row">
                    <div className="terms-contact-icon"><FaGlobe /></div>
                    <div>
                      <span className="terms-contact-label">Website</span>
                      <a href="https://khurjadeals.com/" className="terms-link">https://khurjadeals.com/</a>
                    </div>
                  </div>
                </div>

                <div className="terms-alert green">
                  <div className="terms-alert-title">
                    <FaCheckCircle /> Grievance Response Time
                  </div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#4ade80", lineHeight: 1 }}>24h</div>
                      <div style={{ fontSize: "0.8rem", marginTop: 4 }}>Acknowledgement of complaint</div>
                    </div>
                    <div style={{ width: 1, background: "rgba(74,222,128,0.2)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#4ade80", lineHeight: 1 }}>15 days</div>
                      <div style={{ fontSize: "0.8rem", marginTop: 4 }}>Target resolution time</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom CTA */}
              <div className="terms-footer-cta">
                <div className="terms-sec-icon" style={{ margin: "0 auto 16px" }}><FaShieldAlt /></div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-white)", marginBottom: 12 }}>
                  Your Privacy, Our Priority
                </h3>
                <p>
                  By using KhurjaDeals, you acknowledge that you have read and understood this Privacy Policy and agree to the
                  collection and use of your information as described herein.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
                  <Link href="/terms-and-conditions" className="btn btn-outline">
                    Terms &amp; Conditions
                  </Link>
                  <Link href="/submit-query" className="btn btn-primary">
                    Contact Support <FaChevronRight style={{ fontSize: "0.7rem" }} />
                  </Link>
                </div>
              </div>

            </div>{/* end terms-content */}
          </div>{/* end terms-layout */}
        </div>
      </section>
    </>
  );
}
