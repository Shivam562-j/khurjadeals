import React from "react";
import { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms and Conditions - KhurjaDeals",
  description:
    "Read the Terms and Conditions of KhurjaDeals. Understand our status as an intermediary, listing guidelines, user safety, and terms of service for our local directory.",
};

export default function TermsPage() {
  return <TermsContent />;
}
