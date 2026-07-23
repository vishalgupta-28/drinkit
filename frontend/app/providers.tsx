"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useZoneStore } from "@/store/zoneStore";
import { useCartStore } from "@/store/cartStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { useUserStore } from "@/store/userStore";

/**
 * Stores use `skipHydration: true` so the server and the client's first paint
 * both render from default state (no hydration mismatch). We rehydrate from
 * localStorage here, after mount, on the client only.
 */
function useStoreHydration() {
  useEffect(() => {
    useZoneStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
    useRewardsStore.persist.rehydrate();
    useUserStore.persist.rehydrate();
  }, []);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false } },
      }),
  );
  useStoreHydration();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
