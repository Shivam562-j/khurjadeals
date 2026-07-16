import React from "react";
import Container from "@/components/layout/Container";
import { SITE_CONFIG } from "@/constants/site";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-neutral-950">
      <Container className="max-w-3xl space-y-8 leading-relaxed text-neutral-300">
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-sm text-neutral-400">Last updated: July 2026</p>

        <section className="space-y-4 text-sm">
          <p>
            At {SITE_CONFIG.name}, accessible from {SITE_CONFIG.url}, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {SITE_CONFIG.name} and how we use it.
          </p>
          <h3 className="text-lg font-bold text-white mt-6">1. Information We Collect</h3>
          <p>
            When you submit a contact query, register an account, or send a property/product listing, we collect the personal details you provide to us, including: name, mobile number, email address, and specific details about your requirement.
          </p>
          <h3 className="text-lg font-bold text-white mt-6">2. How We Use Your Information</h3>
          <p>
            We use the information we collect in various ways, including to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Provide, operate, and maintain our local marketplace website.</li>
            <li>Connect buyers and sellers directly.</li>
            <li>Verify property details and reduce duplicate listings.</li>
            <li>Contact you with support details or call responses.</li>
          </ul>
          <h3 className="text-lg font-bold text-white mt-6">3. Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have questions, please reach out to us at {SITE_CONFIG.email}.
          </p>
        </section>
      </Container>
    </div>
  );
}
