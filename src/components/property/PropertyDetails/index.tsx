"use client";
import React, { useState } from "react";
import { Property } from "@/types/property";
import { formatPrice } from "@/utils/formatter";
import { whatsappLink } from "@/utils/helper";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";

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

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(`Hi ${contactName}, I am interested in your property "${title}" listed on Khurja Deals. Please contact me.`);
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
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          type: "property",
          referenceId: _id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit inquiry");
      }

      setSubmitSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hello, I'm interested in the property "${title}" listed on Khurja Deals (Price: ${formatPrice(price)}). Can we discuss?`;
  const waUrl = whatsappLink(contactPhone, whatsappMessage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Description & Features (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full">
                For {listingType}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-3">
                {title}
              </h1>
              <p className="text-sm text-neutral-450 mt-1 flex items-center gap-1">
                📍 {location}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 uppercase font-semibold">
                Asking Price
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[var(--primary)]">
                {formatPrice(price)}
              </p>
            </div>
          </div>

          <hr className="border-neutral-850" />

          {/* Quick Specs */}
          <div className="grid grid-cols-3 gap-4 py-2 text-center bg-neutral-950/40 rounded-xl">
            <div>
              <span className="text-xs text-neutral-500 block">Type</span>
              <span className="font-bold text-white text-sm sm:text-base capitalize">
                {type}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 block">Area</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {area} {areaUnit}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 block">Location</span>
              <span className="font-bold text-white text-sm sm:text-base truncate block max-w-full px-2">
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white">Description</h3>
          <p className="text-neutral-350 leading-relaxed text-sm whitespace-pre-line">
            {description}
          </p>
          {address && (
            <p className="text-sm text-neutral-450 italic mt-3">
              Address details: {address}
            </p>
          )}
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Features & Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-neutral-300 bg-neutral-950/30 px-3 py-2 rounded-lg border border-neutral-850/50"
                >
                  <span className="text-[var(--primary)] text-xs">✦</span>
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Form & Direct Contact (Right 1 column) */}
      <div className="lg:col-span-1 space-y-6">
        {/* Direct Contact Cards */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-5">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Contact Owner / Agent
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white text-lg">
              {contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-white text-base">{contactName}</h4>
              <span className="text-xs text-neutral-500">Local Dealer</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {/* Phone */}
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white font-semibold transition-all text-sm"
            >
              📞 Call Owner
            </a>
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)] text-white font-semibold transition-all text-sm"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">
            Send Inquiry
          </h3>

          {submitSuccess ? (
            <div className="p-4 rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm text-center">
              🎉 Thank you! Your inquiry has been submitted. We will contact you soon.
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
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
              <Input
                label="Your Email"
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextArea
                label="Message"
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
                Submit Inquiry
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
