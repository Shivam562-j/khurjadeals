import React from "react";
import Link from "next/link";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link className="brand flex items-center gap-2.5" href="/">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-gradient)] text-white font-black text-lg flex items-center justify-center shadow-lg">
                KD
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Khurja<span className="text-[var(--primary)]">Deals</span>
              </span>
            </Link>
            <p className="footer-about">
              Khurja&apos;s premier local marketplace and real estate directory. Buy, sell, and rent properties, second-hand items, and world-famous Khurja pottery ceramics directly with verified local owners.
            </p>
          </div>

          <div>
            <h4>Navigation</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/properties">Properties</Link></li>
              <li><Link href="/products">Products Bazaar</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4>Quick Links &amp; Legal</h4>
            <ul>
              <li><Link href="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/submit-query">Submit Ad Query</Link></li>
              <li><Link href="/about">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact Info</h4>
            <ul className="contact">
              <li>
                <FaMapMarkerAlt />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li>
                <FaPhoneAlt />
                <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a>
              </li>
              <li>
                <FaEnvelope />
                <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {currentYear} KhurjaDeals. All rights reserved.</span>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
            <span>&middot;</span>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <span>&middot;</span>
            <Link href="/terms-and-conditions">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
