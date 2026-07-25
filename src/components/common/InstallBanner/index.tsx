"use client";
import React, { useState, useEffect } from "react";
import { FaMobileAlt } from "react-icons/fa";

export default function InstallBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("install-banner-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("install-banner-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-md bg-white border border-neutral-200 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center border border-[var(--primary)]/30 shrink-0 text-[var(--primary)]">
          <FaMobileAlt className="text-lg" />
        </div>
        <div className="text-left">
          <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Khurja Deals App
          </h5>
          <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed">
            Install for instant alerts and faster browsing of local deals.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            alert("App installation started! (This replicates adding the shortcut or PWA on your home screen)");
            handleDismiss();
          }}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-neutral-400 hover:text-neutral-600 p-1 text-sm cursor-pointer"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
