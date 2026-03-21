import { motion, AnimatePresence } from "framer-motion";
import { useFilterStore } from "@/store/filterStore";
import { ALL_SIZES, ALL_STYLES } from "@/data/products";
import type { Style } from "@/types";
import { useState } from "react";

export function FilterBar() {
  const [expanded, setExpanded] = useState(false);
  const {
    selectedSizes,
    selectedStyles,
    toggleSize,
    toggleStyle,
    resetFilters,
    hasActiveFilters,
  } = useFilterStore();

  return (
    <div className="space-y-3">
      {/* Toggle button */}
      <div className="flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setExpanded(!expanded)}
          className="chip flex items-center gap-2"
        >
          <FilterIcon />
          <span>Filters</span>
          {hasActiveFilters() && (
            <span className="w-2 h-2 rounded-full bg-neon-blue" />
          )}
        </motion.button>

        <AnimatePresence>
          {hasActiveFilters() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={resetFilters}
              className="text-xs text-neon-red font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Expandable filter panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="glass-card-sm p-4 space-y-4">
              {/* Size filter */}
              <div>
                <label className="text-xs uppercase tracking-wider text-text-muted font-semibold block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SIZES.map((size) => (
                    <motion.button
                      key={size}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleSize(size)}
                      className={`chip ${
                        selectedSizes.includes(size) ? "chip-active" : ""
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Style filter */}
              <div>
                <label className="text-xs uppercase tracking-wider text-text-muted font-semibold block mb-2">
                  Style
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_STYLES.map((style) => (
                    <motion.button
                      key={style}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleStyle(style as Style)}
                      className={`chip capitalize ${
                        selectedStyles.includes(style as Style) ? "chip-active" : ""
                      }`}
                    >
                      {style}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
