"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaDownload, FaTimes, FaShareSquare } from "react-icons/fa";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 hours in ms

export default function InstallBanner() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register PWA Service Worker (Public website only)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("PWA Service Worker registered successfully."))
        .catch((err) => console.log("PWA Service Worker registration failed:", err));
    }

    // 2. Agar already phone me installed hai toh nahi aayega:
    // (a) LocalStorage check
    const isAlreadyInstalledStorage = localStorage.getItem("khurjadeals_app_installed") === "true";
    if (isAlreadyInstalledStorage) return;

    // (b) Display mode standalone check (Android / Desktop PWA)
    const isStandaloneDisplay = window.matchMedia("(display-mode: standalone)").matches;
    // (c) iOS Safari standalone check
    const isIOSStandalone = (window.navigator as any).standalone === true;
    // (d) Android TWA / WebAPK referrer check
    const isFromAppReferrer = document.referrer?.startsWith("android-app://");

    if (isStandaloneDisplay || isIOSStandalone || isFromAppReferrer) {
      localStorage.setItem("khurjadeals_app_installed", "true");
      return;
    }

    // (e) getInstalledRelatedApps check (if browser supports it)
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any)
        .getInstalledRelatedApps()
        .then((relatedApps: any[]) => {
          if (relatedApps && relatedApps.length > 0) {
            localStorage.setItem("khurjadeals_app_installed", "true");
            setShowBanner(false);
          }
        })
        .catch(() => {});
    }

    // 3. Check if user dismissed banner within 2 hours
    const dismissed = localStorage.getItem("khurjadeals_install_dismissed");
    if (dismissed && Date.now() - Number(dismissed) < TWO_HOURS_MS) {
      // 2 hours tak dobara nahi aayega
      return;
    }

    // 4. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);

    if (isIosDevice) {
      setIsIOS(true);
      setShowBanner(true);
      return;
    }

    // 5. Capture beforeinstallprompt for Android Chrome / Edge / Samsung Internet
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // 6. Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log("KhurjaDeals App successfully installed.");
      localStorage.setItem("khurjadeals_app_installed", "true");
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (!deferredPrompt) return;

    // Trigger native browser install dialog ("Add to Home Screen")
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the KhurjaDeals PWA installation.");
      localStorage.setItem("khurjadeals_app_installed", "true");
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSModal(false);
    // User ne close kiya to 2 hours ke liye timestamp save karo
    localStorage.setItem("khurjadeals_install_dismissed", String(Date.now()));
  };

  // Puri website me sirf aur sirf Home page ("/") par hi aayega
  if (pathname !== "/" || !showBanner) return null;

  return (
    <>
      {/* Floating Bottom PWA Install Banner */}
      <div className="install-app-banner fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:w-96 z-50 p-4 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-orange-500/30 shadow-2xl shadow-orange-500/10 transition-all duration-300 animate-slide-up">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl bg-orange-500/10 p-1 flex-shrink-0 border border-orange-500/20">
              <Image
                src="/logos/logo.webp"
                alt="KhurjaDeals App Icon"
                width={48}
                height={48}
                className="object-contain w-full h-full rounded-lg"
              />
            </div>
            <div className="install-banner-text">
              <h6 className="text-sm font-bold text-white leading-tight">
                Install KhurjaDeals App
              </h6>
              <p className="text-xs text-neutral-400 mt-0.5">
                Add to phone home screen for instant access!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-500 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <FaDownload className="text-xs" />
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="install-close-btn p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-orange-500/30 rounded-3xl p-6 max-w-sm w-full text-center relative animate-fade-in shadow-2xl">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <FaTimes className="text-base" />
            </button>

            <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-500">
              <FaShareSquare className="text-2xl" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Install on iPhone / iPad
            </h3>
            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              To add KhurjaDeals to your phone home screen:
            </p>

            <ol className="text-left text-xs text-neutral-300 space-y-2 bg-neutral-800/60 p-4 rounded-2xl mb-5 border border-neutral-700">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span>Tap the <strong>Share</strong> button in Safari toolbar.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span>Scroll down and select <strong>"Add to Home Screen"</strong>.</span>
              </li>
            </ol>

            <button
              onClick={handleDismiss}
              className="w-full py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-xl transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
