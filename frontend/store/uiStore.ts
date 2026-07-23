import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

// Lets the navbar cart button and the CartSheet share one open/close state.
export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
}));
