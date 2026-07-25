"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { MOCK_PRODUCTS } from "@/lib/mock";
import type { Product } from "@/types";
import { useZoneStore } from "@/store/zoneStore";

export function useProduct(productId: string) {
  const zone = useZoneStore((s) => s.zone);
  return useQuery({
    queryKey: ["product", productId, zone.slug],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Product> => {
      try {
        const { data } = await api.get<Product>(`/catalog/products/${productId}`, {
          params: { zone: zone.slug },
        });
        return data;
      } catch {
        const found = (MOCK_PRODUCTS[zone.slug] ?? MOCK_PRODUCTS["delhi"] ?? []).find(
          (p) => p.id === productId,
        );
        if (!found) throw new Error("Product not available");
        return found;
      }
    },
  });
}
