import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product";
import Container from "@/components/layout/Container";
import ProductDetails from "@/components/product/ProductDetails";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // Fetch product and increment views
  const product = await getProductBySlug(slug, true);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-12 bg-neutral-950">
      <Container>
        <ProductDetails product={product} />
      </Container>
    </div>
  );
}
