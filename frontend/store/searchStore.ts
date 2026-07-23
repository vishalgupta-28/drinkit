import { create } from "zustand";

interface SearchState {
  query: string;
  setQuery: (q: string) => void;
}

// Shared so the navbar search box and the /search page stay in sync.
export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
