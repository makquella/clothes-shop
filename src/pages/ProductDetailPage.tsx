import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { products, formatPrice } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { Magnetic } from "@/components/Magnetic";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [isXRay, setIsXRay] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      setIsXRay(true);
      try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('heavy'); } catch {}
    }, 400);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setIsXRay(false);
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  const [flyingNode, setFlyingNode] = useState<{ src: string, startX: number, startY: number, endX: number, endY: number } | null>(null);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    // Telegram BackButton
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      const handler = () => navigate(-1);
      tg.BackButton.onClick(handler);
      return () => {
        tg.BackButton.offClick(handler);
        tg.BackButton.hide();
      };
    }
  }, [navigate]);

  useEffect(() => {
    if (product && product.sizes.length > 0 && !selectedSize) {
      setSelectedSize(product.sizes[0]!);
    }
  }, [product, selectedSize]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-text-muted">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    if (!selectedSize) return;

    // Trigger flying animation
    const btnRect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const cartIcon = document.getElementById("cart-nav-icon");
    if (cartIcon) {
      const targetRect = cartIcon.getBoundingClientRect();
      setFlyingNode({
        src: product.imageUrls[0] || "",
        startX: btnRect.left + btnRect.width / 2 - 30, // center 60px image
        startY: btnRect.top - 80,
        endX: targetRect.left + targetRect.width / 2 - 15,
        endY: targetRect.top + targetRect.height / 2 - 15,
      });
      setTimeout(() => setFlyingNode(null), 800);
    }

    addItem(product, selectedSize);
    setAdded(true);
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
    } catch {
      // no-op in browser
    }
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {flyingNode && (
          <motion.img
            initial={{ x: flyingNode.startX, y: flyingNode.startY, scale: 1, opacity: 1, borderRadius: "16px" }}
            animate={{ x: flyingNode.endX, y: flyingNode.endY, scale: 0.2, opacity: 0.2, borderRadius: "50%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            src={flyingNode.src}
            className="fixed z-10000 w-[60px] h-[80px] object-cover shadow-xl glow-blue pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pb-28"
      >
        {/* Back button (for browser dev) */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-full glass-card-sm"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Hero Image Wrapper */}
      <div 
        className="relative w-full" 
        style={{ 
          height: "72vh",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 85%, transparent 100%)"
        }}
      >
        
        {/* Scrollable Gallery */}
        <div
          className={`absolute inset-0 flex overflow-x-auto touch-pan-x snap-x snap-mandatory bg-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
            isXRay ? "scale-[0.98] transition-all duration-300" : "transition-all duration-500"
          }`}
          onContextMenu={(e) => e.preventDefault()}
          onTouchStart={startPress}
          onTouchEnd={cancelPress}
          onTouchMove={cancelPress}
          onMouseDown={startPress}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.clientWidth;
            const newIndex = Math.round(scrollLeft / width);
            if (newIndex !== activeImage) {
              setActiveImage(newIndex);
              try { window.Telegram?.WebApp?.HapticFeedback?.selectionChanged(); } catch {}
            }
          }}
        >
          {product.imageUrls.map((imgUrl, i) => (
            <div key={i} className="min-w-full h-full shrink-0 snap-start relative overflow-hidden bg-transparent select-none pointer-events-none">
              <img
                draggable={false}
                src={imgUrl}
                alt={`${product.name} view ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                  isXRay ? "invert grayscale contrast-125 opacity-70" : "opacity-90 hover:scale-105"
                }`}
                style={{
                  WebkitMaskImage: `linear-gradient(to bottom, 
                    black 0%, 
                    black 75%, 
                    rgba(0,0,0,0.95) 80%, 
                    rgba(0,0,0,0.85) 85%, 
                    rgba(0,0,0,0.6) 90%, 
                    rgba(0,0,0,0.3) 95%, 
                    transparent 100%),
                    linear-gradient(to right, 
                    transparent 0%, 
                    rgba(0,0,0,0.5) 5%, 
                    black 15%, 
                    black 85%, 
                    rgba(0,0,0,0.5) 95%, 
                    transparent 100%)`,
                  maskImage: `linear-gradient(to bottom, 
                    black 0%, 
                    black 75%, 
                    rgba(0,0,0,0.95) 80%, 
                    rgba(0,0,0,0.85) 85%, 
                    rgba(0,0,0,0.6) 90%, 
                    rgba(0,0,0,0.3) 95%, 
                    transparent 100%),
                    linear-gradient(to right, 
                    transparent 0%, 
                    rgba(0,0,0,0.5) 5%, 
                    black 15%, 
                    black 85%, 
                    rgba(0,0,0,0.5) 95%, 
                    transparent 100%)`,
                  WebkitMaskComposite: 'source-in',
                  maskComposite: 'intersect'
                }}
              />
              <AnimatePresence>
                {isXRay && i === activeImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 pointer-events-none xray-grid z-20 flex flex-col justify-between p-6 pt-20"
                  >
                    <span className="font-mono text-[10px] text-neon-blue font-bold tracking-widest drop-shadow-md">
                      [ANALYSIS: {product.styles[0]}]
                    </span>
                    <span className="font-mono text-[10px] text-neon-blue font-bold tracking-widest text-right drop-shadow-md pb-4">
                      [DATA: {product.id}]
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Style badges (Fixed over images) */}
        <div className="absolute bottom-12 left-5 flex flex-wrap gap-2 z-50 pointer-events-none">
          {product.styles.map((style) => (
            <span
              key={style}
              className="px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-xl bg-black/60 backdrop-blur-md text-white/90 border border-white/20"
            >
              {style}
            </span>
          ))}
        </div>

        {/* Carousel Dots (Fixed over images) */}
        <div className="absolute bottom-12 right-5 flex gap-2 z-50 pointer-events-none">
          {product.imageUrls.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeImage === idx ? "bg-white scale-125" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="px-3 -mt-10 relative z-20">
        <motion.div
           initial={{ y: 30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="p-5 space-y-4 relative z-20"
        >
          <div>
            <h1 className="font-display font-black text-xl leading-tight mb-1">
              {product.name}
            </h1>
            <p className="text-neon-blue font-bold text-2xl glitch-text cursor-default" data-text={formatPrice(product.price)}>
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="text-text-secondary text-xs leading-relaxed line-clamp-2 hover:line-clamp-none transition-all">
            {product.description}
          </p>

          {/* Size selector */}
          <div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedSize(size);
                    try { window.Telegram?.WebApp?.HapticFeedback?.selectionChanged(); } catch {}
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-2xl text-xs font-semibold transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-neon-blue text-black border border-neon-blue"
                      : "bg-white/5 text-text-secondary border border-white/10 hover:border-white/20"
                  }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <Magnetic strength={20}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
                  added
                    ? "bg-[#1a0505] text-[#e8e0d4] border border-[#8a0303] shadow-[0_0_30px_rgba(138,3,3,0.4)]"
                    : "btn-neon"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    ✓ Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Add to Cart — {formatPrice(product.price)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Magnetic>
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}
