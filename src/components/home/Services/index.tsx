import React from "react";
import Link from "next/link";
import { SERVICES } from "@/constants/services";

const steps = [
  { num: "01", title: "Browse Listings", desc: "Explore verified properties and products listed by local sellers in Khurja." },
  { num: "02", title: "Submit Your Query", desc: "Fill out a quick form. Our admin team reviews and calls you within 24 hours." },
  { num: "03", title: "Close the Deal", desc: "Discuss, verify, and finalize your deal directly with the seller. Zero commission." },
];

export default function Services() {
  return (
    <>
      {/* ── Services Cards ── */}
      <section className="section-light">
        <div className="container">
          <div className="sec-head center">
            <div className="eyebrow">⚡ What We Offer</div>
            <h2 className="h2">Our Services</h2>
            <p>Everything you need to buy, sell, or rent in Khurja — all in one trusted platform.</p>
          </div>

          <div className="cards">
            {SERVICES.map((srv) => (
              <div key={srv.id} className="card">
                <div className="card-ic">
                  <span style={{ fontSize: "1.5rem" }}>{srv.icon}</span>
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
                <Link href="/submit-query" className="linkarrow">
                  Get Started
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Steps ── */}
      <section className="section-alt">
        <div className="container">
          <div className="sec-head center">
            <div className="eyebrow">📋 Process</div>
            <h2 className="h2">How It Works</h2>
            <p>Getting started is easy. Three simple steps to your next deal.</p>
          </div>

          <div className="steps">
            {steps.map((step) => (
              <div key={step.num} className="step">
                <div className="num" />
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
