"use client";
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
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
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          type: "general",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
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

  return (
    <div className="py-16 bg-neutral-950">
      <Container className="space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Contact Khurja Deals
          </h1>
          <p className="text-sm text-neutral-450">
            For support questions, properties placement verification, or advertising opportunities, send us a query or call us directly.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Details Cards (Left 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Call */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start gap-4 shadow">
              <span className="text-2xl text-[var(--primary)] mt-1 shrink-0">📞</span>
              <div>
                <h4 className="font-bold text-white text-base">Call Support</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  We are available for calls daily between 9 AM to 8 PM.
                </p>
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="inline-block mt-3 text-sm font-semibold text-[var(--primary)] hover:underline"
                >
                  {SITE_CONFIG.phone}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start gap-4 shadow">
              <span className="text-2xl text-[var(--whatsapp)] mt-1 shrink-0">💬</span>
              <div>
                <h4 className="font-bold text-white text-base">WhatsApp Support</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  Click below to open a chat and ask your listing query.
                </p>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-semibold text-[var(--whatsapp)] hover:underline"
                >
                  Start WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Mail & Office */}
            <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex items-start gap-4 shadow">
              <span className="text-2xl text-[var(--primary)] mt-1 shrink-0">✉️</span>
              <div>
                <h4 className="font-bold text-white text-base">Mail & Office</h4>
                <p className="text-sm text-neutral-400 mt-1">
                  Official inquiries or documentations.
                </p>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="block mt-2 text-sm text-[var(--primary)] hover:underline"
                >
                  {SITE_CONFIG.email}
                </a>
                <span className="block text-xs text-neutral-500 mt-2">
                  {SITE_CONFIG.address}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Message Form (Right 2 columns) */}
          <div className="lg:col-span-2 bg-neutral-900 border border-neutral-850 p-8 rounded-3xl shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6">Send us a Message</h3>

            {submitSuccess ? (
              <div className="p-6 rounded-2xl bg-green-950/40 border border-green-800 text-green-400 text-sm text-center">
                🎉 Thank you! Your message was submitted successfully. Our support team will call you back on your mobile.
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
                <TextArea
                  label="Message *"
                  placeholder="How can we help you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />

                {submitError && (
                  <div className="text-xs text-red-500 font-medium">
                    ⚠️ {submitError}
                  </div>
                )}

                <Button type="submit" isLoading={isSubmitting}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
