"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaStar,
  FaUser,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaHome,
  FaBox,
  FaComments,
} from "react-icons/fa";

interface Review {
  _id: string;
  name: string;
  location: string;
  rating: number;
  category: string;
  message: string;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  property: { label: "Property", icon: <FaHome /> },
  product:  { label: "Product / Vehicle", icon: <FaBox /> },
  general:  { label: "General", icon: <FaComments /> },
};

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className={`review-stars ${size}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FaStar
          key={s}
          className={s <= rating ? "star-filled" : "star-empty"}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="review-star-picker">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className={`star-pick-btn ${s <= (hovered || value) ? "active" : ""}`}
          aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
        >
          <FaStar />
        </button>
      ))}
      <span className="star-pick-label">
        {value > 0 ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value] : "Tap to rate"}
      </span>
    </div>
  );
}

// Aggregate stats
function ReviewStats({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    star: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));
  return (
    <div className="review-stats-card">
      <div className="review-stats-avg">
        <span className="avg-number">{avg.toFixed(1)}</span>
        <StarRating rating={Math.round(avg)} size="lg" />
        <span className="avg-label">{reviews.length} review{reviews.length > 1 ? "s" : ""}</span>
      </div>
      <div className="review-stats-bars">
        {counts.map(({ star, count }) => (
          <div key={star} className="stat-bar-row">
            <span className="stat-bar-label">{star}</span>
            <FaStar className="stat-bar-star" />
            <div className="stat-bar-track">
              <div
                className="stat-bar-fill"
                style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
              />
            </div>
            <span className="stat-bar-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "property" | "product" | "general">("all");

  // Form state
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formCategory, setFormCategory] = useState("general");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.category === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!formName.trim()) return setSubmitError("Please enter your name.");
    if (formRating < 1) return setSubmitError("Please select a star rating.");
    if (formMessage.trim().length < 10) return setSubmitError("Please write at least 10 characters.");

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          location: formLocation.trim() || "Khurja",
          rating: formRating,
          category: formCategory,
          message: formMessage.trim(),
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setFormName(""); setFormLocation(""); setFormRating(0);
        setFormCategory("general"); setFormMessage("");
      } else {
        const err = await res.json();
        setSubmitError(err.message || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Customer Reviews</span>
          <h1 className="h1">What Our Users Say</h1>
          <p className="lead">
            Real experiences from buyers, sellers, and property seekers across Khurja &amp; Bulandshahr.
          </p>
        </div>
      </div>

      <section className="section-light">
        <div className="container reviews-layout">

          {/* Left: Stats + Form */}
          <div className="reviews-sidebar">
            {/* Rating Stats */}
            <ReviewStats reviews={reviews} />

            {/* Submit Review Form */}
            <div className="review-form-card" ref={formRef}>
              <div className="review-form-header">
                <FaQuoteLeft className="review-form-quote-icon" />
                <div>
                  <h3>Share Your Experience</h3>
                  <p>Your review helps others make better decisions.</p>
                </div>
              </div>

              {submitSuccess ? (
                <div className="review-success-state">
                  <FaCheckCircle />
                  <h4>Thank You!</h4>
                  <p>Your review has been submitted and is pending approval. It will appear here once verified by our team.</p>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSubmitSuccess(false)}
                  >
                    Submit Another Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="review-form" noValidate>
                  {submitError && (
                    <div className="review-form-error">
                      <FaExclamationCircle />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div className="review-field">
                    <label htmlFor="rev-name"><FaUser /> Your Name *</label>
                    <input
                      id="rev-name"
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="review-field">
                    <label htmlFor="rev-location"><FaMapMarkerAlt /> Location</label>
                    <input
                      id="rev-location"
                      type="text"
                      placeholder="e.g. GT Road, Khurja"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                    />
                  </div>

                  <div className="review-field">
                    <label>Your Rating *</label>
                    <StarPicker value={formRating} onChange={setFormRating} />
                  </div>

                  <div className="review-field">
                    <label htmlFor="rev-category">Category</label>
                    <select
                      id="rev-category"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      <option value="general">General Experience</option>
                      <option value="property">Property (Buy/Sell/Rent)</option>
                      <option value="product">Product / Vehicle</option>
                    </select>
                  </div>

                  <div className="review-field">
                    <label htmlFor="rev-message">Your Review *</label>
                    <textarea
                      id="rev-message"
                      rows={4}
                      placeholder="Tell others about your experience with KhurjaDeals..."
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Reviews list */}
          <div className="reviews-main">
            {/* Filter tabs */}
            <div className="reviews-filter-tabs">
              {(["all", "property", "product", "general"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`review-filter-tab ${filter === cat ? "active" : ""}`}
                >
                  {cat === "all"
                    ? `All (${reviews.length})`
                    : `${CATEGORY_LABELS[cat]?.label} (${reviews.filter((r) => r.category === cat).length})`}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="reviews-loading">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="review-card-skeleton" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="reviews-empty">
                <FaQuoteLeft />
                <p>No reviews yet{filter !== "all" ? " in this category" : ""}. Be the first to share your experience!</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {filtered.map((review) => (
                  <article key={review._id} className="review-card">
                    <div className="review-card-top">
                      <div className="review-avatar">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="review-meta">
                        <span className="review-name">{review.name}</span>
                        <span className="review-location">
                          <FaMapMarkerAlt />
                          {review.location}
                        </span>
                      </div>
                      <div className="review-card-rating">
                        <StarRating rating={review.rating} />
                      </div>
                    </div>

                    <div className="review-card-body">
                      <FaQuoteLeft className="review-quote-icon" />
                      <p className="review-text">{review.message}</p>
                    </div>

                    <div className="review-card-footer">
                      <span className="review-category-badge">
                        {CATEGORY_LABELS[review.category]?.icon}
                        {CATEGORY_LABELS[review.category]?.label || review.category}
                      </span>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
