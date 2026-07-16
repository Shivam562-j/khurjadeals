import React from "react";
import Link from "next/link";
import { SERVICES } from "@/constants/services";
import Container from "@/components/layout/Container";

export default function ServicesPage() {
  return (
    <div className="py-16 bg-neutral-950">
      <Container className="space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Our Offerings
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Professional Services in Khurja
          </h1>
          <p className="text-sm text-neutral-450">
            We provide specialized local services for buyer verification, listings posting, valuation consultations, and property registration assistance.
          </p>
        </div>

        {/* Detailed services cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-neutral-900 border border-neutral-850 p-8 rounded-2xl space-y-6 hover:border-neutral-750 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-3xl shadow group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300 select-none">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-bold text-white leading-tight">
                  {srv.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-850 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                  Verified Local Support
                </span>
                <Link
                  href="/submit-query"
                  className="text-xs font-bold text-[var(--primary)] hover:text-white transition-colors flex items-center gap-1"
                >
                  Request Service
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center space-y-6 max-w-3xl mx-auto shadow-xl">
          <h3 className="text-xl font-bold text-white">
            Need customized service or custom consulting?
          </h3>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Reach out to our representative directly on WhatsApp or dial our help number. We offer free consultation for property buyers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+917906896546"
              className="px-5 py-2.5 bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-white rounded-lg text-sm font-semibold transition-all"
            >
              📞 Call: +91 79068 96546
            </a>
            <a
              href="https://wa.me/917906896546"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)] text-white rounded-lg text-sm font-semibold transition-all"
            >
              💬 Chat WhatsApp
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
