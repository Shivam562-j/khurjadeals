"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import CustomModalHeader from "../Modal/CustomModalHeader";
import {
  MdCloudUpload,
  MdDeleteOutline,
  MdCheck,
  MdAdd,
  MdLocationOn,
  MdPerson,
  MdPhotoLibrary,
  MdTune,
} from "react-icons/md";
import { toast } from "react-toastify";

export interface CreatePropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProperty?: Property | null;
  onSuccess: () => void;
}

const COMMON_AMENITIES = [
  "Water Supply",
  "Car Parking",
  "Main Road Facing",
  "Lift",
  "Gated Security",
  "Power Backup",
  "Park / Garden",
  "Corner Plot",
  "CCTV Surveillance",
  "Gas Pipeline",
];

const PROPERTY_TYPES = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Plot", value: "plot" },
  { label: "Agricultural", value: "agricultural" },
];

const LISTING_PURPOSES = [
  { label: "Sell", value: "sell" },
  { label: "Rent", value: "rent" },
  { label: "Lease", value: "lease" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Sold", value: "sold" },
  { label: "Rented", value: "rented" },
  { label: "Inactive", value: "inactive" },
];

const AREA_UNITS = [
  { label: "Sq. Ft", value: "sqft" },
  { label: "Sq. Yard", value: "sqyd" },
  { label: "Acre", value: "acre" },
  { label: "Bigha", value: "bigha" },
];

export default function CreatePropertyModal({
  isOpen,
  onClose,
  editProperty,
  onSuccess,
}: CreatePropertyModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "residential",
    listingType: "sell",
    status: "active",
    price: "",
    area: "",
    areaUnit: "sqft",
    location: "",
    address: "",
    contactName: "",
    contactPhone: "",
    isFeatured: false,
    features: [] as string[],
    images: [] as string[],
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(
    null
  );
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill in Edit case or reset in Create case
  useEffect(() => {
    if (isOpen) {
      if (editProperty && editProperty._id) {
        const initial = {
          title: editProperty.title || "",
          description: editProperty.description || "",
          type: editProperty.type || "residential",
          listingType: editProperty.listingType || "sell",
          status: editProperty.status || "active",
          price: editProperty.price ? String(editProperty.price) : "",
          area: editProperty.area ? String(editProperty.area) : "",
          areaUnit: editProperty.areaUnit || "sqft",
          location: editProperty.location || "",
          address: editProperty.address || "",
          contactName: editProperty.contactName || "",
          contactPhone: editProperty.contactPhone || "",
          isFeatured: Boolean(editProperty.isFeatured),
          features: Array.isArray(editProperty.features)
            ? [...editProperty.features]
            : [],
          images: Array.isArray(editProperty.images)
            ? [...editProperty.images]
            : [],
        };
        setFormData(initial);
        setInitialFormData(initial);
      } else {
        const initial = {
          title: "",
          description: "",
          type: "residential",
          listingType: "sell",
          status: "active",
          price: "",
          area: "",
          areaUnit: "sqft",
          location: "",
          address: "",
          contactName: "",
          contactPhone: "",
          isFeatured: false,
          features: [],
          images: [],
        };
        setFormData(initial);
        setInitialFormData(initial);
      }
      setTouched({});
      setNewFeatureInput("");
    }
  }, [isOpen, editProperty]);

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
    if (!editProperty || !initialFormData) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData, editProperty]);

  // Validation Logic
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }

    if (!formData.area || Number(formData.area) <= 0) {
      errors.area = "Valid area size is required";
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

  // Disabled Save button logic (matching user's isDisabledRuleSaveBtn)
  const isSaveDisabled = useMemo(() => {
    if (!isValid) return true;
    if (editProperty && !hasFormChanged) return true;
    if (isSubmitting) return true;
    return false;
  }, [isValid, editProperty, hasFormChanged, isSubmitting]);

  // Feature / Amenity toggling
  const toggleFeature = (feat: string) => {
    setFormData((prev) => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== feat)
          : [...prev.features, feat],
      };
    });
  };

  const handleAddCustomFeature = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFeatureInput.trim();
    if (!trimmed) return;
    if (!formData.features.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, trimmed],
      }));
    }
    setNewFeatureInput("");
  };

  // Image Upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      type: formData.type,
      listingType: formData.listingType,
      status: formData.status,
      price: Number(formData.price),
      area: Number(formData.area),
      areaUnit: formData.areaUnit,
      location: formData.location.trim(),
      address: formData.address.trim(),
      contactName: formData.contactName.trim(),
      contactPhone: formData.contactPhone.trim(),
      isFeatured: formData.isFeatured,
      features: formData.features,
      images: formData.images,
    };

    try {
      const url = editProperty?._id
        ? `/api/properties/${editProperty._id}`
        : "/api/properties";
      const method = editProperty?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          editProperty?._id
            ? "Property updated successfully."
            : "Property created successfully."
        );
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save property.");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to submit property form.");
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

      {/* ── MODAL CONTAINER (Matching Vecmocon Split Full-Height Card) ── */}
      <div
        className="relative z-10 w-full max-w-5xl h-full max-h-[92vh] bg-[#FCFCFC] rounded-lg shadow-2xl border border-[#E5E9F0] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <CustomModalHeader
          headerTitle={editProperty ? "Edit Property" : "Create Property"}
          handleCloseModal={() => !isSubmitting && onClose()}
          badgeText={editProperty ? editProperty.status : undefined}
          badgeBgColor={
            editProperty?.status === "active"
              ? "#DAF5ED"
              : editProperty?.status === "sold"
              ? "#FDE9E7"
              : editProperty?.status === "rented"
              ? "#E5EBFD"
              : "#D8DDE7"
          }
          badgeTextColor={
            editProperty?.status === "active"
              ? "#006C4D"
              : editProperty?.status === "sold"
              ? "#D51D10"
              : editProperty?.status === "rented"
              ? "#1249ED"
              : "#565F70"
          }
        />

        {/* ── BODY SPLIT 2-COLUMN VIEW ── */}
        <div className="w-full flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* ── LEFT COLUMN: Core Details ── */}
          <div className="w-full md:w-1/2 lg:w-[480px] h-full border-r border-[#E5E9F0] p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-white">
            <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <MdTune className="text-base text-[#008761]" /> Basic Information
            </h4>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-[#252A34] mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                onBlur={() => handleBlur("title")}
                placeholder="e.g. 100 Gaj Commercial Shop on G.T. Road"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                  touched.title && validationErrors.title
                    ? "border-red-400 focus:border-red-500 bg-red-50/30"
                    : "border-[#D8DDE6] focus:border-[#008761]"
                }`}
              />
              {touched.title && validationErrors.title && (
                <p className="text-[11px] text-red-500 mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#252A34] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Key highlights, surroundings, nearby landmarks..."
                className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                  touched.description && validationErrors.description
                    ? "border-red-400 focus:border-red-500 bg-red-50/30"
                    : "border-[#D8DDE6] focus:border-[#008761]"
                }`}
              />
              {touched.description && validationErrors.description && (
                <p className="text-[11px] text-red-500 mt-0.5">
                  {validationErrors.description}
                </p>
              )}
            </div>

            {/* Purpose Tabs (Sell / Rent / Lease) */}
            <div>
              <label className="block text-xs font-semibold text-[#252A34] mb-1">
                Listing Purpose <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 bg-[#F3F5F8] p-1 rounded-md border border-[#E5E9F0]">
                {LISTING_PURPOSES.map((purpose) => (
                  <button
                    key={purpose.value}
                    type="button"
                    onClick={() => handleChange("listingType", purpose.value)}
                    className={`py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                      formData.listingType === purpose.value
                        ? "bg-white text-[#008761] shadow-xs"
                        : "text-[#555E6F] hover:text-[#252A34]"
                    }`}
                  >
                    For {purpose.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#252A34] mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8DDE6] rounded-md outline-none focus:border-[#008761]"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252A34] mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8DDE6] rounded-md outline-none focus:border-[#008761]"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price (₹) & Formatted Preview */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#252A34]">
                  Asking Price (₹) <span className="text-red-500">*</span>
                </label>
                {formData.price && Number(formData.price) > 0 && (
                  <span className="text-xs font-bold text-[#008761]">
                    ₹{Number(formData.price).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                onBlur={() => handleBlur("price")}
                placeholder="e.g. 2500000"
                className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                  touched.price && validationErrors.price
                    ? "border-red-400 focus:border-red-500 bg-red-50/30"
                    : "border-[#D8DDE6] focus:border-[#008761]"
                }`}
              />
              {touched.price && validationErrors.price && (
                <p className="text-[11px] text-red-500 mt-1">
                  {validationErrors.price}
                </p>
              )}
            </div>

            {/* Area Size & Area Unit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#252A34] mb-1">
                  Area Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                  onBlur={() => handleBlur("area")}
                  placeholder="e.g. 100"
                  className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                    touched.area && validationErrors.area
                      ? "border-red-400 focus:border-red-500 bg-red-50/30"
                      : "border-[#D8DDE6] focus:border-[#008761]"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#252A34] mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.areaUnit}
                  onChange={(e) => handleChange("areaUnit", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D8DDE6] rounded-md outline-none focus:border-[#008761]"
                >
                  {AREA_UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Checkbox Toggle */}
            <div className="pt-2 border-t border-[#E5E9F0]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange("isFeatured", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#008760] focus:ring-[#008760] accent-[#008760] cursor-pointer"
                />
                <span className="text-xs font-semibold text-[#252A34]">
                  Mark as Featured Listing (Promoted on Homepage)
                </span>
              </label>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Location, Contact, Amenities & Images ── */}
          <div className="flex-1 h-full p-5 sm:p-6 overflow-y-auto flex flex-col gap-5 bg-[#FAFAFA]">
            {/* Location & Address */}
            <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border border-[#E5E9F0]">
              <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider flex items-center gap-1.5">
                <MdLocationOn className="text-base text-[#008761]" /> Location &
                Address
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252A34] mb-1">
                    City / Locality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    onBlur={() => handleBlur("location")}
                    placeholder="e.g. GT Road, Junction"
                    className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                      touched.location && validationErrors.location
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-[#D8DDE6] focus:border-[#008761]"
                    }`}
                  />
                  {touched.location && validationErrors.location && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {validationErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252A34] mb-1">
                    Exact Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="e.g. Shop 14, Main Bazaar"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D8DDE6] rounded-md outline-none focus:border-[#008761]"
                  />
                </div>
              </div>
            </div>

            {/* Owner / Contact Details */}
            <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border border-[#E5E9F0]">
              <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider flex items-center gap-1.5">
                <MdPerson className="text-base text-[#008761]" /> Owner / Agent
                Contact
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#252A34] mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) =>
                      handleChange("contactName", e.target.value)
                    }
                    onBlur={() => handleBlur("contactName")}
                    placeholder="e.g. Ramesh Sharma"
                    className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                      touched.contactName && validationErrors.contactName
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-[#D8DDE6] focus:border-[#008761]"
                    }`}
                  />
                  {touched.contactName && validationErrors.contactName && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {validationErrors.contactName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#252A34] mb-1">
                    Contact Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleChange("contactPhone", e.target.value)
                    }
                    onBlur={() => handleBlur("contactPhone")}
                    placeholder="e.g. 9876543210"
                    className={`w-full px-3 py-2 text-sm bg-white border rounded-md outline-none transition-colors ${
                      touched.contactPhone && validationErrors.contactPhone
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-[#D8DDE6] focus:border-[#008761]"
                    }`}
                  />
                  {touched.contactPhone && validationErrors.contactPhone && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {validationErrors.contactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities & Features */}
            <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border border-[#E5E9F0]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider">
                  Features & Amenities
                </h4>
                <span className="text-[11px] text-[#555E6F]">
                  {formData.features.length} selected
                </span>
              </div>

              {/* Suggestions chips */}
              <div className="flex flex-wrap gap-1.5">
                {COMMON_AMENITIES.map((item) => {
                  const isSelected = formData.features.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleFeature(item)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#DAF5ED] border-[#008761] text-[#006C4D] font-semibold"
                          : "bg-[#F3F5F8] border-[#D8DDE6] text-[#555E6F] hover:border-gray-400"
                      }`}
                    >
                      {isSelected && <MdCheck className="text-xs" />}
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* Custom Feature Add Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newFeatureInput}
                  onChange={(e) => setNewFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomFeature(e);
                    }
                  }}
                  placeholder="Add custom feature & press enter..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#D8DDE6] rounded outline-none focus:border-[#008761]"
                />
                <button
                  type="button"
                  onClick={handleAddCustomFeature}
                  className="px-3 py-1.5 bg-[#F3F5F8] hover:bg-[#E5E9F0] border border-[#D8DDE6] text-xs font-semibold text-[#252A34] rounded transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MdAdd className="text-sm" /> Add
                </button>
              </div>
            </div>

            {/* Photos & Images Upload */}
            <div className="flex flex-col gap-3 bg-white p-4 rounded-lg border border-[#E5E9F0]">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#252A34] uppercase tracking-wider flex items-center gap-1.5">
                  <MdPhotoLibrary className="text-base text-[#008761]" /> Property
                  Images ({formData.images.length})
                </h4>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-xs font-semibold text-[#008761] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <MdCloudUpload className="text-sm" /> Upload Images
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />

              {/* Drag/Drop Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#D8DDE6] hover:border-[#008761] rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-center bg-[#FBFBFB] hover:bg-emerald-50/20 transition-all cursor-pointer"
              >
                <MdCloudUpload className="text-3xl text-gray-400" />
                <div>
                  <p className="text-xs font-semibold text-[#252A34]">
                    Click to browse or drop images here
                  </p>
                  <p className="text-[11px] text-[#555E6F]">
                    Supports JPG, PNG, WEBP (Max 5MB each)
                  </p>
                </div>
                {isUploading && (
                  <div className="flex items-center gap-2 text-xs text-[#008761] font-semibold mt-1">
                    <div className="w-3.5 h-3.5 border-2 border-[#008761] border-t-transparent rounded-full animate-spin" />
                    Uploading photos...
                  </div>
                )}
              </div>

              {/* Uploaded Thumbnails Grid */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-2">
                  {formData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-4/3 rounded-md overflow-hidden bg-gray-100 border border-[#E5E9F0]"
                    >
                      <Image
                        src={img}
                        alt={`property-${idx}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remove image"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                      >
                        <MdDeleteOutline className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MODAL FOOTER (Matching user's exact buttons) ── */}
        <div className="p-4 px-6 border-t border-[#E5E9F0] flex items-center justify-end gap-3 w-full bg-[#FCFCFC] shrink-0">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-5 py-2.5 rounded-md bg-[#F3F5F8] border border-[#D8DDE6] text-[#252A34] hover:bg-[#E5E9F0] transition-colors text-sm font-medium cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaveDisabled}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-md bg-[#008760] text-white hover:bg-[#006C4D] transition-colors text-sm font-semibold cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {editProperty ? "Saving..." : "Creating..."}
              </>
            ) : editProperty ? (
              "Save"
            ) : (
              "Create"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
