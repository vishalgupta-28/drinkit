"use client";
import { useState } from "react";
import { HappyHourBanner } from "@/components/home/HappyHourBanner";
import { CategoryChips } from "@/components/home/CategoryChips";
import { ProductCard } from "@/components/product/ProductCard";
import { useZonePricing } from "@/hooks/useZonePricing";
import { useZoneStore } from "@/store/zoneStore";
import type { Category } from "@/types";

const OCCASIONS = ["🎂 Birthday", "🎉 House Party", "🌙 Date Night", "🏏 Match Night", "🛋️ Chill", "💼 Office"];

export default function HomePage() {
  const [category, setCategory] = useState<Category | "all">("all");
  const { data: products, isLoading } = useZonePricing(category);
  const zone = useZoneStore((s) => s.zone);

  return (
    <div className="space-y-5">
      <HappyHourBanner />

      {/* Hero */}
      <div className="rounded-xl2 bg-gradient-to-r from-primary to-[#0a6b19] p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Flash Deal ⏱ 02:34:17</p>
        <h2 className="mt-1 text-xl font-extrabold">Red Label ₹999 <span className="text-sm font-normal line-through opacity-70">₹1800</span></h2>
        <p className="mt-1 text-sm opacity-90">Prices for {zone.name} · earn 2x points this weekend 🔥</p>
      </div>

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

      <CategoryChips active={category} onChange={setCategory} />

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
