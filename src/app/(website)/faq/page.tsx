"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronUp, FaChevronRight, FaPhoneAlt, FaQuestionCircle } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqList = [
    {
      q: "Is listing a property or product on KhurjaDeals completely free?",
      a: "Yes! Uploading residential properties, commercial shops, plots, or second-hand bazaar items on KhurjaDeals is <b>100% free</b> with zero listing fees or hidden charges."
    },
    {
      q: "How do buyers contact property owners or sellers?",
      a: "Each listing displays verified direct phone numbers and WhatsApp buttons. Buyers can directly call or message the owner without any middleman agent fees."
    },
    {
      q: "How long does it take for my ad to be verified and published?",
      a: "Our local Khurja admin team reviews every submission within <b>24 hours</b> to verify photos, details, and phone numbers before publishing it live."
    },
    {
      q: "Can I list Khurja pottery and ceramic products for wholesale or retail?",
      a: "Absolutely! We have a dedicated Pottery Bazaar category for Khurja ceramic factories, pottery artisans, and wholesale dealers to showcase their products."
    },
    {
      q: "Are property titles and legal documents verified by KhurjaDeals?",
      a: "KhurjaDeals operates strictly as an Intermediary under Section 79 of the IT Act. While we inspect listings to prevent spam, buyers must verify property titles and registry papers independently before making financial payments."
    },
    {
      q: "How can I edit or remove my listing once it is sold?",
      a: "Simply call or WhatsApp our support line at <b>" + SITE_CONFIG.phone + "</b> or email <b>" + SITE_CONFIG.email + "</b> with your listing details, and our admin team will update or mark it as SOLD immediately."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Got Questions?</span>
          <h1 className="h1">Frequently Asked Questions</h1>
          <p className="lead">Here is everything you need to know about our services, directory listings, and posting process in Khurja.</p>
        </div>
      </div>

      <section className="section-light">
        <div className="container max-w-4xl">
          <div className="space-y-4">
            {faqList.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`card transition-all cursor-pointer ${
                    isOpen ? "border-[var(--primary)] bg-[#1c1c1c]" : ""
                  }`}
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 font-bold text-white text-base sm:text-lg">
                      <FaQuestionCircle className="text-[var(--primary)] shrink-0" />
                      <span>{item.q}</span>
                    </div>
                    <div className="text-[var(--primary)] shrink-0 text-sm">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>

                  {isOpen && (
                    <div
                      className="mt-4 pt-4 border-t border-[var(--border-color)] text-sm text-[var(--text-muted)] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.a }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA section banner */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="h2">Have More Questions?</h2>
            <p>Our local Khurja support team is available 24/7. Call us directly or post your ad inquiry online.</p>
            <div className="cta-actions">
              <Link className="btn btn-light btn-lg" href="/submit-query">
                Submit Inquiry
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
