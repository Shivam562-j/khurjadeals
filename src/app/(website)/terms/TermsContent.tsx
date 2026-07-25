"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiShield,
  FiCheckCircle,
  FiAlertOctagon,
  FiAlertTriangle,
  FiInfo,
  FiMail,
  FiLock,
  FiHome,
  FiFileText,
  FiGlobe,
  FiEye,
  FiBookOpen,
} from "react-icons/fi";
import Container from "@/components/layout/Container";

const SECTIONS = [
  { id: "intermediary", label: "1. About & Intermediary Status", title: "1. About KhurjaDeals & Intermediary Status", icon: FiInfo },
  { id: "eligibility", label: "2. Eligibility", title: "2. Eligibility", icon: FiCheckCircle },
  { id: "accounts", label: "3. User Accounts & Security", title: "3. User Accounts & Security", icon: FiLock },
  { id: "listing-guidelines", label: "4. General Listing Guidelines", title: "4. General Listing Guidelines", icon: FiFileText },
  { id: "real-estate-second-hand", label: "5. Real Estate & Second-Hand Listings", title: "5. Real Estate & Second-Hand Listings", icon: FiHome },
  { id: "community-rules", label: "6. Community Section Rules", title: "6. Community Section Rules", icon: FiShield },
  { id: "no-payments-delivery", label: "7. No Payments & No Delivery Service", title: "7. No Payments & No Delivery Service", icon: FiAlertTriangle },
  { id: "prohibited-items", label: "8. Prohibited Items", title: "8. Prohibited Items", icon: FiAlertOctagon },
  { id: "fraud-safety", label: "9. Fraud Prevention & User Safety", title: "9. Fraud Prevention & User Safety", icon: FiShield },
  { id: "platform-changes", label: "10. Future-Ready Services & Changes", title: "10. Future-Ready Services & Platform Changes", icon: FiGlobe },
  { id: "intellectual-property", label: "11. Intellectual Property & Content", title: "11. Intellectual Property & Content License", icon: FiBookOpen },
  { id: "privacy-policy", label: "12. Privacy Policy Reference", title: "12. Privacy Policy Reference", icon: FiEye },
  { id: "limitation-of-liability", label: "13. Limitation of Liability", title: "13. Limitation of Liability", icon: FiAlertOctagon },
  { id: "indemnity", label: "14. Indemnity", title: "14. Indemnity", icon: FiShield },
  { id: "force-majeure", label: "15. Force Majeure", title: "15. Force Majeure", icon: FiGlobe },
  { id: "suspension-termination", label: "16. Account Suspension & Termination", title: "16. Account Suspension & Termination", icon: FiAlertTriangle },
  { id: "governing-law", label: "17. Governing Law & Jurisdiction", title: "17. Governing Law & Jurisdiction", icon: FiBookOpen },
  { id: "grievance-officer", label: "18. Grievance Officer & Contact Info", title: "18. Grievance Officer & Contact Information", icon: FiMail },
] as const;

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      SECTIONS.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // offset for sticky site header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)]">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-neutral-900 border-b border-neutral-850 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(232,89,12,0.08),transparent_50%)] pointer-events-none" />
        <Container className="relative z-10 text-center max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(232,89,12,0.1)] text-[var(--primary)] border border-[rgba(232,89,12,0.2)]">
            Legal Agreement
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Effective Date: <span className="text-white font-medium">July 23, 2026</span>
          </p>
        </Container>
      </div>

      {/* Main Grid Content */}
      <div className="py-16">
        <Container className="max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sticky Table of Contents Sidebar */}
            <div className="hidden lg:block lg:col-span-1 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-none space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 pl-3">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScrollTo(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 block border ${
                      activeSection === section.id
                        ? "bg-[rgba(232,89,12,0.06)] text-[var(--primary)] border-[rgba(232,89,12,0.15)] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                        : "text-neutral-500 border-transparent hover:text-[var(--primary)] hover:bg-[rgba(232,89,12,0.03)]"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content list */}
            <div className="col-span-1 lg:col-span-3 space-y-12">
              {/* Introduction Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 sm:p-8 bg-neutral-900/40 border border-neutral-850 rounded-3xl space-y-4"
              >
                <h3 className="text-lg font-bold text-white">Welcome to KhurjaDeals</h3>
                <p className="text-[var(--text-main)] text-sm leading-relaxed">
                  Welcome to KhurjaDeals (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). By accessing or using our website,{" "}
                  <a href="https://khurjadeals.com/" className="text-[var(--primary)] hover:underline font-semibold">
                    https://khurjadeals.com/
                  </a>
                  , you agree to be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not access or use the platform.
                </p>
              </motion.div>

              {/* Section 1 */}
              <motion.section
                id="intermediary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiInfo className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      1. About KhurjaDeals &amp; Intermediary Status
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      KhurjaDeals is an online local marketplace and community platform that connects buyers, sellers, landlords, tenants, and local residents. The platform allows users to:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        "Buy, sell, and rent real estate properties.",
                        "List and browse second-hand products (e.g., vehicles, electronics, furniture).",
                        "Participate in community discussions and local requests.",
                      ].map((item, i) => (
                        <li key={i} className="p-4 rounded-xl bg-[var(--bg-dark)] border border-[var(--border-color)] text-[var(--text-main)] text-xs flex flex-col justify-between">
                          <span className="text-[var(--primary)] text-sm mb-2 font-bold">✦</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-amber-200 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-amber-400">
                        <FiShield className="text-base shrink-0 text-amber-500" />
                        <span>Legal Status (Section 79, IT Act, 2000)</span>
                      </div>
                      <p className="leading-relaxed">
                        KhurjaDeals operates strictly as an <strong>&ldquo;Intermediary&rdquo;</strong> under Section 79 of the Information Technology Act, 2000. We only provide a platform for users to interact. We do not exercise editorial control over user-generated content, nor are we a broker, dealer, real estate agent, seller, buyer, or transporter.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 2 */}
              <motion.section
                id="eligibility"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiCheckCircle className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      2. Eligibility
                    </h2>
                    <ul className="space-y-3">
                      {[
                        "You must be at least 13 years of age to use or browse this website.",
                        "Users between 13 and 17 years of age must use the website under the supervision and guidance of a parent or legal guardian who agrees to these Terms.",
                        "By using this platform, you warrant that all information provided by you is accurate and truthful.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[var(--text-main)] text-sm">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] text-[var(--primary)] font-bold">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Section 3 */}
              <motion.section
                id="accounts"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiLock className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      3. User Accounts &amp; Security
                    </h2>
                    <ul className="space-y-3">
                      {[
                        "Users are responsible for maintaining the confidentiality of their account credentials.",
                        "You are entirely responsible for all activities that occur under your account.",
                        "KhurjaDeals reserves the right to suspend, disable, or terminate accounts that violate these Terms or engage in suspicious activity.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[var(--text-main)] text-sm">
                          <FiLock className="mt-1 text-[var(--primary)] shrink-0 text-sm" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Section 4 */}
              <motion.section
                id="listing-guidelines"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiFileText className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      4. General Listing Guidelines
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      All users posting listings agree that:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Information, images, and descriptions must be accurate, genuine, and not misleading.",
                        "You own the item/property or have explicit legal permission to list it.",
                        "Duplicate, fake, spam, or fraudulent listings will be deleted without prior notice.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-[var(--text-main)] text-sm">
                          <FiCheckCircle className="mt-1 text-emerald-500 shrink-0 text-sm" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Section 5 */}
              <motion.section
                id="real-estate-second-hand"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiHome className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      5. Real Estate &amp; Second-Hand Listings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] space-y-3">
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <FiHome className="text-base text-[var(--primary)]" />
                          <span>Real Estate Listings</span>
                        </div>
                        <p className="text-xs text-[var(--text-main)] leading-relaxed">
                          Property owners/agents must have legal rights to advertise. KhurjaDeals does not verify property documents, titles, or ownership.
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 font-bold text-white text-sm">
                            <FiFileText className="text-base text-[var(--primary)]" />
                            <span>Second-Hand Goods</span>
                          </div>
                          <p className="text-xs text-[var(--text-main)] leading-relaxed">
                            Buyers are solely responsible for physically inspecting products, verifying functionality, and checking original purchase receipts or ownership papers before making any payment.
                          </p>
                        </div>
                        <div className="mt-4 p-2.5 rounded-lg bg-neutral-850/50 border border-neutral-800 text-[10px] text-neutral-450 leading-normal">
                          KhurjaDeals provides no guarantee regarding product quality, durability, authenticity, or legal title.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 6 */}
              <motion.section
                id="community-rules"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiShield className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      6. Community Section Rules
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      The community section is provided for local engagement. Users must <strong>NOT</strong>:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Post abusive, hateful, defamatory, or obscene content.",
                        "Share false news, rumors, or illegal materials.",
                        "Harass, stalk, or threaten other community members.",
                        "Post unsolicited advertisements or spam.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-red-950/10 border border-red-900/20 text-red-200 text-xs">
                          <FiAlertOctagon className="mt-0.5 text-red-500 shrink-0 text-sm" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Section 7 */}
              <motion.section
                id="no-payments-delivery"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiAlertTriangle className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      7. No Payments &amp; No Delivery Service
                    </h2>
                    <div className="p-5 sm:p-6 rounded-2xl bg-orange-950/10 border border-orange-900/35 space-y-4">
                      <div className="flex items-center gap-2 font-bold text-orange-400 text-sm">
                        <FiAlertTriangle className="text-lg shrink-0 text-orange-500" />
                        <span>Direct Transactions &amp; No Logistics Policy</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-white text-xs">Direct Transactions Only</h4>
                          <p className="text-xs text-[var(--text-main)] leading-relaxed">
                            KhurjaDeals does <strong>NOT</strong> process payments or hold money in escrow. All monetary dealings happen directly between the buyer and seller.
                          </p>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-white text-xs">No Delivery / Logistics</h4>
                          <p className="text-xs text-[var(--text-main)] leading-relaxed">
                            We do not offer shipping, packing, courier, or delivery services. Transportation of goods is strictly the responsibility of the users involved.
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-orange-900/20 text-xs text-orange-300 italic leading-relaxed">
                        KhurjaDeals is not liable for failed payments, online scams, or financial losses incurred during user-to-user dealings.
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 8 */}
              <motion.section
                id="prohibited-items"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiAlertOctagon className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      8. Prohibited Items
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      Users are strictly prohibited from listing or exchanging:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        "Illegal goods, stolen property, or counterfeit items.",
                        "Narcotics, prescription drugs, or regulated substances.",
                        "Weapons, firearms, explosives, or hazardous material.",
                        "Adult content, pornography, or sexually explicit material.",
                        "Protected wildlife, animals, or animal parts.",
                        "Any item or service restricted under applicable Indian laws.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg-dark)] border border-[var(--border-color)] text-[var(--text-main)] text-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Section 9 */}
              <motion.section
                id="fraud-safety"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiShield className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      9. Fraud Prevention &amp; User Safety
                    </h2>
                    <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/10 border border-emerald-900/35 space-y-4">
                      <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                        <FiShield className="text-lg shrink-0 text-emerald-500" />
                        <span>Fraud Prevention &amp; Safety Guidelines</span>
                      </div>
                      <ul className="space-y-3.5">
                        {[
                          "Users should exercise extreme caution. Never send advance payments, booking amounts, or online transfers to unknown sellers without verifying the item/property in person.",
                          "Always meet in safe, public places during daylight hours for transactions.",
                          "Report any suspicious user or fraud attempt immediately to khurjadeals@gmail.com.",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-[var(--text-main)] text-xs">
                            <FiCheckCircle className="mt-0.5 text-emerald-500 shrink-0 text-sm" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 10 */}
              <motion.section
                id="platform-changes"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiGlobe className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      10. Future-Ready Services &amp; Platform Changes
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      KhurjaDeals reserves the right to introduce new features at any time, including but not limited to:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "User identity verification / badges.",
                        "Paid or premium listing promotions.",
                        "Third-party advertisements and banner ads.",
                        "Subscription plans for commercial sellers.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--bg-dark)] border border-[var(--border-color)] text-[var(--text-main)] text-xs">
                          <span className="text-[var(--primary)] font-semibold shrink-0">✦</span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-neutral-450 italic leading-relaxed pt-1">
                      Additional terms may apply when these features are launched.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 11 */}
              <motion.section
                id="intellectual-property"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiBookOpen className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      11. Intellectual Property &amp; Content License
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] space-y-2">
                        <h4 className="font-bold text-white text-sm">User Content</h4>
                        <p className="text-xs text-[var(--text-main)] leading-relaxed">
                          You retain ownership of the photos and text you upload. However, by uploading content, you grant KhurjaDeals a worldwide, royalty-free license to host, display, reproduce, and distribute your content for platform operation and promotional purposes.
                        </p>
                      </div>
                      <div className="p-5 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] space-y-2">
                        <h4 className="font-bold text-white text-sm">Platform Assets</h4>
                        <p className="text-xs text-[var(--text-main)] leading-relaxed">
                          The KhurjaDeals name, logo, design, graphics, and code are the intellectual property of KhurjaDeals and cannot be reproduced without permission.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 12 */}
              <motion.section
                id="privacy-policy"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiEye className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      12. Privacy Policy Reference
                    </h2>
                    <div className="p-5 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-white text-sm">
                          <FiEye className="text-base text-[var(--primary)]" />
                          <span>Privacy Policy Reference</span>
                        </div>
                        <p className="text-xs text-[var(--text-main)] max-w-xl leading-relaxed">
                          Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                        </p>
                      </div>
                      <Link
                        href="/privacy-policy"
                        className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors duration-200 rounded-xl whitespace-nowrap self-stretch sm:self-auto text-center justify-center shadow"
                      >
                        Read Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 13 */}
              <motion.section
                id="limitation-of-liability"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiAlertOctagon className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      13. Limitation of Liability
                    </h2>
                    <div className="space-y-4 p-5 rounded-2xl bg-red-950/5 border border-red-900/15">
                      <p className="text-sm text-[var(--text-main)] leading-relaxed">
                        To the maximum extent permitted by Indian law, KhurjaDeals, its owners, and operators shall <strong>NOT</strong> be liable for:
                      </p>
                      <ul className="space-y-2.5">
                        {[
                          "Any direct, indirect, incidental, or consequential damages.",
                          "Financial loss, fraud, or scams resulting from transactions between users.",
                          "Personal injury or property damage resulting from offline user meetings.",
                          "System downtime, loss of data, or technical glitches.",
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[var(--text-main)] text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Section 14 */}
              <motion.section
                id="indemnity"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiShield className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      14. Indemnity
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      You agree to indemnify, defend, and hold harmless KhurjaDeals and its administrators from any claims, liabilities, losses, damages, or legal fees arising out of your misuse of the platform, violation of these Terms, or infringement of any third-party rights.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 15 */}
              <motion.section
                id="force-majeure"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiGlobe className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      15. Force Majeure
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      KhurjaDeals shall not be held liable for failure or delay in performance caused by events beyond reasonable control, including acts of God, internet outages, cyberattacks, governmental actions, or natural disasters.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 16 */}
              <motion.section
                id="suspension-termination"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiAlertTriangle className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      16. Account Suspension &amp; Termination
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      We reserve the right to warn, temporarily suspend, or permanently terminate any user account or delete listings immediately if you violate these Terms, engage in fraud, or harm the safety/integrity of the KhurjaDeals community.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 17 */}
              <motion.section
                id="governing-law"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiBookOpen className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      17. Governing Law &amp; Jurisdiction
                    </h2>
                    <p className="text-sm text-[var(--text-main)] leading-relaxed">
                      These Terms shall be governed by and construed in accordance with the laws of India. Any legal proceedings or disputes arising out of or related to KhurjaDeals shall be subject to the exclusive jurisdiction of the competent courts located in Uttar Pradesh, India.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Section 18 */}
              <motion.section
                id="grievance-officer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="scroll-mt-24 p-6 sm:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl hover:border-[var(--border-hover)] transition-all duration-300 shadow-sm space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-neutral-850 text-[var(--primary)] border border-neutral-800 shrink-0">
                    <FiMail className="text-lg" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h2 className="text-xl font-bold text-white tracking-tight pt-1">
                      18. Grievance Officer &amp; Contact Information
                    </h2>
                    <div className="p-6 rounded-2xl bg-[var(--bg-dark)] border border-[var(--border-color)] space-y-5">
                      <p className="text-xs text-[var(--text-main)] leading-relaxed">
                        In accordance with the Information Technology Act, 2000 and rules made thereunder, the details of the Grievance Officer for KhurjaDeals are provided below:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[var(--bg-dark)] border border-[var(--border-color)] flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[rgba(232,89,12,0.1)] border border-[rgba(232,89,12,0.2)] text-[var(--primary)] flex items-center justify-center shrink-0">
                            <FiMail className="text-base" />
                          </div>
                          <div>
                            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Email</div>
                            <a href="mailto:khurjadeals@gmail.com" className="text-xs font-semibold text-white hover:text-[var(--primary)] transition-colors">
                              khurjadeals@gmail.com
                            </a>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--bg-dark)] border border-[var(--border-color)] flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-[rgba(232,89,12,0.1)] border border-[rgba(232,89,12,0.2)] text-[var(--primary)] flex items-center justify-center shrink-0">
                            <FiShield className="text-base" />
                          </div>
                          <div>
                            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Grievance Redressal</div>
                            <div className="text-xs font-semibold text-[var(--text-main)]">
                              Complaints acknowledged within 24h &bull; Addressed within 15 days
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
