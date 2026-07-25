"use client";
import React, { useState } from "react";
import { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatter";
import { whatsappLink } from "@/utils/helper";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaTag,
  FaCheckCircle,
  FaUser,
  FaMobileAlt,
  FaEnvelope,
  FaCommentAlt,
  FaPaperPlane,
  FaShieldAlt,
  FaBoxOpen,
} from "react-icons/fa";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const {
    _id,
    title,
    description,
    category,
    condition,
    price,
    images,
    location,
    contactName,
    contactPhone,
  } = product;

  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Hi ${contactName}, I am interested in purchasing "${title}" listed on KhurjaDeals. Please contact me.`
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
        body: JSON.stringify({ name, phone, email, message, type: "product", referenceId: _id }),
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

  const [pageUrl, setPageUrl] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
  }, []);

  const displayImages =
    images && images.length > 0
      ? images
      : ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80"];

  const currentLink = pageUrl || (typeof window !== "undefined" ? window.location.href : "");
  const linkText = currentLink ? `\nLink: ${currentLink}` : "";
  const waMsg = `Hello, I'm interested in the product "${title}" listed on KhurjaDeals (Price: ${formatPrice(price)}).${linkText}\n\nIs it still available?`;
  const waUrl = whatsappLink(contactPhone, waMsg);

  return (
    <div className="det-layout">
      {/* ── Left Column: Gallery + Info ── */}
      <div className="det-main">
        {/* Gallery */}
        <div className="det-card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="det-gallery-main">
            <img
              src={displayImages[activeImgIdx]}
              alt={`Product photo ${activeImgIdx + 1}`}
              className="det-gallery-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>
          {displayImages.length > 1 && (
            <div className="det-gallery-thumbs">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`det-thumb${idx === activeImgIdx ? " active" : ""}`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="det-thumb-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Specs */}
        <div className="det-card">
          <div className="det-badge">{condition} Condition</div>
          <div className="det-title-row">
            <div>
              <h1 className="det-title">{title}</h1>
              <p className="det-location">
                <FaMapMarkerAlt /> {location}
              </p>
            </div>
            <div className="det-price-box">
              <span className="det-price-label">Price</span>
              <span className="det-price">{formatPrice(price)}</span>
            </div>
          </div>

          <div className="det-specs">
            <div className="det-spec">
              <div className="det-spec-icon"><FaTag /></div>
              <span className="det-spec-label">Category</span>
              <span className="det-spec-val">{category}</span>
            </div>
            <div className="det-spec">
              <div className="det-spec-icon"><FaBoxOpen /></div>
              <span className="det-spec-label">Condition</span>
              <span className="det-spec-val capitalize">{condition}</span>
            </div>
            <div className="det-spec">
              <div className="det-spec-icon"><FaMapMarkerAlt /></div>
              <span className="det-spec-label">Location</span>
              <span className="det-spec-val">{location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="det-card">
          <h3 className="det-section-title">Description</h3>
          <p className="det-desc">{description}</p>
        </div>
      </div>

      {/* ── Right Column: Contact + Form ── */}
      <div className="det-sidebar">
        {/* Contact Card */}
        <div className="det-card">
          <h3 className="det-section-title">Contact Seller</h3>

          <div className="det-owner-row">
            <div className="det-avatar">
              {contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="det-owner-name">{contactName}</div>
              <div className="det-owner-role">
                <FaShieldAlt style={{ color: "var(--primary)", fontSize: "0.7rem" }} />
                Verified Seller
              </div>
            </div>
          </div>

          <div className="det-cta-btns">
            <a href={`tel:${contactPhone}`} className="det-btn-call">
              <FaPhoneAlt /> Call Seller
            </a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="det-btn-wa">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>

          <p className="det-contact-note">
            <FaShieldAlt style={{ color: "#22c55e", flexShrink: 0 }} />
            Admin verified listing — direct contact
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
                <label htmlFor="prod-name"><FaUser /> Full Name</label>
                <input id="prod-name" type="text" required placeholder="e.g. Ramesh Kumar"
                  className="book-control" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="book-field">
                <label htmlFor="prod-phone"><FaMobileAlt /> Phone Number</label>
                <input id="prod-phone" type="tel" required placeholder="10-digit mobile"
                  className="book-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="book-field">
                <label htmlFor="prod-email"><FaEnvelope /> Email (optional)</label>
                <input id="prod-email" type="email" placeholder="email@example.com"
                  className="book-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="book-field">
                <label htmlFor="prod-msg"><FaCommentAlt /> Message</label>
                <textarea id="prod-msg" rows={3} required
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
