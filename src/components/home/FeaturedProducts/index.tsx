"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { FaStore, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import ProductCard from "@/components/product/ProductCard";
import SwitchTabs from "@/components/common/SwitchTabs";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const carouselContainer = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All Bazaar");

  if (!products?.length) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (carouselContainer.current) {
      carouselContainer.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter((prod) => {
    if (activeTab === "Pottery Ceramics") {
      return (
        prod.category?.toLowerCase().includes("pottery") ||
        prod.category?.toLowerCase().includes("ceramic")
      );
    }
    if (activeTab === "Vehicles & Tech") {
      return (
        prod.category?.toLowerCase().includes("vehicle") ||
        prod.category?.toLowerCase().includes("electronics") ||
        prod.category?.toLowerCase().includes("mobile")
      );
    }
    return true;
  });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  const navigation = (dir: "left" | "right") => {
    const container = carouselContainer.current;
    if (!container) return;
    const firstChild = container.children[0] as HTMLElement;
    const cardStep = firstChild ? firstChild.getBoundingClientRect().width + 20 : 340;
    container.scrollTo({
      left: dir === "left" ? container.scrollLeft - cardStep : container.scrollLeft + cardStep,
      behavior: "smooth",
    });
  };

  return (
    <section className="section-alt-light">
      <div className="container">
        {/* ── Row 1: Title left, View All right ── */}
        <div className="sec-carousel-head">
          <div>
            <div className="eyebrow-sm">
              <FaStore />
              <span>Khurja Local Marketplace</span>
            </div>
            <h2 className="h2" style={{ margin: 0, marginTop: 6 }}>Featured Products &amp; Pottery</h2>
          </div>
          <Link href="/products" className="btn btn-outline sec-viewall-btn">
            <span>View All</span>
            <FaArrowRight style={{ fontSize: "0.7rem" }} />
          </Link>
        </div>

        {/* Description */}
        <p className="sec-carousel-desc">
          Second-hand electronics, vehicles &amp; world-famous Khurja ceramic handicrafts
        </p>

        {/* ── Row 2: Tabs left, Arrows right ── */}
        <div className="sec-carousel-controls">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <SwitchTabs
              data={["All Bazaar", "Pottery Ceramics", "Vehicles & Tech"]}
              onTabChange={handleTabChange}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => navigation("left")} className="carousel-nav-btn" aria-label="Previous">
              <FaChevronLeft style={{ fontSize: "0.8rem" }} />
            </button>
            <button onClick={() => navigation("right")} className="carousel-nav-btn" aria-label="Next">
              <FaChevronRight style={{ fontSize: "0.8rem" }} />
            </button>
          </div>
        </div>

        {/* Carousel Track: 3 cards on desktop */}
        <div className="relative">
          <div ref={carouselContainer} className="carousel-track">
            {displayProducts.map((product) => (
              <div key={product._id} className="carousel-item sec-card-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
