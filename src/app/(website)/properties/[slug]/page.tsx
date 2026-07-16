import React from "react";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/services/property";
import Container from "@/components/layout/Container";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyDetails from "@/components/property/PropertyDetails";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;

  // Fetch property and increment view count
  const property = await getPropertyBySlug(slug, true);

  if (!property) {
    notFound();
  }

  return (
    <div className="py-12 bg-neutral-950">
      <Container className="space-y-8">
        {/* Gallery */}
        <PropertyGallery images={property.images} />

        {/* Details & Inquiry Form */}
        <PropertyDetails property={property} />
      </Container>
    </div>
  );
}
