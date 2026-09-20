"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Query, QueryType, QueryStatus } from "@/types/query";
import CustomModalHeader from "../Modal/CustomModalHeader";
import {
  MdCheck,
  MdPerson,
  MdPhone,
  MdEmail,
  MdTune,
  MdOutlineMessage,
} from "react-icons/md";
import { toast } from "react-toastify";

export interface CreateQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editQuery?: Query | null;
  onSuccess: () => void;
}

const QUERY_TYPES: { label: string; value: QueryType }[] = [
  { label: "Property Enquiry", value: "property" },
  { label: "Product Enquiry", value: "product" },
  { label: "General Support", value: "general" },
];

const STATUS_OPTIONS: { label: string; value: QueryStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "Contacted", value: "contacted" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

export default function CreateQueryModal({
  isOpen,
  onClose,
  editQuery,
  onSuccess,
}: CreateQueryModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "general" as QueryType,
    status: "pending" as QueryStatus,
    message: "",
    referenceId: "",
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Prefill in Edit case or reset in Create case
  useEffect(() => {
    if (isOpen) {
      if (editQuery && editQuery._id) {
        const initial = {
          name: editQuery.name || "",
          phone: editQuery.phone || "",
          email: editQuery.email || "",
          type: editQuery.type || "general",
          status: editQuery.status || "pending",
          message: editQuery.message || "",
          referenceId: editQuery.referenceId || "",
        };
        setFormData(initial);
        setInitialFormData(initial);
      } else {
        const initial = {
          name: "",
          phone: "",
          email: "",
          type: "general" as QueryType,
          status: "pending" as QueryStatus,
          message: "",
          referenceId: "",
        };
        setFormData(initial);
        setInitialFormData(initial);
      }
      setTouched({});
    }
  }, [isOpen, editQuery]);

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
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Check if form changed (for edit mode save button enable/disable)
  const hasFormChanged = useMemo(() => {
    if (!editQuery || !initialFormData) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData, editQuery]);

  // Validation Logic
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Customer name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (cleanPhone.length < 10) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Enter a valid email address";
      }
    }

    if (!formData.message.trim()) {
      errors.message = "Enquiry message is required";
    }

    return errors;
  }, [formData]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Disabled Save button logic
  const isSaveDisabled = useMemo(() => {
    if (!isValid) return true;
    if (editQuery && !hasFormChanged) return true;
    if (isSubmitting) return true;
    return false;
  }, [isValid, editQuery, hasFormChanged, isSubmitting]);

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      type: formData.type,
      status: formData.status,
      message: formData.message.trim(),
      referenceId: formData.referenceId.trim() || undefined,
    };

    try {
      const url = editQuery?._id
        ? `/api/queries/${editQuery._id}`
        : "/api/queries";
      const method = editQuery?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          editQuery?._id
            ? "Inquiry updated successfully."
            : "Inquiry created successfully."
        );
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save inquiry.");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to submit inquiry form.");
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
        className="relative z-10 w-full max-w-4xl h-full max-h-[85vh] bg-[#171717] rounded-xl shadow-2xl border border-[#2e2e2e] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <CustomModalHeader
          headerTitle={editQuery ? "Edit Customer Query" : "New Customer Query"}
          handleCloseModal={() => !isSubmitting && onClose()}
          badgeText={editQuery ? editQuery.status : undefined}
          badgeBgColor={
            editQuery?.status === "resolved"
              ? "#0a2e1d"
              : editQuery?.status === "contacted"
              ? "#2e1d09"
              : editQuery?.status === "pending"
              ? "#2d1212"
              : "#222222"
          }
          badgeTextColor={
            editQuery?.status === "resolved"
              ? "#34d399"
              : editQuery?.status === "contacted"
              ? "#fbbf24"
              : editQuery?.status === "pending"
              ? "#f87171"
              : "#a3a3a3"
          }
        />

        {/* ── BODY SPLIT 2-COLUMN VIEW ── */}
        <div className="w-full flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* ── LEFT COLUMN: User Details & Type ── */}
          <div className="w-full md:w-1/2 h-full border-r border-[#262626] p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#141414]">
            <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <MdPerson className="text-base text-[#e8590c]" /> Customer Details
            </h4>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Customer Name <span className="text-[#f87171]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#737373]">
                  <MdPerson className="text-sm" />
                </span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full pl-8 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                    touched.name && validationErrors.name
                      ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                      : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                  }`}
                />
              </div>
              {touched.name && validationErrors.name && (
                <p className="text-[11px] text-[#f87171] mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Phone Number */}
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
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="10-digit mobile number"
                  className={`w-full pl-8 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                    touched.phone && validationErrors.phone
                      ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                      : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                  }`}
                />
              </div>
              {touched.phone && validationErrors.phone && (
                <p className="text-[11px] text-[#f87171] mt-1">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Email Address <span className="text-[#737373] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#737373]">
                  <MdEmail className="text-sm" />
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="e.g. customer@example.com"
                  className={`w-full pl-8 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                    touched.email && validationErrors.email
                      ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                      : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                  }`}
                />
              </div>
              {touched.email && validationErrors.email && (
                <p className="text-[11px] text-[#f87171] mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Enquiry Type & Status */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                  Enquiry Type <span className="text-[#f87171]">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border border-[#333333] rounded-lg outline-none focus:border-[#e8590c] cursor-pointer"
                >
                  {QUERY_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-[#171717] text-white">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                  Status <span className="text-[#f87171]">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
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
          </div>

          {/* ── RIGHT COLUMN: Message & Reference ── */}
          <div className="w-full md:w-1/2 h-full p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#171717]">
            <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <MdOutlineMessage className="text-base text-[#e8590c]" /> Message Content
            </h4>

            {/* Message Body */}
            <div className="flex-1 flex flex-col min-h-[140px]">
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Enquiry Details / Notes <span className="text-[#f87171]">*</span>
              </label>
              <textarea
                rows={7}
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="Inquiry text, customer requirements, property/product inquiry context, lead notes..."
                className={`w-full flex-1 px-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                  touched.message && validationErrors.message
                    ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                    : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                }`}
              />
              {touched.message && validationErrors.message && (
                <p className="text-[11px] text-[#f87171] mt-1">
                  {validationErrors.message}
                </p>
              )}
            </div>

            {/* Reference ID */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Related Reference ID <span className="text-[#737373] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.referenceId}
                onChange={(e) => handleChange("referenceId", e.target.value)}
                placeholder="Property or Product ID (if applicable)"
                className="w-full px-3 py-2 text-sm bg-[#0d0d0d] text-white border border-[#333333] rounded-lg outline-none focus:border-[#e8590c] placeholder-[#737373]"
              />
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
              : editQuery
              ? "Update Query"
              : "Create Query"}
          </button>
        </div>
      </div>
    </div>
  );
}
