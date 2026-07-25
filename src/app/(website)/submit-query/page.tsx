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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect directly to Thank You page
        router.push("/submit-query/thank-you");
      } else {
        const data = await res.json();
        setError(data.message || data.error || "Failed to submit query. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again or call support.");
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Field Row 1: Full Name & Phone Number */}
                <div className="form-grid gap-8">
                  <div className="book-field">
                    <label htmlFor="name" style={{ gap: "8px", marginBottom: "8px" }}>
                      <FaUser /> Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      className="book-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="book-field">
                    <label htmlFor="phone" style={{ gap: "8px", marginBottom: "8px" }}>
                      <FaPhoneAlt /> Mobile Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      className="book-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Field Row 2: Category & Location */}
                <div className="form-grid gap-8">
                  <div className="book-field">
                    <label htmlFor="type" style={{ gap: "8px", marginBottom: "8px" }}>
                      <FaTag /> Category / Requirement *
                    </label>
                    <select
                      id="type"
                      className="book-control"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="property-sell" className="bg-[#141414]">Sell Property (Plot / House / Shop)</option>
                      <option value="property-rent" className="bg-[#141414]">Rent Out Property</option>
                      <option value="product-sell" className="bg-[#141414]">Sell Second-Hand Product</option>
                      <option value="pottery-wholesale" className="bg-[#141414]">Khurja Pottery Ceramics Inquiry</option>
                      <option value="general-inquiry" className="bg-[#141414]">General Support Inquiry</option>
                    </select>
                  </div>

                  <div className="book-field">
                    <label htmlFor="location" style={{ gap: "8px", marginBottom: "8px" }}>
                      <FaMapMarkerAlt /> Location / Area in Khurja *
                    </label>
                    <input
                      id="location"
                      type="text"
                      placeholder="e.g. Near GT Road, City Center, Junction"
                      className="book-control"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                {/* Field Row 3: Description with Height Increased (min-h-[220px]) */}
                <div className="book-field">
                  <label htmlFor="message" style={{ gap: "8px", marginBottom: "8px" }}>
                    <FaFileAlt /> Listing Description &amp; Details
                  </label>
                  <textarea
                    id="message"
                    rows={8}
                    placeholder="Specify price expected, plot area, product condition, address details, or special instructions for admin..."
                    className="book-control !h-auto py-4 min-h-[220px] resize-y"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="book-submit"
                >
                  <FaPaperPlane />
                  <span>{loading ? "Submitting Inquiry..." : "Submit Free Listing / Inquiry"}</span>
                </button>

                {/* 3 Trust Badges in EXACTLY 1 SINGLE ROW */}
                <div className="pt-6 border-t border-neutral-800/80">
                  <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full">
                    {/* Badge 1 */}
                    <div className="flex-1 py-3 px-2 sm:px-4 rounded-xl bg-[#1c1c1c] border border-neutral-800/90 flex items-center justify-center gap-1.5 text-center shadow-sm">
                      <FaCheckCircle className="text-emerald-500 text-xs sm:text-sm shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
                        Zero Agent Commission
                      </span>
                    </div>

                    {/* Badge 2 */}
                    <div className="flex-1 py-3 px-2 sm:px-4 rounded-xl bg-[#1c1c1c] border border-neutral-800/90 flex items-center justify-center gap-1.5 text-center shadow-sm">
                      <FaClock className="text-[var(--primary)] text-xs sm:text-sm shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
                        Verified Within 24 Hours
                      </span>
                    </div>

                    {/* Badge 3 */}
                    <div className="flex-1 py-3 px-2 sm:px-4 rounded-xl bg-[#1c1c1c] border border-neutral-800/90 flex items-center justify-center gap-1.5 text-center shadow-sm">
                      <FaShieldAlt className="text-amber-500 text-xs sm:text-sm shrink-0" />
                      <span className="text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
                        Direct Owner Contacts
                      </span>
                    </div>
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
