"use client";

import React, { useState, useEffect, useMemo } from "react";
import { User, UserRole, UserStatus } from "@/types/user";
import CustomModalHeader from "../Modal/CustomModalHeader";
import {
  MdCheck,
  MdPerson,
  MdEmail,
  MdLock,
  MdShield,
  MdSecurity,
} from "react-icons/md";
import { toast } from "react-toastify";

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUser?: User | null;
  onSuccess: () => void;
}

const ROLE_OPTIONS: { label: string; value: UserRole; desc: string }[] = [
  {
    label: "Administrator",
    value: "admin",
    desc: "Full system access including user management and analytics",
  },
  {
    label: "Moderator",
    value: "moderator",
    desc: "Can manage property and bazaar listings, and customer queries",
  },
];

const STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function CreateUserModal({
  isOpen,
  onClose,
  editUser,
  onSuccess,
}: CreateUserModalProps) {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "moderator" as UserRole,
    status: "active" as UserStatus,
  });

  const [initialFormData, setInitialFormData] = useState<typeof formData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Prefill in Edit case or reset in Create case
  useEffect(() => {
    if (isOpen) {
      if (editUser && editUser._id) {
        const initial = {
          name: editUser.name || "",
          email: editUser.email || "",
          password: "",
          role: editUser.role || "moderator",
          status: editUser.status || "active",
        };
        setFormData(initial);
        setInitialFormData(initial);
      } else {
        const initial = {
          name: "",
          email: "",
          password: "",
          role: "moderator" as UserRole,
          status: "active" as UserStatus,
        };
        setFormData(initial);
        setInitialFormData(initial);
      }
      setTouched({});
    }
  }, [isOpen, editUser]);

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
    if (!editUser || !initialFormData) return true;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData, editUser]);

  // Validation Logic
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = "Enter a valid email address";
    }

    if (!editUser) {
      if (!formData.password) {
        errors.password = "Password is required for new user";
      } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    } else {
      if (formData.password && formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }

    return errors;
  }, [formData, editUser]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Disabled Save button logic
  const isSaveDisabled = useMemo(() => {
    if (!isValid) return true;
    if (editUser && !hasFormChanged) return true;
    if (isSubmitting) return true;
    return false;
  }, [isValid, editUser, hasFormChanged, isSubmitting]);

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    const payload: any = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      status: formData.status,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      const url = editUser?._id ? `/api/users/${editUser._id}` : "/api/users";
      const method = editUser?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(
          editUser?._id
            ? "Administrator updated successfully."
            : "Administrator created successfully."
        );
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save administrator.");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to submit administrator form.");
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
          headerTitle={editUser ? "Edit Administrator" : "New Administrator"}
          handleCloseModal={() => !isSubmitting && onClose()}
          badgeText={editUser ? editUser.role : undefined}
          badgeBgColor={
            editUser?.role === "admin"
              ? "#2a170d"
              : "#161b2e"
          }
          badgeTextColor={
            editUser?.role === "admin"
              ? "#f59e0b"
              : "#60a5fa"
          }
        />

        {/* ── BODY SPLIT 2-COLUMN VIEW ── */}
        <div className="w-full flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* ── LEFT COLUMN: User Credentials ── */}
          <div className="w-full md:w-1/2 h-full border-r border-[#262626] p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#141414]">
            <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <MdPerson className="text-base text-[#e8590c]" /> User Credentials
            </h4>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Full Name <span className="text-[#f87171]">*</span>
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
                  placeholder="e.g. Rahul Sharma"
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

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Email Address <span className="text-[#f87171]">*</span>
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
                  placeholder="admin@khurjadeals.com"
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                {editUser ? "Change Password (Optional)" : "Password"} <span className="text-[#f87171]">{editUser ? "" : "*"}</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-[#737373]">
                  <MdLock className="text-sm" />
                </span>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder={editUser ? "Leave blank to keep unchanged" : "At least 6 characters"}
                  className={`w-full pl-8 pr-3 py-2 text-sm bg-[#0d0d0d] text-white border rounded-lg outline-none transition-colors placeholder-[#737373] ${
                    touched.password && validationErrors.password
                      ? "border-[#ef4444] focus:border-[#ef4444] bg-[#2d1212]/30"
                      : "border-[#333333] focus:border-[#e8590c] focus:ring-1 focus:ring-[#e8590c]/30"
                  }`}
                />
              </div>
              {touched.password && validationErrors.password && (
                <p className="text-[11px] text-[#f87171] mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Role & Status ── */}
          <div className="w-full md:w-1/2 h-full p-5 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-[#171717]">
            <h4 className="text-xs font-bold text-[#ffffff] uppercase tracking-wider flex items-center gap-1.5 mb-0.5">
              <MdShield className="text-base text-[#e8590c]" /> Role & Permissions
            </h4>

            {/* Role Radio Cards */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-2">
                System Role <span className="text-[#f87171]">*</span>
              </label>
              <div className="flex flex-col gap-2.5">
                {ROLE_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    onClick={() => handleChange("role", opt.value)}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      formData.role === opt.value
                        ? "border-[#e8590c] bg-[#2a170d] ring-1 ring-[#e8590c]/40"
                        : "border-[#333333] bg-[#0d0d0d] hover:bg-[#1f1f1f]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={opt.value}
                      checked={formData.role === opt.value}
                      onChange={() => {}}
                      className="mt-0.5 text-[#e8590c] focus:ring-[#e8590c] accent-[#e8590c]"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-white block">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-[#a3a3a3] block mt-0.5 leading-tight">
                        {opt.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#d4d4d4] mb-1">
                Account Status <span className="text-[#f87171]">*</span>
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
              : editUser
              ? "Update Administrator"
              : "Create Administrator"}
          </button>
        </div>
      </div>
    </div>
  );
}
