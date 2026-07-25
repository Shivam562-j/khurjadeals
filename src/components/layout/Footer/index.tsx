"use client";
import React from "react";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { SITE_CONFIG } from "@/constants/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Left: Logo + Description + Social Icons */}
          <div className="footer-brand-col">
            <Link className="brand flex items-center gap-2.5" href="/">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-gradient)] text-white font-black text-lg flex items-center justify-center shadow-lg">
                KD
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Khurja<span className="text-[var(--primary)]">Deals</span>
              </span>
            </Link>
            <p className="footer-about">
              Khurja&apos;s premier local marketplace and real estate directory. Buy, sell, and rent properties, used bikes, cars, EVs, laptops, mobiles &amp; home appliances directly with verified local owners.
            </p>

            {/* Social Icons Row - YouTube, Instagram, Facebook only */}
            <div className="footer-socials">
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-social-icon facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={SITE_CONFIG.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-icon instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={SITE_CONFIG.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="footer-social-icon youtube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/how-it-works">How It Works</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Col 3 — Explore & Transact */}
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link href="/properties">Properties</Link></li>
              <li><Link href="/products">Products Bazaar</Link></li>
              <li><Link href="/submit-query">Submit Ad Query</Link></li>
              <li><Link href="/contact">Contact Support</Link></li>
            </ul>
          </div>

          {/* Col 4 — Contact Info */}
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
