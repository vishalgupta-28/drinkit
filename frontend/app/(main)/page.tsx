"use client";
import { useState } from "react";
import { HappyHourBanner } from "@/components/home/HappyHourBanner";
import { HeroBanner } from "@/components/home/HeroBanner";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { CategoryChips } from "@/components/home/CategoryChips";
import { ProductCard } from "@/components/product/ProductCard";
import { useZonePricing } from "@/hooks/useZonePricing";
import type { Category } from "@/types";

const OCCASIONS = ["🎂 Birthday", "🎉 House Party", "🌙 Date Night", "🏏 Match Night", "🛋️ Chill", "💼 Office"];

export default function HomePage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const { data: products, isLoading } = useZonePricing(category);

  return (
    <div className="space-y-5">
      <HappyHourBanner />
      <HeroBanner />
      <FeatureStrip />

      {/* Occasions */}
      <div>
        <h3 className="mb-2 text-sm font-bold text-dark">Shop by occasion</h3>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {OCCASIONS.map((o) => (
            <button key={o} className="shrink-0 rounded border border-gray-200 bg-card px-3 py-2 text-sm font-medium">
              {o}
            </button>
          ))}
        </div>
      </div>

      <div id="products" className="scroll-mt-24">
        <CategoryChips active={category} onChange={setCategory} />
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products?.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
