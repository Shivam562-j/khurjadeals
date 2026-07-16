import React from "react";
import Link from "next/link";
import { SERVICES } from "@/constants/services";
import Container from "@/components/layout/Container";

export default function Services() {
  return (
    <section className="py-20 bg-neutral-950">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Our Offerings
          </span>
          <h2 className="text-3xl font-black text-white">
            Services We Provide
          </h2>
          <p className="text-sm text-neutral-450">
            We offer professional services to help you make informed decisions in the local Khurja market.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv) => (
            <div
              key={srv.id}
              className="bg-neutral-900 border border-neutral-850 p-6 rounded-2xl space-y-4 hover:border-neutral-750 transition-all shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-950 flex items-center justify-center text-2xl shadow border border-neutral-800 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300 select-none">
                {srv.icon}
              </div>
              <h3 className="font-bold text-white text-base">
                {srv.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {srv.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
