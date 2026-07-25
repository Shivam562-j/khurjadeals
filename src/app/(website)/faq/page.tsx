"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaChevronRight, FaPhoneAlt } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";
import { ALL_FAQS } from "@/constants/faq";

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("gen-1");

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Got Questions?</span>
          <h1 className="h1">Frequently Asked Questions</h1>
          <p className="lead">
            Everything you need to know about buying, selling, renting properties, and platform safety on KhurjaDeals.
          </p>
        </div>
      </div>

      <section className="section-light py-12 sm:py-16">
        <div className="container max-w-4xl">
          {/* Continuous List of All 10 FAQs with 20px gap between cards */}
          <div className="space-y-5">
            {ALL_FAQS.map((item, index) => {
              const isOpen = openId === item.id;
              const formattedNum = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
              return (
                <div
                  key={item.id}
                  className={`faq-card-item ${isOpen ? "active-item" : ""}`}
                >
                  {/* Single row header containing: Number, Question, and Arrow Down icon */}
                  <div
                    className="faq-question-header"
                    onClick={() => toggleAccordion(item.id)}
                  >
                    <span className="faq-q-number">{formattedNum}</span>
                    <h3 className="faq-q-title">{item.question}</h3>
                    <div className="faq-toggle-icon">
                      <FaChevronDown />
                    </div>
                  </div>

                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{item.answer}</p>
                      {item.bullets && item.bullets.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {item.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="faq-bullet-item">
                              <span className="faq-bullet-dot" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
            <p>
              Our local Khurja support team is available 24/7. Call us directly or post your ad inquiry online.
            </p>
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
