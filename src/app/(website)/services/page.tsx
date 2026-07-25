import React from "react";
import Link from "next/link";
import { FaHome, FaKey, FaBox, FaStore, FaComments, FaCheckCircle, FaChevronRight, FaPhoneAlt, FaArrowRight } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function ServicesPage() {
  const services = [
    {
      icon: <FaHome />,
      title: "Property Buy & Sell",
      desc: "Buy or sell residential houses, commercial shops, agricultural land, and industrial plots in Khurja. Direct owner contacts, zero commission, and verified property details."
    },
    {
      icon: <FaKey />,
      title: "Property Rental Marketplace",
      desc: "Find rental flats, commercial shops, godowns, and office spaces at the best monthly rates in Khurja city and GT Road areas."
    },
    {
      icon: <FaBox />,
      title: "Second-Hand Products Bazaar",
      desc: "Discover quality pre-owned goods including used motorcycles, smartphones, laptops, electronics, home furniture, and appliances."
    },
    {
      icon: <FaStore />,
      title: "Khurja Pottery Ceramics Showcase",
      desc: "Direct access to Khurja's world-famous pottery factories and ceramic artisans. Order decorative flower pots, dinner sets, and ceramic handicrafts."
    },
    {
      icon: <FaComments />,
      title: "Free Deal Consultation",
      desc: "Get expert advice from our Khurja admin team on property valuations, market trends, and document verification procedures."
    },
    {
      icon: <FaCheckCircle />,
      title: "Verified Admin Verification",
      desc: "Every listing uploaded on KhurjaDeals undergoes manual verification by our local team to ensure zero fraud and clean listings."
    }
  ];

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">What We Do</span>
          <h1 className="h1">Every Local Deal, Covered</h1>
          <p className="lead">From real estate plots to pottery and second-hand items — we provide the right platform for every transaction in Khurja.</p>
        </div>
      </div>

      <section className="section-light">
        <div className="container">
          <div className="cards">
            {services.map((srv, idx) => (
              <article className="card" key={idx}>
                <div className="card-ic">
                  {srv.icon}
                </div>
                <h3>{srv.title}</h3>
                <p>{srv.desc}</p>
                <Link className="linkarrow" href="/submit-query">
                  Post Inquiries
                  <FaArrowRight className="text-xs" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section banner */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="h2">Have Something to Sell or Rent?</h2>
            <p>Post your property or product ad on KhurjaDeals today. Reach thousands of buyers across Khurja &amp; Bulandshahr for free.</p>
            <div className="cta-actions">
              <Link className="btn btn-light btn-lg" href="/submit-query">
                Post Free Ad
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
