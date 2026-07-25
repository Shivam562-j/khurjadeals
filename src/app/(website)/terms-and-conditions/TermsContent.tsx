"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaEnvelope,
  FaLock,
  FaHome,
  FaFileAlt,
  FaGlobe,
  FaEye,
  FaBook,
  FaChevronRight,
  FaPhoneAlt,
} from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

const SECTIONS = [
  { id: "intermediary", label: "1. About & Intermediary Status", icon: FaInfoCircle },
  { id: "eligibility", label: "2. Eligibility", icon: FaCheckCircle },
  { id: "accounts", label: "3. User Accounts & Security", icon: FaLock },
  { id: "listing-guidelines", label: "4. General Listing Guidelines", icon: FaFileAlt },
  { id: "real-estate-second-hand", label: "5. Real Estate & Second-Hand Listings", icon: FaHome },
  { id: "community-rules", label: "6. Community Section Rules", icon: FaShieldAlt },
  { id: "no-payments-delivery", label: "7. No Payments & No Delivery", icon: FaExclamationTriangle },
  { id: "prohibited-items", label: "8. Prohibited Items", icon: FaExclamationCircle },
  { id: "fraud-safety", label: "9. Fraud Prevention & Safety", icon: FaShieldAlt },
  { id: "platform-changes", label: "10. Future Services & Changes", icon: FaGlobe },
  { id: "intellectual-property", label: "11. Intellectual Property", icon: FaBook },
  { id: "privacy-policy", label: "12. Privacy Policy Reference", icon: FaEye },
  { id: "limitation-of-liability", label: "13. Limitation of Liability", icon: FaExclamationCircle },
  { id: "indemnity", label: "14. Indemnity", icon: FaShieldAlt },
  { id: "force-majeure", label: "15. Force Majeure", icon: FaGlobe },
  { id: "suspension-termination", label: "16. Account Suspension & Termination", icon: FaExclamationTriangle },
  { id: "governing-law", label: "17. Governing Law & Jurisdiction", icon: FaBook },
  { id: "grievance-officer", label: "18. Grievance Officer & Contact", icon: FaEnvelope },
] as const;

