"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaPhoneAlt,
  FaTag,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheckCircle,
  FaShieldAlt,
  FaClock,
  FaFileAlt,
  FaExclamationCircle,
} from "react-icons/fa";

export default function SubmitQueryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "property-sell",
    location: "Khurja City",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    location?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = (): boolean => {
    const errors: { name?: string; phone?: string; location?: string } = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Full name is required (minimum 2 characters).";
    }

    const cleanPhone = formData.phone.trim();
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid 10-digit mobile number (e.g. 9876543210).";
    }

    if (!formData.location || formData.location.trim().length < 2) {
      errors.location = "Location/area in Khurja is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          type: formData.type,
          location: formData.location.trim(),
          message: formData.message.trim(),
        }),
      });

      if (res.ok) {
        // Redirect directly to Thank You page upon successful submission
        router.push("/submit-query/thank-you");
      } else {
        const data = await res.json();
        setGeneralError(data.message || data.error || "Failed to submit query. Please check fields and try again.");
      }
    } catch {
      setGeneralError("An unexpected network error occurred. Please call support directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Instant Free Listing</span>
          <h1 className="h1">Post Your Ad / Submit Inquiry</h1>
          <p className="lead">
            Fill out the quick form below. Our local Khurja admin team will verify and call you within 24 hours.
          </p>
        </div>
      </div>

      <section className="section-light py-12 sm:py-16">
        <div className="container max-w-3xl">
          <div className="book-card" style={{ maxWidth: 840, margin: "0 auto" }}>
            {/* Header */}
            <div className="book-head">
              <div>
                <h2 className="text-xl font-bold text-white">Ad Submission &amp; Inquiry Form</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Connect directly with real buyers &amp; residents in Khurja with zero brokerage
                </p>
              </div>
              <div className="save">
                <FaShieldAlt />
                <span>100% Free Listing</span>
              </div>
            </div>

            {/* Body */}
            <div className="book-body">
              <form onSubmit={handleSubmit} noValidate>
                {generalError && (
                  <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-3">
                    <FaExclamationCircle className="text-base shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                {/* Field Row 1: Full Name & Phone Number */}
                <div className="form-grid">
                  <div className="book-field">
                    <label htmlFor="name">
                      <FaUser /> Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      className={`book-control ${fieldErrors.name ? "!border-red-500" : ""}`}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                      }}
                    />
                    {/* Red Inline Validation Error directly under Name field */}
                    {fieldErrors.name && (
                      <span className="field-error-text">
                        <FaExclamationCircle className="text-xs shrink-0" />
                        <span>{fieldErrors.name}</span>
                      </span>
                    )}
                  </div>

                  <div className="book-field">
                    <label htmlFor="phone">
                      <FaPhoneAlt /> Mobile Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      className={`book-control ${fieldErrors.phone ? "!border-red-500" : ""}`}
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                      }}
                    />
                    {/* Red Inline Validation Error directly under Phone field */}
                    {fieldErrors.phone && (
                      <span className="field-error-text">
                        <FaExclamationCircle className="text-xs shrink-0" />
                        <span>{fieldErrors.phone}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Field Row 2: Category & Location */}
                <div className="form-grid">
                  <div className="book-field">
                    <label htmlFor="type">
                      <FaTag /> Category / Requirement *
                    </label>
                    <select
                      id="type"
                      className="book-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="property-sell" className="bg-[#141414]">Sell Property (Plot / House / Shop)</option>
                      <option value="property-rent" className="bg-[#141414]">Rent Out Property (Flat / Shop)</option>
                      <option value="product-sell" className="bg-[#141414]">Sell Used Bike / Car / Electric Vehicle (EV)</option>
                      <option value="appliance-sell" className="bg-[#141414]">Sell Used Home Appliance (Fridge / AC / Washing Machine)</option>
                      <option value="electronics-sell" className="bg-[#141414]">Sell Used Mobile / Laptop / Electronics</option>
                      <option value="general-inquiry" className="bg-[#141414]">General Support Inquiry</option>
                    </select>
                  </div>

                  <div className="book-field">
                    <label htmlFor="location">
                      <FaMapMarkerAlt /> Location / Area in Khurja *
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g. Near GT Road, City Center, Junction"
                      className={`book-control ${fieldErrors.location ? "!border-red-500" : ""}`}
                      value={formData.location}
                      onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        if (fieldErrors.location) setFieldErrors({ ...fieldErrors, location: undefined });
                      }}
                    />
                    {/* Red Inline Validation Error directly under Location field */}
                    {fieldErrors.location && (
                      <span className="field-error-text">
                        <FaExclamationCircle className="text-xs shrink-0" />
                        <span>{fieldErrors.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Field Row 3: Description with 150px Height as Requested */}
                <div className="book-field">
                  <label htmlFor="message">
                    <FaFileAlt /> Listing Description &amp; Details
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Specify price expected, plot area, product condition, address details..."
                    className="book-control-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Submit Button */}
                <div style={{ paddingTop: "8px" }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="book-submit"
                  >
                    <FaPaperPlane />
                    <span>{loading ? "Submitting Inquiry..." : "Submit Free Listing / Inquiry"}</span>
                  </button>
                </div>

                {/* 3 Trust Badges in EXACTLY 1 SINGLE ROW (.form-trust-row) */}
                <div className="form-trust-row">
                  <div className="form-trust-chip">
                    <FaCheckCircle className="text-emerald-500 text-xs sm:text-sm shrink-0" />
                    <span>Zero Agent Commission</span>
                  </div>
                  <div className="form-trust-chip">
                    <FaClock className="text-[var(--primary)] text-xs sm:text-sm shrink-0" />
                    <span>Verified Within 24 Hours</span>
                  </div>
                  <div className="form-trust-chip">
                    <FaShieldAlt className="text-amber-500 text-xs sm:text-sm shrink-0" />
                    <span>Direct Owner Contacts</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
