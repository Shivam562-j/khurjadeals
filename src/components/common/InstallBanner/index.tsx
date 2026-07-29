"use client";
import React, { useState } from "react";
import { FaTimes, FaDownload } from "react-icons/fa";

export default function InstallBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="install-app-banner" aria-label="Install Khurja Deals App">
      <div className="install-banner-content">
        <div className="install-banner-icon">
          <img src="/logos/logo.webp" alt="KD App" className="w-full h-full object-contain" />
        </div>
        <div className="install-banner-text">
          <h6>Khurja Deals App</h6>
          <p>Install for instant alerts &amp; faster browsing of local deals.</p>
        </div>
      </div>

      <div className="install-banner-actions">
        <button
          onClick={() => {
            alert("App shortcut added to your home screen!");
            handleDismiss();
          }}
          className="install-btn"
        >
          <FaDownload style={{ fontSize: "0.7rem" }} />
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="install-close-btn"
          aria-label="Dismiss banner"
        >
          <FaTimes />
        </button>
      </div>
    </aside>
  );
}
