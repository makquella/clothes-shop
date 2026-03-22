import { create } from "zustand";
import type { Product } from "@/types";
import { products as fallbackProducts } from "@/data/products"; // Fallback for local testing without server

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    // Prevent refetching if already loaded
    if (get().products.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (error: any) {
      console.error("API Fetch Error:", error);
      // Graceful fallback to static data if the API is unreachable (e.g. standard local dev mode)
      set({ products: fallbackProducts, isLoading: false, error: "Using local mockup data." });
    }
  },
}));
