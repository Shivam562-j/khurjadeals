import React from "react";
import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — KhurjaDeals",
  description:
    "Read the Privacy Policy of KhurjaDeals. Understand how we collect, use, protect, and manage your personal data under the DPDP Act 2023 and IT Act 2000.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
