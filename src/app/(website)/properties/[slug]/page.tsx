import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaArrowLeft, FaChevronRight, FaHome } from "react-icons/fa";
import { getPropertyBySlug } from "@/services/property";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyDetails from "@/components/property/PropertyDetails";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug).catch(() => null);
  return {
    title: property ? `${property.title} — KhurjaDeals` : "Property Details — KhurjaDeals",
    description: property?.description?.slice(0, 160) || "View property details, price, location, and seller contact on KhurjaDeals.",
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug, true);

  if (!property) notFound();

  return (
    <section className="section-light" style={{ paddingTop: "calc(var(--header-h) + 32px)", paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--text-muted)" }}>
              <FaHome style={{ fontSize: "0.8rem" }} /> Home
            </Link>
            <FaChevronRight style={{ fontSize: "0.65rem", opacity: 0.5 }} />
            <Link href="/properties" style={{ color: "var(--text-muted)" }}>
              Properties
            </Link>
            <FaChevronRight style={{ fontSize: "0.65rem", opacity: 0.5 }} />
            <span style={{ color: "var(--primary)", fontWeight: 600 }} className="truncate max-w-[200px] sm:max-w-[400px]">
              {property.title}
            </span>
          </div>

          <Link
            href="/properties"
            className="btn btn-outline"
            style={{ padding: "6px 14px", fontSize: "0.825rem", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FaArrowLeft style={{ fontSize: "0.75rem" }} /> Back to Properties
          </Link>
        </div>

        {/* Gallery */}
        <div style={{ marginBottom: 32 }}>
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* Details & Inquiry Form */}
        <PropertyDetails property={property} />
      </div>
    </section>
  );
}
