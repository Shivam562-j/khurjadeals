"use client";
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import Select from "@/components/common/Select";

export default function SubmitQueryPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"property" | "product" | "general">("property");
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
        body: JSON.stringify({
          name,
          phone,
          email,
          type,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      setSubmitSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    { label: "Real Estate (Buy, Sell or Rent Property)", value: "property" },
    { label: "Bazaar Product (Sell or Buy Phones, Laptops, Bikes, Electricals, Pottery)", value: "product" },
    { label: "Other General Inquiry", value: "general" },
  ];

  return (
    <div className="py-16 bg-neutral-950">
      <Container className="max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Post Requirement
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Submit Your Requirement / Ad Listing
          </h1>
          <p className="text-sm text-neutral-400">
            Want to buy, sell, or rent property? Or sell second-hand items (bikes, mobile phones, laptops, electrical goods, ceramics)? Fill out the form, and our admin team will contact you to verify and list it live on the site.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900 border border-neutral-850 p-8 rounded-3xl shadow-xl">
          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-green-950/40 border border-green-800 text-green-400 text-sm text-center space-y-4">
              <p className="font-bold text-base">🎉 Request Submitted!</p>
              <p className="text-xs">
                We have received your details. Our representative will contact you on your mobile number to gather images/pricing and post your listing on Khurja Deals.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Your Name *"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Your Phone Number *"
                  placeholder="10 digit mobile"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Your Email"
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Select
                label="What are you posting? *"
                options={typeOptions}
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                required
              />

              <TextArea
                label="Describe your requirement or listing details *"
                placeholder="Examples: 
- I want to sell a 100 gaj plot near Junction Road. Asking price is 15 Lakh.
- I want to sell my pre-owned Hero Splendor bike (2021 model) for 45,000.
- I want to sell a second-hand Dell Core-i5 Laptop, 8GB RAM, 256GB SSD.
- I am looking for a shop for rent near GT Road for 12,000/month."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              {submitError && (
                <div className="text-xs text-red-500 font-medium">
                  ⚠️ {submitError}
                </div>
              )}

              <Button type="submit" fullWidth isLoading={isSubmitting}>
                Submit Request
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
