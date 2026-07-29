import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaKey,
  FaBox,
  FaCommentAlt,
  FaBolt,
  FaClipboardList,
  FaArrowRight,
} from "react-icons/fa";
import { SERVICES } from "@/constants/services";

const steps = [
  { num: "01", title: "Browse Listings", desc: "Explore verified properties and products listed by local sellers in Khurja." },
  { num: "02", title: "Submit Your Query", desc: "Fill out a quick form. Our admin team reviews and calls you within 24 hours." },
  { num: "03", title: "Close the Deal", desc: "Discuss, verify, and finalize your deal directly with the seller. Zero commission." },
];

const iconMap: Record<string, React.ReactNode> = {
  "property-buy-sell": <FaHome />,
  "property-rent": <FaKey />,
  "products": <FaBox />,
  "consultation": <FaCommentAlt />,
};

export default function Services() {
  return (
    <>
      {/* ── Services Cards ── */}
      <section className="section-light">
        <div className="container">
          <div className="sec-head center">
            <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FaBolt style={{ fontSize: "0.85rem", color: "var(--primary)" }} /> What We Offer
            </div>
            <h2 className="h2">Our Services</h2>
            <p>Everything you need to buy, sell, or rent in Khurja — all in one trusted platform.</p>
          </div>

          <div className="cards">
            {SERVICES.map((srv) => (
              <div key={srv.id} className="card">
                <div className="card-ic" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="flex items-center justify-center text-[var(--primary)] text-xl">
                    {iconMap[srv.id]}
                  </span>
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.description}</p>
                <Link href="/submit-query" className="linkarrow" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span>Get Started</span>
                  <FaArrowRight style={{ fontSize: "0.75rem" }} />
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
            <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
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
    </>
  );
}
