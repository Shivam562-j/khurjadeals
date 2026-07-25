import React from "react";
import Link from "next/link";
import { FOOTER_LINKS } from "@/constants/navigation";
import { SITE_CONFIG } from "@/constants/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{
                background: "var(--primary)",
                color: "#ffffff",
                fontWeight: 950,
                fontSize: "1.1rem",
                padding: "6px 10px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}>
                KD
              </div>
              <span style={{
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}>
                Khurja<span style={{ color: "var(--primary)" }}>Deals</span>
              </span>
            </div>
            <p className="footer-about">{SITE_CONFIG.description}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{
                  padding: "8px 18px", fontSize: "0.82rem",
                  background: "rgba(37,211,102,0.1)",
                  border: "1px solid rgba(37,211,102,0.25)",
                  color: "#25D366", borderRadius: 8,
                }}
              >
                WhatsApp
              </a>
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="btn btn-outline"
                style={{ padding: "8px 18px", fontSize: "0.82rem" }}
              >
                Call Us
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4>Explore</h4>
            <ul>
              {FOOTER_LINKS.listings.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4>Company</h4>
            <ul>
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <ul className="contact">
              <li>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a>
              </li>
              <li>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {year} <strong style={{ color: "var(--text-main)" }}>{SITE_CONFIG.name}</strong>. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: "var(--text-muted)" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
