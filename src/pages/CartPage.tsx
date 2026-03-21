import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/data/products";
import { Magnetic } from "@/components/Magnetic";

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  const total = getTotal();
  const isEmpty = items.length === 0;

  return (
    <div className="px-4 pt-6 pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="font-display font-black text-3xl">Cart</h1>
          <p className="text-text-muted text-sm mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!isEmpty && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearCart}
            className="text-xs text-neon-red font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            Clear all
          </motion.button>
        )}
      </motion.div>

      {/* Items */}
      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 space-y-4"
        >
          <div className="text-6xl">🕳️</div>
          <p className="text-text-muted font-display text-lg">
            Your cart is empty
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-neon text-sm px-6 py-3"
          >
            Explore Collection
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100, transition: { duration: 0.25 } }}
                className="glass-card-sm p-4 flex gap-4"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 rounded-xl flex-shrink-0 overflow-hidden relative bg-transparent">
                  <img
                    src={item.product.imageUrls[0]}
                    alt={item.product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    style={{
                      WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                      maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, transparent 60%, #0a0a0a 100%)`,
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-sm leading-tight line-clamp-2 text-text-primary">
                      {item.product.name}
                    </h3>
                    <p className="text-text-muted text-xs mt-1">
                      Size: {item.selectedSize}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-neon-blue font-bold text-sm">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.quantity - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 transition-colors text-lg"
                      >
                        −
                      </motion.button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.quantity + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-text-secondary hover:bg-white/10 transition-colors text-lg"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() =>
                    removeItem(item.product.id, item.selectedSize)
                  }
                  className="self-start w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-neon-red hover:bg-white/5 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Total & Checkout */}
          <motion.div
            layout
            className="glass-elevated p-5 mt-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Total</span>
              <span className="font-display font-black text-2xl text-text-primary glitch-text" data-text={formatPrice(total)}>
                {formatPrice(total)}
              </span>
            </div>
            <Magnetic strength={20}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/checkout")}
                className="btn-neon w-full py-4 text-base"
              >
                Proceed to Checkout
              </motion.button>
            </Magnetic>
          </motion.div>
        </div>
      )}
    </div>
  );
}
