"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

/**
 * Returns true once the persisted user store has finished rehydrating from
 * localStorage. Because stores use `skipHydration` and are rehydrated in the
 * root Provider's effect (which runs AFTER child effects), any component that
 * makes auth-gated decisions (redirects) must wait for this flag — otherwise
 * it reads the default (logged-out) state on first paint.
 */
export function useHydrated(): boolean {
  // Default false on the server (persist API isn't available during prerender).
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persist = useUserStore.persist;
    if (!persist) return;
    const unsub = persist.onFinishHydration(() => setHydrated(true));
    if (persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  return hydrated;
}
