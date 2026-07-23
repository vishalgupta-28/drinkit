"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MOCK_PRODUCTS } from "@/lib/mock";
import type { Category, Product } from "@/types";
import { useZoneStore } from "@/store/zoneStore";

/**
 * Fetch products priced for the active zone. Falls back to mock data
 * when the backend isn't reachable so the UI always renders.
 */
export function useZonePricing(category?: Category | "all") {
  const zone = useZoneStore((s) => s.zone);

  return useQuery({
    queryKey: ["catalog", zone.slug, category ?? "all"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Product[]> => {
      try {
        const { data } = await api.get<Product[]>("/catalog/products", {
          params: { zone: zone.slug, category: category === "all" ? undefined : category },
        });
        return data;
      } catch {
        const list = MOCK_PRODUCTS[zone.slug] ?? [];
        return category && category !== "all"
          ? list.filter((p) => p.category === category)
          : list;
      }
    },
  });
}
