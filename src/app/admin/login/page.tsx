"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaArrowRight,
  FaExclamationTriangle,
  FaArrowLeft,
} from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if session is already active
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          router.push("/admin/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 16px",
        background: "radial-gradient(circle at 50% 30%, #1f140e 0%, #0d0d0d 70%)",
        color: "#ffffff",
        position: "relative",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px", position: "relative", zIndex: 10 }}>
        {/* Top Header Navigation Strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              fontWeight: 600,
              color: "#a3a3a3",
              textDecoration: "none",
            }}
          >
            <FaArrowLeft style={{ fontSize: "11px" }} />
            Back to KhurjaDeals
          </Link>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "999px",
              background: "#262626",
              border: "1px solid #404040",
              fontSize: "12px",
              fontWeight: 600,
              color: "#f59e0b",
            }}
          >
            <FaShieldAlt style={{ fontSize: "12px" }} />
            <span>Admin Portal</span>
          </div>
        </div>

        {/* Main Card Box */}
        <div
          style={{
            background: "#171717",
            border: "1.5px solid #2e2e2e",
            borderRadius: "24px",
            padding: "36px 28px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7)",
          }}
        >
          {/* Brand Logo & Header */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #e8590c, #f59e0b)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "22px",
                marginBottom: "14px",
                boxShadow: "0 8px 24px rgba(232, 89, 12, 0.35)",
                position: "relative",
              }}
            >
              KD
            </div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 800,
                color: "#ffffff",
                margin: "0 0 6px 0",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "#a3a3a3",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              Sign in with your admin credentials to manage Khurja marketplace properties &amp; products.
            </p>
          </div>

          {/* Alert Error Box */}
          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 16px",
                borderRadius: "12px",
                background: "rgba(127, 29, 29, 0.5)",
                border: "1px solid #991b1b",
                color: "#fca5a5",
                fontSize: "13px",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                lineHeight: "1.4",
              }}
            >
              <FaExclamationTriangle style={{ fontSize: "16px", marginTop: "2px", shrink: 0, color: "#ef4444" }} />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="admin-email"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#d4d4d4",
                  marginBottom: "8px",
                }}
              >
                Email Address <span style={{ color: "#e8590c" }}>*</span>
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    color: "#e8590c",
                    fontSize: "14px",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaEnvelope />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@khurjadeals.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    height: "50px",
                    paddingLeft: "48px",
                    paddingRight: "16px",
                    background: "#0d0d0d",
                    border: "1.5px solid #333333",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#ffffff",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#e8590c";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 89, 12, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#333333";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#d4d4d4",
                  marginBottom: "8px",
                }}
              >
                Password <span style={{ color: "#e8590c" }}>*</span>
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    color: "#e8590c",
                    fontSize: "14px",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaLock />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    height: "50px",
                    paddingLeft: "48px",
                    paddingRight: "48px",
                    background: "#0d0d0d",
                    border: "1.5px solid #333333",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#ffffff",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#e8590c";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(232, 89, 12, 0.25)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#333333";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    padding: "8px",
                    background: "transparent",
                    border: "none",
                    color: "#a3a3a3",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash style={{ fontSize: "16px" }} /> : <FaEye style={{ fontSize: "16px" }} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: "50px",
                marginTop: "8px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #e8590c 0%, #f59e0b 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 6px 20px rgba(232, 89, 12, 0.4)",
                opacity: isLoading ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? (
                <>
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2px solid #ffffff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <FaArrowRight style={{ fontSize: "13px" }} />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #262626",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                color: "#737373",
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <FaShieldAlt style={{ color: "#10b981", fontSize: "13px" }} />
              <span>Protected by 256-bit encrypted authentication</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
