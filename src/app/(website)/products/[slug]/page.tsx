import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FaArrowLeft, FaChevronRight, FaHome } from "react-icons/fa";
import { getProductBySlug } from "@/services/product";
import ProductDetails from "@/components/product/ProductDetails";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return {
    title: product ? `${product.title} — KhurjaDeals` : "Product Details — KhurjaDeals",
    description: product?.description?.slice(0, 160) || "View product details, price, condition, and seller contact on KhurjaDeals.",
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug, true);

  if (!product) notFound();

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
            <Link href="/products" style={{ color: "var(--text-muted)" }}>
              Products
            </Link>
            <FaChevronRight style={{ fontSize: "0.65rem", opacity: 0.5 }} />
            <span style={{ color: "var(--primary)", fontWeight: 600 }} className="truncate max-w-[200px] sm:max-w-[400px]">
              {product.title}
            </span>
          </div>

          <Link
            href="/products"
            className="btn btn-outline"
            style={{ padding: "6px 14px", fontSize: "0.825rem", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FaArrowLeft style={{ fontSize: "0.75rem" }} /> Back to Products
          </Link>
        </div>

        {/* Product Details Component */}
        <ProductDetails product={product} />
      </div>
    </section>
  );
}
