import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import { products as fallbackProducts } from "@/data/products";

interface ProductOverrides {
  archivedIds: string[];
  stockOverrides: Record<string, boolean>;
  priceOverrides: Record<string, number>;
  adminMetrics: {
    revenue: number;
    pendingOrders: number;
  };
}

interface ProductState extends ProductOverrides {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  
  fetchProducts: () => Promise<void>;
  addOrderMetric: (orderTotal: number) => void;
  resetCmsState: () => void;
  
  // Admin CMS Actions
  archiveProduct: (id: string) => void;
  toggleProductStock: (id: string) => void;
  updateProductPrice: (id: string, newPrice: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      
      archivedIds: [],
      stockOverrides: {},
      priceOverrides: {},
      adminMetrics: { revenue: 142500, pendingOrders: 14 },

      addOrderMetric: (total) => {
        set((state) => ({
          adminMetrics: {
            revenue: state.adminMetrics.revenue + total,
            pendingOrders: state.adminMetrics.pendingOrders + 1
          }
        }));
      },

      resetCmsState: () => {
        set({
          archivedIds: [],
          stockOverrides: {},
          priceOverrides: {},
          adminMetrics: { revenue: 142500, pendingOrders: 14 }
        });
        get().fetchProducts();
      },

      archiveProduct: (id) => {
        set((state) => ({
          archivedIds: [...state.archivedIds, id],
          products: state.products.filter(p => p.id !== id)
        }));
      },

      toggleProductStock: (id) => {
        set((state) => {
          const currentProduct = state.products.find(p => p.id === id);
          if (!currentProduct) return state;
          
          const newStockStatus = !currentProduct.inStock;
          
          return {
            stockOverrides: { ...state.stockOverrides, [id]: newStockStatus },
            products: state.products.map(p => 
              p.id === id ? { ...p, inStock: newStockStatus } : p
            )
          };
        });
      },

      updateProductPrice: (id, newPrice) => {
        set((state) => ({
          priceOverrides: { ...state.priceOverrides, [id]: newPrice },
          products: state.products.map(p => 
            p.id === id ? { ...p, price: newPrice } : p
          )
        }));
      },

      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        
        let loadedData: Product[] = [];
        try {
          const response = await fetch("/api/products");
          if (!response.ok) throw new Error("Failed to fetch products");
          loadedData = await response.json();
        } catch (error: any) {
          console.error("API Fetch Error:", error);
          loadedData = fallbackProducts;
        }

        // Apply Local-First Admin Overrides onto the fetched master catalog
        const { archivedIds, stockOverrides, priceOverrides } = get();
        
        const mergedProducts = loadedData
          .filter(p => !archivedIds.includes(p.id))
          .map(p => ({
            ...p,
            inStock: stockOverrides[p.id] !== undefined ? (stockOverrides[p.id] as boolean) : p.inStock,
            price: priceOverrides[p.id] !== undefined ? (priceOverrides[p.id] as number) : p.price
          }));

        set({ products: mergedProducts, isLoading: false });
      },
    }),
    {
      name: "decon-cms-storage",
      partialize: (state) => ({
        archivedIds: state.archivedIds,
        stockOverrides: state.stockOverrides,
        priceOverrides: state.priceOverrides,
        adminMetrics: state.adminMetrics
      }) // Persist ONLY the admin overrides, not the heavy products array
    }
  )
);
