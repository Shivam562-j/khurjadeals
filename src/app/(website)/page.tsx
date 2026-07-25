import React from "react";
import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Services from "@/components/home/Services";
import HomeFaq from "@/components/home/Faq";
import CTA from "@/components/home/CTA";
import { getProperties } from "@/services/property";
import { getProducts } from "@/services/product";

// Set dynamic runtime so it reads updated database listings on every reload
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch featured items
  const { properties } = await getProperties({ limit: 3 }).catch(() => ({ properties: [] }));
  const { products } = await getProducts({ limit: 4 }).catch(() => ({ products: [] }));

  return (
    <div className="space-y-0">
      <Hero />
      <FeaturedProperties properties={properties} />
      <FeaturedProducts products={products} />
      <Services />
      <HomeFaq />
      <CTA />
    </div>
  );
}
