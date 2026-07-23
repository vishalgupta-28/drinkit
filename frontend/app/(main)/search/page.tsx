"use client";
import { useMemo, useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useZonePricing } from "@/hooks/useZonePricing";
import { ProductCard } from "@/components/product/ProductCard";
import { useZoneStore } from "@/store/zoneStore";

export default function SearchPage() {
  const [q, setQ] = useState("");
  const { data: products, isLoading } = useZonePricing("all");
  const zone = useZoneStore((s) => s.zone);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products ?? [];
    return (products ?? []).filter((p) =>
      [p.name, p.brand, p.category, p.pairs_with].some((f) =>
        (f ?? "").toLowerCase().includes(term),
      ),
    );
  }, [q, products]);

  return (
    <div className="space-y-4">
      <div className="glass glass-sheen sticky top-[92px] z-20 flex items-center gap-2 rounded-xl2 px-3 py-2">
        <SearchIcon size={18} className="text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search drinks in ${zone.name}…`}
          className="w-full bg-transparent py-1 text-sm outline-none"
        />
        {q && (
          <button onClick={() => setQ("")} aria-label="Clear">
            <X size={16} className="text-muted" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="py-16 text-center text-muted">
          <div className="text-4xl">🔍</div>
          <p className="mt-2 text-sm">No drinks match “{q}”.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
