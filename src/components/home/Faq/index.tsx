"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaChevronDown, FaArrowRight } from "react-icons/fa";
import { GENERAL_FAQS } from "@/constants/faq";

export default function HomeFaq() {
  const [openId, setOpenId] = useState<string | null>("gen-1");

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="section-light py-16 sm:py-20">
      <div className="container max-w-4xl space-y-10">
        {/* Section Header */}
        <div className="sec-head center max-w-xl mx-auto text-center space-y-3">
          <span className="eyebrow">General Platform Help</span>
          <h2 className="h2 text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-neutral-400">
            Got questions about KhurjaDeals? Here are answers to the top 5 questions regarding our platform.
          </p>
        </div>

        {/* 5 Homepage FAQs Accordion List with 20px vertical gap */}
        <div className="space-y-5 pt-2">
          {GENERAL_FAQS.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq-card-item ${isOpen ? "active-item" : ""}`}
              >
                {/* Single row header: Number, Question Title, Arrow Down */}
                <div
                  className="faq-question-header"
                  onClick={() => toggleAccordion(item.id)}
                >
                  <span className="faq-q-number">0{index + 1}</span>
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

        {/* View All FAQs Button */}
        <div className="flex items-center justify-center pt-2">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#1c1c1c] to-[#141414] border border-solid border-neutral-700 hover:border-[var(--primary)] text-white hover:text-[var(--primary)] font-bold text-sm transition-all shadow-md hover:shadow-2xl hover:-translate-y-0.5"
          >
            <span>View All 10 FAQs</span>
            <FaArrowRight className="text-xs text-[var(--primary)]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
