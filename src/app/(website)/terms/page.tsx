import React from "react";
import Container from "@/components/layout/Container";
import { SITE_CONFIG } from "@/constants/site";

export default function TermsPage() {
  return (
    <div className="py-16 bg-neutral-950">
      <Container className="max-w-3xl space-y-8 leading-relaxed text-neutral-300">
        <h1 className="text-3xl font-black text-white">Terms of Use</h1>
        <p className="text-sm text-neutral-400">Last updated: July 2026</p>

        <section className="space-y-4 text-sm">
          <p>
            Welcome to {SITE_CONFIG.name}. By accessing our website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
          <h3 className="text-lg font-bold text-white mt-6">1. Acceptance of Terms</h3>
          <p>
            The services that {SITE_CONFIG.name} provides to you are subject to the following Terms of Use. We reserve the right to update these terms at any time without notice to you.
          </p>
          <h3 className="text-lg font-bold text-white mt-6">2. Use of Marketplace</h3>
          <p>
            You agree to provide true, accurate, and current information when posting property or product inquiries. You may not list illegal, offensive, or counterfeit products. Property listings must belong to you or you must have appropriate broker authorization.
          </p>
          <h3 className="text-lg font-bold text-white mt-6">3. Disclaimer of Liability</h3>
          <p>
            {SITE_CONFIG.name} acts as a listing directory. We do not own or inspect physical properties or items unless explicitly marked. We are not responsible for transactions or agreements made between buyers and sellers. Users must verify all documents before purchasing real estate.
          </p>
        </section>
      </Container>
    </div>
  );
}