export default function TermsContent() {
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
          <span className="eyebrow">Legal Agreement</span>
          <h1 className="h1">Terms &amp; Conditions</h1>
          <p className="lead">
            Effective Date:{" "}
            <span style={{ color: "var(--text-white)", fontWeight: 600 }}>July 23, 2026</span>
            &nbsp;&middot;&nbsp; KhurjaDeals Platform Rules
          </p>
        </div>
      </div>

      <section className="section-light">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="terms-layout">

            {/* ── Sticky Sidebar TOC ── */}
            <aside className="terms-sidebar">
              <p className="terms-toc-label">Table of Contents</p>
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

              {/* Intro Card */}
              <div className="terms-intro-card">
                <h3>Welcome to KhurjaDeals</h3>
                <p>
                  Welcome to KhurjaDeals (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By
                  accessing or using our website,{" "}
                  <a href="https://khurjadeals.com/" className="terms-link">
                    https://khurjadeals.com/
                  </a>
                  , you agree to be bound by these Terms and Conditions. If you do not agree, please do
                  not access or use the platform.
                </p>
              </div>

              {/* Section 1 */}
              <section id="intermediary" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaInfoCircle /></div>
                  <h2>1. About KhurjaDeals &amp; Intermediary Status</h2>
                </div>
                <p className="terms-sec-lead">KhurjaDeals is a local marketplace that allows users to:</p>
                <div className="terms-chip-grid">
                  {["Buy, sell, and rent real estate properties.", "List and browse second-hand products (vehicles, electronics, furniture).", "Participate in community discussions and local requests."].map((item, i) => (
                    <div key={i} className="terms-chip">
                      <span className="terms-chip-dot" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="terms-alert amber">
                  <div className="terms-alert-title">
                    <FaShieldAlt /> Legal Status — Section 79, IT Act, 2000
                  </div>
                  <p>
                    KhurjaDeals operates strictly as an <strong>&ldquo;Intermediary&rdquo;</strong> under Section 79 of the
                    Information Technology Act, 2000. We provide a platform for users to interact. We are
                    not a broker, dealer, real estate agent, seller, buyer, or transporter.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="eligibility" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaCheckCircle /></div>
                  <h2>2. Eligibility</h2>
                </div>
                <ul className="terms-list">
                  {["You must be at least 13 years of age to use or browse this website.", "Users between 13 and 17 years of age must use the platform under the supervision of a parent or legal guardian who agrees to these Terms.", "By using this platform, you warrant that all information provided by you is accurate and truthful."].map((item, i) => (
                    <li key={i} className="terms-list-item">
                      <span className="terms-list-num">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 3 */}
              <section id="accounts" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaLock /></div>
                  <h2>3. User Accounts &amp; Security</h2>
                </div>
                <ul className="terms-list">
                  {["Users are responsible for maintaining the confidentiality of their account credentials.", "You are entirely responsible for all activities that occur under your account.", "KhurjaDeals reserves the right to suspend, disable, or terminate accounts that violate these Terms or engage in suspicious activity."].map((item, i) => (
                    <li key={i} className="terms-list-item">
                      <FaLock className="terms-list-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 4 */}
              <section id="listing-guidelines" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaFileAlt /></div>
                  <h2>4. General Listing Guidelines</h2>
                </div>
                <p className="terms-sec-lead">All users posting listings agree that:</p>
                <ul className="terms-list">
                  {["Information, images, and descriptions must be accurate, genuine, and not misleading.", "You own the item/property or have explicit legal permission to list it.", "Duplicate, fake, spam, or fraudulent listings will be deleted without prior notice."].map((item, i) => (
                    <li key={i} className="terms-list-item">
                      <FaCheckCircle className="terms-list-icon green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Section 5 */}
              <section id="real-estate-second-hand" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaHome /></div>
                  <h2>5. Real Estate &amp; Second-Hand Listings</h2>
                </div>
                <div className="terms-two-col">
                  <div className="terms-box">
                    <h4><FaHome /> Real Estate Listings</h4>
                    <p>Property owners/agents must have legal rights to advertise. KhurjaDeals does not verify property documents, titles, or ownership.</p>
                  </div>
                  <div className="terms-box">
                    <h4><FaFileAlt /> Second-Hand Goods</h4>
                    <p>Buyers are solely responsible for physically inspecting products and verifying ownership papers before making payment. KhurjaDeals provides no guarantee regarding product quality or authenticity.</p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="community-rules" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaShieldAlt /></div>
                  <h2>6. Community Section Rules</h2>
                </div>
                <p className="terms-sec-lead">Users must <strong>NOT</strong>:</p>
                <div className="terms-chip-grid red">
                  {["Post abusive, hateful, defamatory, or obscene content.", "Share false news, rumors, or illegal materials.", "Harass, stalk, or threaten other community members.", "Post unsolicited advertisements or spam."].map((item, i) => (
                    <div key={i} className="terms-chip red">
                      <FaExclamationCircle className="terms-chip-icon" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 7 */}
              <section id="no-payments-delivery" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaExclamationTriangle /></div>
                  <h2>7. No Payments &amp; No Delivery Service</h2>
                </div>
                <div className="terms-alert orange">
                  <div className="terms-alert-title">
                    <FaExclamationTriangle /> Direct Transactions &amp; No Logistics Policy
                  </div>
                  <div className="terms-two-col" style={{ marginTop: 16 }}>
                    <div>
                      <h4 style={{ color: "var(--text-white)", marginBottom: 6, fontSize: "0.9rem" }}>Direct Transactions Only</h4>
                      <p>KhurjaDeals does <strong>NOT</strong> process payments or hold money in escrow. All monetary dealings happen directly between buyer and seller.</p>
                    </div>
                    <div>
                      <h4 style={{ color: "var(--text-white)", marginBottom: 6, fontSize: "0.9rem" }}>No Delivery / Logistics</h4>
                      <p>We do not offer shipping, courier, or delivery services. Transportation is strictly the responsibility of the users involved.</p>
                    </div>
                  </div>
                  <p style={{ marginTop: 16, fontSize: "0.8rem", fontStyle: "italic", color: "rgba(251,191,36,0.7)" }}>
                    KhurjaDeals is not liable for failed payments, online scams, or financial losses during user-to-user dealings.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="prohibited-items" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaExclamationCircle /></div>
                  <h2>8. Prohibited Items</h2>
                </div>
                <p className="terms-sec-lead">Users are strictly prohibited from listing or exchanging:</p>
                <div className="terms-chip-grid">
                  {["Illegal goods, stolen property, or counterfeit items.", "Narcotics, prescription drugs, or regulated substances.", "Weapons, firearms, explosives, or hazardous material.", "Adult content, pornography, or sexually explicit material.", "Protected wildlife, animals, or animal parts.", "Any item or service restricted under applicable Indian laws."].map((item, i) => (
                    <div key={i} className="terms-chip">
                      <span className="terms-chip-pulse" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 9 */}
              <section id="fraud-safety" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaShieldAlt /></div>
                  <h2>9. Fraud Prevention &amp; User Safety</h2>
                </div>
                <div className="terms-alert green">
                  <div className="terms-alert-title">
                    <FaShieldAlt /> Safety Guidelines
                  </div>
                  <ul className="terms-list" style={{ marginTop: 12 }}>
                    {["Never send advance payments or online transfers to unknown sellers without verifying the item/property in person.", "Always meet in safe, public places during daylight hours for transactions.", "Report any suspicious user or fraud attempt immediately to " + SITE_CONFIG.email].map((item, i) => (
                      <li key={i} className="terms-list-item">
                        <FaCheckCircle className="terms-list-icon green" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 10 */}
              <section id="platform-changes" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaGlobe /></div>
                  <h2>10. Future-Ready Services &amp; Platform Changes</h2>
                </div>
                <p className="terms-sec-lead">KhurjaDeals reserves the right to introduce new features, including but not limited to:</p>
                <div className="terms-chip-grid">
                  {["User identity verification / badges.", "Paid or premium listing promotions.", "Third-party advertisements and banner ads.", "Subscription plans for commercial sellers."].map((item, i) => (
                    <div key={i} className="terms-chip">
                      <span style={{ color: "var(--primary)", fontWeight: 700, marginRight: 8 }}>✦</span>
                      {item}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", marginTop: 12 }}>
                  Additional terms may apply when these features are launched.
                </p>
              </section>

              {/* Section 11 */}
              <section id="intellectual-property" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaBook /></div>
                  <h2>11. Intellectual Property &amp; Content License</h2>
                </div>
                <div className="terms-two-col">
                  <div className="terms-box">
                    <h4>User Content</h4>
                    <p>You retain ownership of photos and text you upload. By uploading, you grant KhurjaDeals a worldwide, royalty-free license to host, display, reproduce, and distribute your content for platform operations and promotional purposes.</p>
                  </div>
                  <div className="terms-box">
                    <h4>Platform Assets</h4>
                    <p>The KhurjaDeals name, logo, design, graphics, and code are intellectual property of KhurjaDeals and cannot be reproduced without permission.</p>
                  </div>
                </div>
              </section>

              {/* Section 12 */}
              <section id="privacy-policy" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaEye /></div>
                  <h2>12. Privacy Policy Reference</h2>
                </div>
                <div className="terms-box" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <h4><FaEye /> Privacy Policy Reference</h4>
                    <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.</p>
                  </div>
                  <Link href="/privacy-policy" className="btn btn-primary">
                    Read Privacy Policy <FaChevronRight style={{ fontSize: "0.7rem" }} />
                  </Link>
                </div>
              </section>

              {/* Section 13 */}
              <section id="limitation-of-liability" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaExclamationCircle /></div>
                  <h2>13. Limitation of Liability</h2>
                </div>
                <div className="terms-alert red">
                  <p style={{ marginBottom: 12 }}>To the maximum extent permitted by Indian law, KhurjaDeals shall <strong>NOT</strong> be liable for:</p>
                  <ul className="terms-list">
                    {["Any direct, indirect, incidental, or consequential damages.", "Financial loss, fraud, or scams resulting from transactions between users.", "Personal injury or property damage resulting from offline user meetings.", "System downtime, loss of data, or technical glitches."].map((item, i) => (
                      <li key={i} className="terms-list-item">
                        <span className="terms-chip-pulse red" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 14 */}
              <section id="indemnity" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaShieldAlt /></div>
                  <h2>14. Indemnity</h2>
                </div>
                <p className="terms-sec-lead">
                  You agree to indemnify, defend, and hold harmless KhurjaDeals and its administrators from any claims, liabilities, losses, damages, or legal fees arising out of your misuse of the platform, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              {/* Section 15 */}
              <section id="force-majeure" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaGlobe /></div>
                  <h2>15. Force Majeure</h2>
                </div>
                <p className="terms-sec-lead">
                  KhurjaDeals shall not be held liable for failure or delay in performance caused by events beyond reasonable control, including acts of God, internet outages, cyberattacks, governmental actions, or natural disasters.
                </p>
              </section>

              {/* Section 16 */}
              <section id="suspension-termination" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaExclamationTriangle /></div>
                  <h2>16. Account Suspension &amp; Termination</h2>
                </div>
                <p className="terms-sec-lead">
                  We reserve the right to warn, temporarily suspend, or permanently terminate any user account or delete listings immediately if you violate these Terms, engage in fraud, or harm the safety or integrity of the KhurjaDeals community.
                </p>
              </section>

              {/* Section 17 */}
              <section id="governing-law" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaBook /></div>
                  <h2>17. Governing Law &amp; Jurisdiction</h2>
                </div>
                <p className="terms-sec-lead">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any legal proceedings arising out of or related to KhurjaDeals shall be subject to the exclusive jurisdiction of the competent courts located in Uttar Pradesh, India.
                </p>
              </section>

              {/* Section 18 */}
              <section id="grievance-officer" className="terms-section scroll-mt-24">
                <div className="terms-sec-head">
                  <div className="terms-sec-icon"><FaEnvelope /></div>
                  <h2>18. Grievance Officer &amp; Contact Information</h2>
                </div>
                <p className="terms-sec-lead">
                  In accordance with the Information Technology Act, 2000, and rules thereunder, the name and contact details of the Grievance Officer are provided below:
                </p>
                <div className="terms-contact-card">
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
                    <div className="terms-contact-icon"><FaHome /></div>
                    <div>
                      <span className="terms-contact-label">Address</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{SITE_CONFIG.address}</span>
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  We will acknowledge your grievance within <strong style={{ color: "var(--text-white)" }}>48 hours</strong> and endeavour to resolve it within <strong style={{ color: "var(--text-white)" }}>30 days</strong>.
                </p>
              </section>

              {/* Bottom CTA */}
              <div className="terms-footer-cta">
                <p>By using KhurjaDeals, you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions.</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
                  <Link href="/privacy-policy" className="btn btn-outline">
                    Privacy Policy
                  </Link>
                  <Link href="/submit-query" className="btn btn-primary">
                    Post a Free Ad <FaChevronRight style={{ fontSize: "0.7rem" }} />
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
