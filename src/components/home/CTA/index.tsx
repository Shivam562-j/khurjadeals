import React from "react";
import Link from "next/link";
import { FaClipboardList, FaPlus, FaWhatsapp } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-inner">
          <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FaClipboardList style={{ fontSize: "0.85rem", color: "var(--primary)" }} /> List With Us
          </div>
          <h2 className="h2">
            Have a Property or{" "}
            <span className="accent">Product to Sell?</span>
          </h2>
          <p className="lead">
            Post your listing for free and reach thousands of buyers in Khurja.
            Our admin team verifies and activates your listing within 24 hours.
          </p>

          <div className="cta-actions">
            <Link href="/submit-query" className="btn btn-primary btn-lg">
              <FaPlus className="text-sm shrink-0" />
              Post Your Ad — It&apos;s Free
            </Link>
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-lg"
            >
              <FaWhatsapp className="text-lg shrink-0" />
              Chat on WhatsApp
            </a>
          </div>

          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 20 }}>
            ✓ Free listing &nbsp;·&nbsp; ✓ Admin verified &nbsp;·&nbsp; ✓ No commission
          </p>
        </div>
      </div>
    </section>
  );
}
