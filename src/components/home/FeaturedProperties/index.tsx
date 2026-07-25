"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { FaFire, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import PropertyCard from "@/components/property/PropertyCard";
import SwitchTabs from "@/components/common/SwitchTabs";

interface FeaturedPropertiesProps {
  properties: Property[];
}

export default function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  const carouselContainer = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("All Listings");

  if (!properties?.length) return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (carouselContainer.current) {
      carouselContainer.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const filteredProperties = properties.filter((prop) => {
    if (activeTab === "Sell Plots") return prop.listingType === "sell";
    if (activeTab === "Rent Shops") return prop.listingType === "rent";
    return true;
  });

  const displayListings = filteredProperties.length > 0 ? filteredProperties : properties;

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
    <section className="section-light">
      <div className="container">
        {/* ── Row 1: Title left, View All right ── */}
        <div className="sec-carousel-head">
          <div>
            <div className="eyebrow-sm">
              <FaFire />
              <span>Latest Verified Listings</span>
            </div>
            <h2 className="h2" style={{ margin: 0, marginTop: 6 }}>Featured Properties</h2>
          </div>
          <Link href="/properties" className="btn btn-outline sec-viewall-btn">
            <span>View All</span>
            <FaArrowRight style={{ fontSize: "0.7rem" }} />
          </Link>
        </div>

        {/* Description */}
        <p className="sec-carousel-desc">
          Verified commercial, residential &amp; agricultural plots in Khurja City &amp; GT Road
        </p>

        {/* ── Row 2: Tabs left, Arrows right ── */}
        <div className="sec-carousel-controls">
          <div className="overflow-x-auto pb-1 no-scrollbar">
            <SwitchTabs
              data={["All Listings", "Sell Plots", "Rent Shops"]}
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
            {displayListings.map((property) => (
              <div key={property._id} className="carousel-item sec-card-item">
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
