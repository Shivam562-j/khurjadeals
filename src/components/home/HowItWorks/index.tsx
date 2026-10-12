import React from "react";
import { FaClipboardList } from "react-icons/fa";

const steps = [
  {
    num: "01",
    title: "Browse Listings",
    desc: "Explore verified properties and products listed by local sellers in Khurja.",
  },
  {
    num: "02",
    title: "Submit Your Query",
    desc: "Fill out a quick form. Our admin team reviews and calls you within 24 hours.",
  },
  {
    num: "03",
    title: "Close the Deal",
    desc: "Discuss, verify, and finalize your deal directly with the seller. Zero commission.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-alt">
      <div className="container">
        <div className="sec-head center">
          <div
            className="eyebrow"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FaClipboardList style={{ fontSize: "0.85rem", color: "var(--primary)" }} /> Process
          </div>
          <h2 className="h2">How It Works</h2>
          <p>Getting started is easy. Three simple steps to your next deal.</p>
        </div>

        <div className="steps">
          {steps.map((step) => (
            <div key={step.num} className="step">
              <div className="num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
