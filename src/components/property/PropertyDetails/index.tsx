"use client";
import React, { useState } from "react";
import { Property } from "@/types/property";
import { formatPrice } from "@/utils/formatter";
import { whatsappLink } from "@/utils/helper";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTag,
  FaCheckCircle,
  FaUser,
  FaMobileAlt,
  FaEnvelope,
  FaCommentAlt,
  FaPaperPlane,
  FaShieldAlt,
} from "react-icons/fa";

interface PropertyDetailsProps {
  property: Property;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const {
    _id,
    title,
    description,
    type,
    listingType,
    price,
    area,
    areaUnit,
    location,
    address,
    features,
    contactName,
    contactPhone,
  } = property;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Hi ${contactName}, I am interested in your property "${title}" listed on KhurjaDeals. Please contact me.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess(false);
    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, message, type: "property", referenceId: _id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit inquiry");
      setSubmitSuccess(true);
      setName(""); setPhone(""); setEmail("");
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waMsg = `Hello, I'm interested in the property "${title}" listed on KhurjaDeals (Price: ${formatPrice(price)}). Can we discuss?`;
  const waUrl = whatsappLink(contactPhone, waMsg);

  const specs = [
    { label: "Type", value: type, icon: <FaTag /> },
    { label: "Area", value: `${area} ${areaUnit}`, icon: <FaRulerCombined /> },
    { label: "Location", value: location, icon: <FaMapMarkerAlt /> },
  ];

  return (
    <div className="det-layout">
      {/* ── Left Column: Info ── */}
      <div className="det-main">
        {/* Title Card */}
        <div className="det-card">
          <div className="det-badge">
            For {listingType}
          </div>
          <div className="det-title-row">
            <div>
              <h1 className="det-title">{title}</h1>
              <p className="det-location">
                <FaMapMarkerAlt /> {location}
              </p>
            </div>
            <div className="det-price-box">
              <span className="det-price-label">Asking Price</span>
              <span className="det-price">{formatPrice(price)}</span>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="det-specs">
            {specs.map((s) => (
              <div key={s.label} className="det-spec">
                <div className="det-spec-icon">{s.icon}</div>
                <span className="det-spec-label">{s.label}</span>
                <span className="det-spec-val">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="det-card">
          <h3 className="det-section-title">Description</h3>
          <p className="det-desc">{description}</p>
          {address && (
            <p className="det-address">
              <FaMapMarkerAlt style={{ color: "var(--primary)", flexShrink: 0 }} />
              {address}
            </p>
          )}
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="det-card">
            <h3 className="det-section-title">Features &amp; Amenities</h3>
            <div className="det-features">
              {features.map((feat, idx) => (
                <div key={idx} className="det-feature-chip">
                  <FaCheckCircle style={{ color: "var(--primary)", fontSize: "0.7rem", flexShrink: 0 }} />
                  {feat}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right Column: Contact + Form ── */}
      <div className="det-sidebar">
        {/* Contact Card */}
        <div className="det-card">
          <h3 className="det-section-title">Contact Owner / Agent</h3>

          {/* Owner Avatar */}
          <div className="det-owner-row">
            <div className="det-avatar">
              {contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="det-owner-name">{contactName}</div>
              <div className="det-owner-role">
                <FaShieldAlt style={{ color: "var(--primary)", fontSize: "0.7rem" }} />
                Verified Owner / Agent
              </div>
            </div>
          </div>

          {/* Call & WhatsApp Buttons */}
          <div className="det-cta-btns">
            <a href={`tel:${contactPhone}`} className="det-btn-call">
              <FaPhoneAlt /> Call Owner
            </a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="det-btn-wa">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>

          <p className="det-contact-note">
            <FaShieldAlt style={{ color: "#22c55e", flexShrink: 0 }} />
            Admin verified listing — contact directly
          </p>
        </div>

        {/* Inquiry Form */}
        <div className="det-card">
          <h3 className="det-section-title">Send Inquiry</h3>

          {submitSuccess ? (
            <div className="det-success">
              <div className="det-success-icon"><FaCheckCircle /></div>
              <p>Inquiry submitted! We&apos;ll contact you within 24 hours.</p>
              <button onClick={() => setSubmitSuccess(false)} className="btn btn-outline" style={{ marginTop: 12 }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {submitError && (
                <div className="det-error">{submitError}</div>
              )}

              <div className="book-field">
                <label htmlFor="prop-name"><FaUser /> Full Name</label>
                <input id="prop-name" type="text" required placeholder="e.g. Ramesh Kumar"
                  className="book-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="book-field">
                <label htmlFor="prop-phone"><FaMobileAlt /> Phone Number</label>
                <input id="prop-phone" type="tel" required placeholder="10-digit mobile"
                  className="book-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="book-field">
                <label htmlFor="prop-email"><FaEnvelope /> Email (optional)</label>
                <input id="prop-email" type="email" placeholder="email@example.com"
                  className="book-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="book-field">
                <label htmlFor="prop-msg"><FaCommentAlt /> Message</label>
                <textarea id="prop-msg" rows={3} required
                  className="book-control" style={{ height: "auto", paddingTop: 12, paddingBottom: 12, resize: "vertical" }}
                  value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>

              <button type="submit" disabled={isSubmitting} className="book-submit">
                <FaPaperPlane />
                <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
              </button>

              <div className="book-note">
                <FaCheckCircle />
                <span>Admin responds within 24 hours &bull; Free service</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
