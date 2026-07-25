"use client";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useZonePricing } from "@/hooks/useZonePricing";
import { ProductCard } from "@/components/product/ProductCard";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";

const VALID: Category[] = ["beer", "whisky", "wine", "vodka", "rum", "gin"];

const LABELS: Record<string, string> = {
  beer: "🍺 Beer", whisky: "🥃 Whisky", wine: "🍷 Wine", vodka: "🍸 Vodka", rum: "🥃 Rum", gin: "🍹 Gin",
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const category = VALID.includes(slug as Category) ? (slug as Category) : undefined;
  const { data: products, isLoading } = useZonePricing(category ?? "all");

  if (!category) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">Category not found.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>Browse all</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button onClick={() => router.push("/")} className="flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={18} /> Home
      </button>

      <h1 className="text-xl font-extrabold text-dark">{LABELS[category]}</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="py-12 text-center text-muted">No {category} available in your zone right now.</p>
      )}
    </div>
  );
}
