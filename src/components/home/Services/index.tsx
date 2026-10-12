import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaKey,
  FaBox,
  FaCommentAlt,
  FaBolt,
  FaArrowRight,
} from "react-icons/fa";
import { SERVICES } from "@/constants/services";

const iconMap: Record<string, React.ReactNode> = {
  "property-buy-sell": <FaHome />,
  "property-rent": <FaKey />,
  "products": <FaBox />,
  "consultation": <FaCommentAlt />,
};

export default function Services() {
  return (
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
  );
}

