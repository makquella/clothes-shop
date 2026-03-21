import { create } from "zustand";
import type { Style } from "@/types";
import { PRICE_MIN, PRICE_MAX } from "@/data/products";

interface FilterStore {
  selectedSizes: string[];
  selectedStyles: Style[];
  priceRange: [number, number];
  toggleSize: (size: string) => void;
  toggleStyle: (style: Style) => void;
  setPriceRange: (range: [number, number]) => void;
  resetFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  selectedSizes: [],
  selectedStyles: [],
  priceRange: [PRICE_MIN, PRICE_MAX],

  toggleSize: (size) => {
    set((state) => ({
      selectedSizes: state.selectedSizes.includes(size)
        ? state.selectedSizes.filter((s) => s !== size)
        : [...state.selectedSizes, size],
    }));
  },

  toggleStyle: (style) => {
    set((state) => ({
      selectedStyles: state.selectedStyles.includes(style)
        ? state.selectedStyles.filter((s) => s !== style)
        : [...state.selectedStyles, style],
    }));
  },

  setPriceRange: (range) => set({ priceRange: range }),

  resetFilters: () =>
    set({
      selectedSizes: [],
      selectedStyles: [],
      priceRange: [PRICE_MIN, PRICE_MAX],
    }),

  hasActiveFilters: () => {
    const state = get();
    return (
      state.selectedSizes.length > 0 ||
      state.selectedStyles.length > 0 ||
      state.priceRange[0] > PRICE_MIN ||
      state.priceRange[1] < PRICE_MAX
    );
  },
}));
