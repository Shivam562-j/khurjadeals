"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Product, ProductCategory, ProductCondition, ProductStatus } from "@/types/product";
import CustomModalHeader from "../Modal/CustomModalHeader";
import {
  MdCloudUpload,
  MdDeleteOutline,
  MdCheck,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdPhotoLibrary,
  MdTune,
} from "react-icons/md";
import { toast } from "react-toastify";

export interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
  onSuccess: () => void;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Phones & Mobiles",
  "Laptops & Computers",
  "Bikes & Scooters",
  "Cars & Vehicles",
  "Electric Vehicles",
  "Electrical Appliances",
  "Pottery & Ceramics",
  "Others",
];

const PRODUCT_CONDITIONS: { label: string; value: ProductCondition }[] = [
  { label: "New", value: "new" },
  { label: "Used", value: "used" },
  { label: "Refurbished", value: "refurbished" },
];

const STATUS_OPTIONS: { label: string; value: ProductStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Sold", value: "sold" },
  { label: "Inactive", value: "inactive" },
];

export default function CreateProductModal({
  isOpen,
  onClose,
  editProduct,
  onSuccess,
}: CreateProductModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Bikes & Scooters" as ProductCategory,
    condition: "new" as ProductCondition,
    status: "active" as ProductStatus,
    price: "",
    location: "",
    contactName: "",
    contactPhone: "",
    isFeatured: false,
    images: [] as string[],
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill in Edit case or reset in Create case
  useEffect(() => {
    if (isOpen) {
      if (editProduct && editProduct._id) {
        const initial = {
          title: editProduct.title || "",
          description: editProduct.description || "",
          category: (editProduct.category || "Others") as ProductCategory,
          condition: (editProduct.condition || "used") as ProductCondition,
          status: (editProduct.status || "active") as ProductStatus,
          price: editProduct.price ? String(editProduct.price) : "",
          location: editProduct.location || "",
          contactName: editProduct.contactName || "",
          contactPhone: editProduct.contactPhone || "",
          isFeatured: Boolean(editProduct.isFeatured),
          images: Array.isArray(editProduct.images) ? [...editProduct.images] : [],
        };
        setFormData(initial);
        setInitialFormData(initial);
      } else if (editProduct) {
        const initial = {
          title: editProduct.title || "",
          description: editProduct.description || "",
          category: (editProduct.category || "Others") as ProductCategory,
          condition: (editProduct.condition || "used") as ProductCondition,
          status: (editProduct.status || "active") as ProductStatus,
          price: editProduct.price ? String(editProduct.price) : "",
          location: editProduct.location || "",
          contactName: editProduct.contactName || "",
          contactPhone: editProduct.contactPhone || "",
          isFeatured: Boolean(editProduct.isFeatured),
          images: Array.isArray(editProduct.images) ? [...editProduct.images] : [],
        };
        setFormData(initial);
        setInitialFormData(null);
      } else {
        const initial = {
          title: "",
          description: "",
          category: "Bikes & Scooters" as ProductCategory,
          condition: "new" as ProductCondition,
          status: "active" as ProductStatus,
          price: "",
          location: "",
          contactName: "",
          contactPhone: "",
          isFeatured: false,
          images: [],
        };
        setFormData(initial);
        setInitialFormData(initial);
      }
      setTouched({});
    }
  }, [isOpen, editProduct]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isSubmitting]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Field Changes
  const handleChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Check if form changed (for edit mode save button enable/disable)
  const hasFormChanged = useMemo(() => {
    if (!editProduct || !initialFormData) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData, editProduct]);

  // Validation Logic
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Product title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }

    if (!formData.location.trim()) {
      errors.location = "City / Locality is required";
    }

    if (!formData.contactName.trim()) {
      errors.contactName = "Contact person name is required";
    }

    const cleanPhone = formData.contactPhone.replace(/\D/g, "");
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = "Contact phone is required";
    } else if (cleanPhone.length < 10) {
      errors.contactPhone = "Enter a valid 10-digit phone number";
    }

    return errors;
  }, [formData]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Disabled Save button logic
  const isSaveDisabled = useMemo(() => {
    if (!isValid) return true;
    if (editProduct && !hasFormChanged) return true;
    if (isSubmitting) return true;
    return false;
  }, [isValid, editProduct, hasFormChanged, isSubmitting]);

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const data = new FormData();
      data.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
        if (res.ok) {
          const json = await res.json();
          if (json.url) uploadedUrls.push(json.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      condition: formData.condition,
      status: formData.status,
      price: Number(formData.price),
      location: formData.location.trim(),
      contactName: formData.contactName.trim(),
      contactPhone: formData.contactPhone.trim(),
      isFeatured: formData.isFeatured,
      images: formData.images,
    };

    try {
      const url = editProduct?._id
        ? `/api/products/${editProduct._id}`
        : "/api/products";
      const method = editProduct?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          editProduct?._id
            ? "Product updated successfully."
            : "Product created successfully."
        );
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save product.");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to submit product form.");
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6">
      {/* ── BACKDROP OVERLAY ── */}
      <div
        onClick={() => !isSubmitting && onClose()}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* ── MODAL CONTAINER (Split 2-column layout) ── */}
      <div
        className="relative z-10 w-full max-w-5xl h-full max-h-[92vh] bg-[#171717] rounded-xl shadow-2xl border border-[#2e2e2e] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <CustomModalHeader
          headerTitle={editProduct ? "Edit Bazaar Product" : "Create Bazaar Product"}
          handleCloseModal={() => !isSubmitting && onClose()}
          badgeText={editProduct ? editProduct.status : undefined}
          badgeBgColor={
            editProduct?.status === "active"
              ? "#0a2e1d"
              : editProduct?.status === "sold"
              ? "#2d1212"
              : "#222222"
          }
          badgeTextColor={
            editProduct?.status === "active"
              ? "#34d399"
              : editProduct?.status === "sold"
              ? "#f87171"
              : "#a3a3a3"
          }
        />

        {/* ── BODY SPLIT 2-COLUMN VIEW ── */}
        <div className="w-full flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* ── LEFT COLUMN: Core Details ── */}
          <div className="w-full md:w-1/2 lg:w-[480px] h-full border-r border-[#262626] p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#141414]">
            <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <MdTune className="text-base text-[#e8590c]" /> Basic Information
            </h4>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Product Title <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="e.g. Royal Enfield Classic 350 (2021 Model)"
                className={`w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                  touched.title && validationErrors.title
                    ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                    : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                }`}
              />
              {touched.title && validationErrors.title && (
                <p className="text-[11px] text-[#f87171] mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Description <span className="text-[#f87171]">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Product condition, purchase year, specifications, included accessories..."
                className={`w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                  touched.description && validationErrors.description
                    ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                    : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                }`}
              />
              {touched.description && validationErrors.description && (
                <p className="text-[11px] text-[#f87171] mt-0.5">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Category <span className="text-[#f87171]">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value as ProductCategory)}
                className="w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border border-[#333333] rounded-lg outline-none focus:border-[#e8590c] cursor-pointer"
              >
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#171717] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Pills */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Item Condition <span className="text-[#f87171]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 bg-[#0d0d0d] p-1 rounded-lg border border-[#262626]">
                {PRODUCT_CONDITIONS.map((cond) => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => handleChange("condition", cond.value)}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      formData.condition === cond.value
                        ? "bg-gradient-to-r from-[#e8590c] to-[#f59e0b] text-white shadow-xs"
                        : "text-[#a3a3a3] hover:text-white"
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                  Price (₹) <span className="text-[#f87171]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-[#a3a3a3] font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    onBlur={() => handleBlur("price")}
                    placeholder="0"
                    className={`w-full pl-7 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                      touched.price && validationErrors.price
                        ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                        : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                    }`}
                  />
                </div>
                {formData.price && Number(formData.price) > 0 && (
                  <p className="text-[11px] text-[#f59e0b] font-semibold mt-0.5">
                    ₹{Number(formData.price).toLocaleString("en-IN")}
                  </p>
                )}
                {touched.price && validationErrors.price && (
                  <p className="text-[11px] text-[#f87171] mt-1">
                    {validationErrors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                  Listing Status <span className="text-[#f87171]">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value as ProductStatus)}
                  className="w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border border-[#333333] rounded-lg outline-none focus:border-[#e8590c] cursor-pointer"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st.value} value={st.value} className="bg-[#171717] text-white">
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Product Toggle */}
            <div className="pt-2 border-t border-[#262626]">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded text-[#e8590c] focus:ring-[#e8590c] accent-[#e8590c] cursor-pointer bg-[#0d0d0d] border-[#333333]"
                />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Featured Bazaar Listing
                  </span>
                  <span className="text-[11px] text-[#a3a3a3]">
                    Highlight this item on the Bazaar homepage
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Location, Contact & Media ── */}
          <div className="w-full md:w-1/2 lg:flex-1 h-full p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#171717]">
            {/* Location & Seller Section */}
            <div>
              <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <MdLocationOn className="text-base text-[#e8590c]" /> Location & Seller Details
              </h4>

              <div className="flex flex-col gap-3">
                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                    Locality / Area <span className="text-[#f87171]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    onBlur={() => handleBlur("location")}
                    placeholder="e.g. Subhash Road, Khurja"
                    className={`w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                      touched.location && validationErrors.location
                        ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                        : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                    }`}
                  />
                  {touched.location && validationErrors.location && (
                    <p className="text-[11px] text-[#f87171] mt-1">
                      {validationErrors.location}
                    </p>
                  )}
                </div>

                {/* Contact Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                      Seller Name <span className="text-[#f87171]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[#737373]">
                        <MdPerson className="text-sm" />
                      </span>
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => handleChange("contactName", e.target.value)}
                        onBlur={() => handleBlur("contactName")}
                        placeholder="Seller Name"
                        className={`w-full pl-8 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                          touched.contactName && validationErrors.contactName
                            ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                            : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                        }`}
                      />
                    </div>
                    {touched.contactName && validationErrors.contactName && (
                      <p className="text-[11px] text-[#f87171] mt-1">
                        {validationErrors.contactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                      Phone Number <span className="text-[#f87171]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[#737373]">
                        <MdPhone className="text-sm" />
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={formData.contactPhone}
                        onChange={(e) => handleChange("contactPhone", e.target.value)}
                        onBlur={() => handleBlur("contactPhone")}
                        placeholder="10-digit number"
                        className={`w-full pl-8 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                          touched.contactPhone && validationErrors.contactPhone
                            ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                            : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                        }`}
                      />
                    </div>
                    {touched.contactPhone && validationErrors.contactPhone && (
                      <p className="text-[11px] text-[#f87171] mt-1">
                        {validationErrors.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Upload Section */}
            <div className="pt-2 border-t border-[#262626] flex-1 flex flex-col min-h-0">
              <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <MdPhotoLibrary className="text-base text-[#e8590c]" /> Product Photos ({formData.images.length})
              </h4>

              {/* Upload Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-[#333333] hover:border-[#e8590c] hover:bg-[#e8590c]/5 bg-[#0d0d0d] rounded-xl p-4 text-center cursor-pointer transition-all ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <MdCloudUpload className="mx-auto text-3xl text-[#e8590c] mb-1" />
                <p className="text-xs font-semibold text-white">
                  {isUploading ? "Uploading photos..." : "Click or drag images to upload"}
                </p>
                <p className="text-[11px] text-[#a3a3a3] mt-0.5">
                  PNG, JPG, WEBP up to 10MB each
                </p>
              </div>

              {/* Uploaded Thumbnails Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3 overflow-y-auto max-h-48 p-1">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden aspect-square border border-[#262626] bg-[#0d0d0d]"
                    >
                      <Image
                        src={img}
                        alt={`product-img-${idx}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                        title="Remove photo"
                      >
                        <MdDeleteOutline className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="w-full px-6 py-3.5 bg-[#141414] border-t border-[#262626] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-[#a3a3a3] hover:text-white bg-[#1f1f1f] hover:bg-[#262626] border border-[#333333] rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaveDisabled}
            className={`px-5 py-2 text-xs font-semibold text-white rounded-lg transition-all flex items-center gap-1.5 ${
              isSaveDisabled
                ? "bg-[#262626] text-[#666666] cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-[#e8590c] to-[#f59e0b] hover:from-[#d04a04] hover:to-[#e08e00] shadow-[0_4px_16px_rgba(232,89,12,0.35)] cursor-pointer"
            }`}
          >
            <MdCheck className="text-base" />
            {isSubmitting
              ? "Saving..."
              : editProduct
              ? "Update Product"
              : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
