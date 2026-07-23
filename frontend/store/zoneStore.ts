import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Zone } from "@/types";
import { ZONES } from "@/lib/mock";

interface ZoneState {
  zone: Zone;
  shopName: string;
  setZone: (zone: Zone) => void;
  setShopName: (name: string) => void;
}

export const useZoneStore = create<ZoneState>()(
  persist(
    (set) => ({
      zone: ZONES[0],
      shopName: "Sharma Wines",
      setZone: (zone) => set({ zone }),
      setShopName: (shopName) => set({ shopName }),
    }),
    { name: "drinkit-zone", skipHydration: true },
  ),
);
