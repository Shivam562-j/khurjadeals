"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
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
          <h2 className="h2">Frequently Asked Questions</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Got questions about KhurjaDeals? Here are answers to the top questions regarding our platform.
          </p>
        </div>

        {/* FAQs Accordion List */}
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
      </div>
    </section>
  );
}
