"use client";
import React, { useState } from "react";
import { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatter";
import { whatsappLink } from "@/utils/helper";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";

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

  // Active Image State
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(`Hi ${contactName}, I am interested in purchasing "${title}" listed on Khurja Deals. Please contact me.`);
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
          type: "product",
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

  const displayImages = images && images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80"];

  const whatsappMessage = `Hello, I'm interested in the product "${title}" listed on Khurja Deals (Price: ${formatPrice(price)}). Is it still available?`;
  const waUrl = whatsappLink(contactPhone, whatsappMessage);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Product Image Gallery & Details (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Gallery */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-850 shadow-md">
            <img
              src={displayImages[activeImgIdx]}
              alt={`Product photo ${activeImgIdx + 1}`}
              className="w-full h-full object-cover transition-all"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`relative w-20 aspect-video rounded bg-neutral-950 border transition-all cursor-pointer ${
                    idx === activeImgIdx
                      ? "border-[var(--primary)] scale-95"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
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

        {/* Product Details Header */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full capitalize">
                {condition} Condition
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
                Price
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[var(--primary)]">
                {formatPrice(price)}
              </p>
            </div>
          </div>

          <hr className="border-neutral-850" />

          {/* Quick specs */}
          <div className="grid grid-cols-2 gap-4 py-2 text-center bg-neutral-950/40 rounded-xl">
            <div>
              <span className="text-xs text-neutral-500 block">Category</span>
              <span className="font-bold text-white text-sm">
                {category}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 block">Location</span>
              <span className="font-bold text-white text-sm">
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
        </div>
      </div>

      {/* Inquiry Form & Direct Contact (Right 1 column) */}
      <div className="lg:col-span-1 space-y-6">
        {/* Direct Contact Cards */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-5">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Contact Seller
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-white text-lg">
              {contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-white text-base">{contactName}</h4>
              <span className="text-xs text-neutral-500">Seller</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {/* Phone */}
            <a
              href={`tel:${contactPhone}`}
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white font-semibold transition-all text-sm"
            >
              📞 Call Seller
            </a>
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)] text-white font-semibold transition-all text-sm"
            >
              💬 WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl">
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">
            Contact Seller / Inquiry
          </h3>

          {submitSuccess ? (
            <div className="p-4 rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm text-center">
              🎉 Inquiry submitted successfully! The seller has been notified.
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
