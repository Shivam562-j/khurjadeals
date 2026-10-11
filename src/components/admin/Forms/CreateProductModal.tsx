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
  MdAdd,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingText, setUploadingText] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Local files pending upload on Create button click
  const [selectedFiles, setSelectedFiles] = useState<{ file: File; preview: string }[]>([]);
  // Existing images (from editProduct)
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill in Edit case or reset in Create case
  useEffect(() => {
    if (isOpen) {
      if (editProduct && editProduct._id) {
        const prodImages = Array.isArray(editProduct.images) ? [...editProduct.images] : [];
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
          images: prodImages,
        };
        setFormData(initial);
        setInitialFormData(initial);
        setExistingImages(prodImages);
        setSelectedFiles([]);

        // Fallback fetch if description was not included in editProduct
        if (!editProduct.description && editProduct._id) {
          fetch(`/api/products/${editProduct._id}`)
            .then((r) => r.json())
            .then((full) => {
              if (full && full.description) {
                setFormData((prev) => ({ ...prev, description: full.description }));
                setInitialFormData((prev) =>
                  prev ? { ...prev, description: full.description } : prev
                );
              }
            })
            .catch(() => {});
        }
      } else if (editProduct) {
        const prodImages = Array.isArray(editProduct.images) ? [...editProduct.images] : [];
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
          images: prodImages,
        };
        setFormData(initial);
        setInitialFormData(initial);
        setExistingImages(prodImages);
        setSelectedFiles([]);
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
        setExistingImages([]);
        setSelectedFiles([]);
      }
      setTouched({});
      setUploadingText("");
    } else {
      // Cleanup preview URLs when closing
      selectedFiles.forEach((item) => URL.revokeObjectURL(item.preview));
      setSelectedFiles([]);
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
    if (!editProduct) return false;
    if (!initialFormData) return false;
    if (selectedFiles.length > 0) return true;
    const initialImgs = Array.isArray(initialFormData.images) ? initialFormData.images : [];
    if (JSON.stringify(existingImages) !== JSON.stringify(initialImgs)) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData, editProduct, selectedFiles.length, existingImages]);

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

    // Image is required
    const totalImages = existingImages.length + selectedFiles.length;
    if (totalImages === 0) {
      errors.images = "At least one product photo is required";
    }

    return errors;
  }, [formData, existingImages.length, selectedFiles.length]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Disabled Save button logic (in edit mode: disabled until form has changes; in create mode: disabled until valid)
  const isSaveDisabled = useMemo(() => {
    if (!isValid) return true;
    if (isSubmitting) return true;
    if (editProduct && !hasFormChanged) return true;
    return false;
  }, [isValid, isSubmitting, editProduct, hasFormChanged]);

  // Handle local file selection (shows preview below box, uploads to Cloudinary on Create)
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    const validAdditions: { file: File; preview: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid format. Only JPG, PNG, WEBP allowed.`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`${file.name} is larger than 5MB limit.`);
        continue;
      }
      validAdditions.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    if (validAdditions.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validAdditions]);
      setTouched((prev) => ({ ...prev, images: true }));
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== index));
    setTouched((prev) => ({ ...prev, images: true }));
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((_, idx) => idx !== index);
    });
    setTouched((prev) => ({ ...prev, images: true }));
  };

  // Form Submit (Uploads selected images to Cloudinary here, then saves product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true,
      price: true,
      location: true,
      contactName: true,
      contactPhone: true,
      images: true,
    });

    const totalImages = existingImages.length + selectedFiles.length;
    if (totalImages === 0) {
      toast.error("Please add at least one product photo.");
      return;
    }

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // 1. Upload new files to Cloudinary on Create button click
      const uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        setUploadingText(`Uploading ${selectedFiles.length} photo${selectedFiles.length > 1 ? "s" : ""}...`);
        for (let i = 0; i < selectedFiles.length; i++) {
          const item = selectedFiles[i];
          const data = new FormData();
          data.append("file", item.file);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: data,
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `Failed to upload ${item.file.name}`);
          }

          const json = await res.json();
          if (json.url) {
            uploadedUrls.push(json.url);
          }
        }
      }

      setUploadingText(editProduct?._id ? "Saving product..." : "Creating product...");

      const finalImages = [...existingImages, ...uploadedUrls];

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
        images: finalImages,
      };

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
        selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
        setSelectedFiles([]);
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save product.");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to submit product form.");
    } finally {
      setIsSubmitting(false);
      setUploadingText("");
    }
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
            <div className={`pt-2 border-t border-[#262626] flex-1 flex flex-col min-h-0 p-3 rounded-xl border transition-colors ${
              touched.images && validationErrors.images
                ? "border-[#ef4444] bg-[#2d1212]/15"
                : "border-transparent"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5">
                  <MdPhotoLibrary className="text-base text-[#e8590c]" /> Product Photos ({existingImages.length + selectedFiles.length})
                  <span className="text-[#ef4444] text-xs font-semibold">*</span>
                </h4>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="text-xs font-semibold text-[#f59e0b] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <MdCloudUpload className="text-sm" /> Select Images
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFilesSelected(e.target.files)}
                disabled={isSubmitting}
                className="hidden"
              />

              {/* When NO images yet: Full Dashed Drop Zone */}
              {existingImages.length === 0 && selectedFiles.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    touched.images && validationErrors.images
                      ? "border-[#ef4444] bg-[#2d1212]/30 hover:border-[#ef4444]"
                      : "border-[#333333] hover:border-[#e8590c] hover:bg-[#e8590c]/5 bg-[#0d0d0d]"
                  } ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <MdCloudUpload className="mx-auto text-3xl text-[#e8590c] mb-1" />
                  <p className="text-xs font-semibold text-white">
                    Click to browse or drop images here
                  </p>
                  <p className="text-[11px] text-[#a3a3a3] mt-0.5">
                    PNG, JPG, WEBP up to 5MB each • <span className="text-[#ef4444] font-medium">Required</span>
                  </p>
                </div>
              ) : (
                /* When 1 or more images exist: Prominent Thumbnails Grid with '+ Add More' tile */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={handleDrop}
                  className="flex flex-col gap-2"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* Existing Images */}
                    {existingImages.map((img, idx) => (
                      <div
                        key={`existing-${idx}`}
                        className="relative group rounded-lg overflow-hidden aspect-square min-h-[95px] border border-[#262626] bg-[#0d0d0d] shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`product-img-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveExistingImage(idx);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow z-10"
                          title="Remove photo"
                        >
                          <MdDeleteOutline className="text-xs" />
                        </button>
                      </div>
                    ))}

                    {/* Selected Local Images (Uploads on Create) */}
                    {selectedFiles.map((item, idx) => (
                      <div
                        key={`new-${idx}`}
                        className="relative group rounded-lg overflow-hidden aspect-square min-h-[95px] border border-[#e8590c]/60 ring-1 ring-[#e8590c]/30 bg-[#0d0d0d] shadow-md"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.preview}
                          alt={`product-preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/85 text-[10px] text-[#fb923c] font-semibold px-1.5 py-0.5 rounded shadow backdrop-blur-sm">
                          Uploads on Create
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSelectedFile(idx);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow z-10"
                          title="Remove photo"
                        >
                          <MdDeleteOutline className="text-xs" />
                        </button>
                      </div>
                    ))}

                    {/* '+ Add More' Dashed Card */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group aspect-square min-h-[95px] rounded-lg border-2 border-dashed border-[#333333] hover:border-[#e8590c] hover:bg-[#e8590c]/5 bg-[#0d0d0d] flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-center p-2"
                    >
                      <MdAdd className="text-2xl text-[#e8590c] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-semibold text-white">Add More</span>
                      <span className="text-[9px] text-[#737373]">Drop or click</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {touched.images && validationErrors.images && (
                <p className="text-[11px] text-[#f87171] font-medium flex items-center gap-1 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                  {validationErrors.images}
                </p>
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
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {uploadingText || (editProduct ? "Saving..." : "Creating...")}
              </>
            ) : (
              <>
                <MdCheck className="text-base" />
                {editProduct ? "Save Changes" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
