import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  email: string | null;
  name: string;
  ageVerified: boolean;
  isAuthed: () => boolean;
  setSession: (session: { token: string; email: string; name: string }) => void;
  verifyAge: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,
      name: "Guest",
      ageVerified: false,
      isAuthed: () => !!get().token,
      setSession: ({ token, email, name }) => {
        if (typeof window !== "undefined") localStorage.setItem("drinkit_token", token);
        set({ token, email, name });
      },
      verifyAge: () => set({ ageVerified: true }),
      logout: () => {
        if (typeof window !== "undefined") localStorage.removeItem("drinkit_token");
        set({ token: null, email: null, name: "Guest" });
      },
    }),
    { name: "drinkit-user", skipHydration: true },
  ),
);
