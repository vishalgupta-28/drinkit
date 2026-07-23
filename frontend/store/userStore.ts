import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  phone: string | null;
  name: string;
  ageVerified: boolean;
  setUser: (phone: string, name?: string) => void;
  verifyAge: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      phone: null,
      name: "Guest",
      ageVerified: false,
      setUser: (phone, name = "Guest") => set({ phone, name }),
      verifyAge: () => set({ ageVerified: true }),
      logout: () => set({ phone: null, name: "Guest" }),
    }),
    { name: "drinkit-user", skipHydration: true },
  ),
);
