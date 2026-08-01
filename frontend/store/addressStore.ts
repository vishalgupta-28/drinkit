import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/types";

interface AddressState {
  address: Address | null;
  setAddress: (a: Address) => void;
  clear: () => void;
}

// Saved home delivery address. Persisted so it's remembered next order.
export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: null,
      setAddress: (address) => set({ address }),
      clear: () => set({ address: null }),
    }),
    { name: "drinkit-address", skipHydration: true },
  ),
);
