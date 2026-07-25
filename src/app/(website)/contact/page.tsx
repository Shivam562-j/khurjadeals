"use client";
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaUser, FaMobileAlt, FaCommentAlt, FaPaperPlane, FaCheckCircle, FaChevronRight } from "react-icons/fa";
import Link from "next/link";
import { SITE_CONFIG } from "@/constants/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message, type: "general" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setSubmitSuccess(true);
      setName(""); setPhone(""); setEmail(""); setMessage("");
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: <FaPhoneAlt />,
      title: "Call Support",
      desc: "Available daily between 9 AM to 8 PM.",
      link: `tel:${SITE_CONFIG.phone}`,
      linkText: SITE_CONFIG.phone,
    },
    {
      icon: <FaWhatsapp />,
      title: "WhatsApp Support",
      desc: "Click to open a chat for your listing query.",
      link: `https://wa.me/${SITE_CONFIG.whatsapp}`,
      linkText: "Start WhatsApp Chat",
      external: true,
    },
    {
      icon: <FaEnvelope />,
      title: "Email & Office",
      desc: SITE_CONFIG.address,
      link: `mailto:${SITE_CONFIG.email}`,
      linkText: SITE_CONFIG.email,
    },
  ];

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Get In Touch</span>
          <h1 className="h1">Contact KhurjaDeals</h1>
          <p className="lead">
            For support, property verification, or advertising — call us directly or send a message and we'll respond within 24 hours.
          </p>
        </div>
      </div>

      <section className="section-light">
        <div className="container">
          {/* Contact Info Cards Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            marginBottom: 60,
          }}>
            {contactCards.map((card) => (
              <div key={card.title} className="about-feat-card" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="about-feat-icon">{card.icon}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-white)", marginBottom: 4 }}>{card.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6, flex: 1 }}>{card.desc}</p>
                <a
                  href={card.link}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  className="linkarrow"
                >
                  {card.linkText} <FaChevronRight style={{ fontSize: "0.7rem" }} />
                </a>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="book-card">
            <div className="book-head">
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-white)" }}>Send Us a Message</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>
                  Our admin team reads every message and calls you back within 24 hours.
                </p>
              </div>
              <div className="save">
                <FaCheckCircle />
                <span>Admin Response Within 24h</span>
              </div>
            </div>

            <div className="book-body" style={{ padding: 40 }}>
              {submitSuccess ? (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "rgba(34,197,94,0.15)", border: "1.5px solid rgba(34,197,94,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px", fontSize: "1.75rem", color: "#22c55e",
                  }}>
                    <FaCheckCircle />
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-white)", marginBottom: 12 }}>
                    Message Sent Successfully!
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: 440, margin: "0 auto 28px" }}>
                    Thank you! Our Khurja support team will call you back on your provided phone number within 24 hours.
                  </p>
                  <button onClick={() => setSubmitSuccess(false)} className="btn btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {submitError && (
                    <div style={{
                      padding: "14px 16px", borderRadius: 12,
                      background: "rgba(239,68,68,0.1)", border: "1.5px solid rgba(239,68,68,0.3)",
                      color: "#f87171", fontSize: "0.85rem", fontWeight: 600,
                    }}>
                      {submitError}
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="book-field">
                      <label htmlFor="name"><FaUser /> Full Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="book-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="book-field">
                      <label htmlFor="phone"><FaMobileAlt /> Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        className="book-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="book-field">
                    <label htmlFor="email"><FaEnvelope /> Email Address (optional)</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      className="book-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="book-field">
                    <label htmlFor="message"><FaCommentAlt /> Message / Query</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      placeholder="How can we help you? Describe your property, product, or support issue..."
                      className="book-control"
                      style={{ height: "auto", paddingTop: 14, paddingBottom: 14, resize: "vertical" }}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="book-submit"
                  >
                    <FaPaperPlane />
                    <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                  </button>

                  <div className="book-note">
                    <FaCheckCircle />
                    <span>Admin response within 24 hours &bull; Zero commission &bull; 100% Free support</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2 className="h2">Ready to Post Your Listing?</h2>
            <p>Post your property or second-hand product for free. Our admin team verifies and activates your listing within 24 hours.</p>
            <div className="cta-actions">
              <Link className="btn btn-light btn-lg" href="/submit-query">
                Post Free Ad <FaChevronRight style={{ fontSize: "0.75rem" }} />
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
