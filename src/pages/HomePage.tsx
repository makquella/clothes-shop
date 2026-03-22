import { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ProductCard";
import { FilterBar } from "@/components/FilterBar";
import { Marquee } from "@/components/Marquee";
import { useFilterStore } from "@/store/filterStore";
import { useProductStore } from "@/store/productStore";

export function HomePage() {
  const { selectedSizes, selectedStyles, priceRange } = useFilterStore();
  const { products, isLoading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Size filter
      if (
        selectedSizes.length > 0 &&
        !product.sizes.some((s) => selectedSizes.includes(s))
      ) {
        return false;
      }
      // Style filter
      if (
        selectedStyles.length > 0 &&
        !product.styles.some((s) => selectedStyles.includes(s))
      ) {
        return false;
      }
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    });
  }, [selectedSizes, selectedStyles, priceRange]);

  return (
    <div className="px-4 pt-2 pb-32">
      {/* Hero */}
      <motion.header
        className="pt-6 pb-8"
      >
        <motion.p
          className="text-xs uppercase tracking-[0.3em] text-text-muted font-medium mb-2"
        >
          Avant-Garde Collection
        </motion.p>
        <h1 className="font-display font-black text-[clamp(2.5rem,8vw,4rem)] leading-[0.9] tracking-tight">
          <span className="text-gradient">DECON</span>
          <span className="text-neon-blue">.</span>
        </h1>
        <motion.p
          className="text-text-secondary text-sm mt-3 max-w-[280px] leading-relaxed"
        >
          Deconstructed silhouettes. Ripped archives. Fashion beyond convention.
        </motion.p>
      </motion.header>

      {/* Filters */}
      <div className="mb-8 pl-1">
        <FilterBar />
      </div>

      {/* Kinetic Typography Marquee */}
      <Marquee />

      {/* Product Grid */}
      <AnimatePresence mode="wait">
        {isLoading && products.length === 0 ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center py-20"
          >
            <div className="w-8 h-8 rounded-full border-t-2 border-neon-blue animate-spin" />
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3 items-start"
          >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-text-muted text-lg font-display">
            No pieces match your filters
          </p>
          <button
            onClick={() => useFilterStore.getState().resetFilters()}
            className="mt-4 text-neon-blue text-sm font-medium"
          >
            Reset filters
          </button>
        </motion.div>
        )
        }
      </AnimatePresence>

      {/* Results count */}
      <div className="text-center mt-8 mb-4">
        <p className="text-text-muted text-xs uppercase tracking-wider">
          {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
