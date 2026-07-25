"use client";
import React, { useState } from "react";
import { FaUser, FaPhoneAlt, FaTag, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function SubmitQueryPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "property-sell",
    location: "Khurja City",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
        setSubmitted(true);
        setFormData({ name: "", phone: "", type: "property-sell", location: "Khurja City", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit query. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please call support directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Instant Ad Listing</span>
          <h1 className="h1">Post Your Ad / Submit Inquiry</h1>
          <p className="lead">Fill out the quick form below. Our local admin team will verify and call you within 24 hours.</p>
        </div>
      </div>

      <section className="section-light">
        <div className="container max-w-3xl">
          <div className="book-card" style={{ maxWidth: 800, margin: "0 auto" }}>
            <div className="book-head">
              <div>
                <h2 className="text-xl font-bold text-white">Ad Submission &amp; Inquiry Form</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">Connect directly with buyers and local residents in Khurja</p>
              </div>
              <div className="save">
                <FaShieldAlt />
                <span>100% Free Listing</span>
              </div>
            </div>

            <div className="book-body">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-3xl mx-auto border border-emerald-500/30">
                    <FaCheckCircle />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Inquiry Submitted Successfully!</h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
                    Thank you! Our Khurja admin team has received your submission and will verify your phone number within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary mt-4"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="book-field">
                      <label htmlFor="name">
                        <FaUser /> Full Name
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
                      <label htmlFor="phone">
                        <FaPhoneAlt /> Phone Number
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

                  <div className="form-grid">
                    <div className="book-field">
                      <label htmlFor="type">
                        <FaTag /> Category / Requirement
                      </label>
                      <select
                        id="type"
                        className="book-control"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="property-sell" className="bg-[#141414]">Sell Property (Plot/House/Shop)</option>
                        <option value="property-rent" className="bg-[#141414]">Rent Out Property</option>
                        <option value="product-sell" className="bg-[#141414]">Sell Second-Hand Product</option>
                        <option value="pottery-wholesale" className="bg-[#141414]">Khurja Pottery Ceramics Inquiry</option>
                        <option value="general-inquiry" className="bg-[#141414]">General Support Inquiry</option>
                      </select>
                    </div>

                    <div className="book-field">
                      <label htmlFor="location">
                        <FaMapMarkerAlt /> Suburb / Area in Khurja
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

                  <div className="book-field">
                    <label htmlFor="message">
                      Listing Description / Special Requirements
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Specify price expected, plot area, product condition, or questions for admin..."
                      className="book-control !h-auto py-3 resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="book-submit"
                  >
                    <FaPaperPlane />
                    <span>{loading ? "Submitting Inquiry..." : "Submit Listing / Inquiry"}</span>
                  </button>

                  <div className="book-note">
                    <FaCheckCircle />
                    <span>Admin verification call back within 24 hours &bull; Zero commission</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
