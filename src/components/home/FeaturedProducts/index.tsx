"use client";
import React, { useRef, useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState("All Used Items");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!products?.length) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (carouselContainer.current) {
      carouselContainer.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const filteredProducts = products.filter((prod) => {
    if (activeTab === "Bikes & Cars") {
      return (
        prod.category?.toLowerCase().includes("vehicle") ||
        prod.category?.toLowerCase().includes("bike") ||
        prod.category?.toLowerCase().includes("car")
      );
    }
    if (activeTab === "Electronics & Mobiles") {
      return (
        prod.category?.toLowerCase().includes("electronics") ||
        prod.category?.toLowerCase().includes("mobile") ||
        prod.category?.toLowerCase().includes("phone") ||
        prod.category?.toLowerCase().includes("laptop")
      );
    }
    if (activeTab === "Home Appliances") {
      return (
        prod.category?.toLowerCase().includes("appliance") ||
        prod.category?.toLowerCase().includes("fridge") ||
        prod.category?.toLowerCase().includes("ac") ||
        prod.category?.toLowerCase().includes("cooler") ||
        prod.category?.toLowerCase().includes("washing")
      );
    }
    if (activeTab === "Electric Vehicles") {
      return (
        prod.category?.toLowerCase().includes("electric") ||
        prod.category?.toLowerCase().includes("ev") ||
        prod.title?.toLowerCase().includes("electric") ||
        prod.title?.toLowerCase().includes(" ev ")
      );
    }
    return true;
  });

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  const checkScrollState = () => {
    const container = carouselContainer.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScrollState();
    const container = carouselContainer.current;
    if (container) {
      container.addEventListener("scroll", checkScrollState);
      window.addEventListener("resize", checkScrollState);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollState);
      }
      window.removeEventListener("resize", checkScrollState);
    };
  }, [displayProducts]);

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
        {/* Row 1: Title left, View All right */}
        <div className="sec-carousel-head">
          <div>
            <div className="eyebrow-sm">
              <FaStore />
              <span>Khurja Local Marketplace</span>
            </div>
            <h2 className="h2" style={{ margin: 0, marginTop: 6 }}>Used Products &amp; Vehicles</h2>
          </div>
          <Link href="/products" className="btn btn-outline sec-viewall-btn">
            <span>View All</span>
            <FaArrowRight style={{ fontSize: "0.7rem" }} />
          </Link>
        </div>

        {/* Description */}
        <p className="sec-carousel-desc">
          Used bikes, cars, EVs, laptops, mobiles, fridge, AC, cooler &amp; washing machines in Khurja
        </p>

        {/* Row 2: Tabs left, Arrow buttons strictly side-by-side in 1 row on right */}
        <div className="sec-carousel-controls">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <SwitchTabs
              data={["All Used Items", "Bikes & Cars", "Electronics & Mobiles", "Home Appliances", "Electric Vehicles"]}
              onTabChange={handleTabChange}
            />
          </div>
          <div className="carousel-arrow-row">
            <button
              onClick={() => navigation("left")}
              disabled={!canScrollLeft}
              className="carousel-nav-btn"
              aria-label="Previous Product"
            >
              <FaChevronLeft style={{ fontSize: "0.8rem" }} />
            </button>
            <button
              onClick={() => navigation("right")}
              disabled={!canScrollRight}
              className="carousel-nav-btn"
              aria-label="Next Product"
            >
              <FaChevronRight style={{ fontSize: "0.8rem" }} />
            </button>
          </div>
        </div>

        {/* Carousel Track for 10 Products */}
        <div className="relative">
          <div ref={carouselContainer} className="carousel-track" onScroll={checkScrollState}>
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
