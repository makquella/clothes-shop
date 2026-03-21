import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router";
import { useRef, useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/data/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();
  const isOdd = index % 2 !== 0;
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className={`glass-card cursor-pointer overflow-hidden group ${
        isOdd ? "rotate-slight-right" : ""
      }`}
      style={{
        marginTop: isOdd ? "20px" : "0px",
      }}
    >
      {/* Image Area */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: isOdd ? "3/4" : "4/5" }}
      >
        {!imageLoaded && <div className="frosted-loader z-10" />}
        <motion.img
          src={product.imageUrls[0]}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
          decoding="async"
          style={{ y, scale: 1.03, willChange: "transform" }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-90 group-hover:opacity-100 group-hover:scale-[1.08]" : "opacity-0"
          }`}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, transparent 0%, transparent 60%, #0a0a0a 100%)`,
          }}
        />
        {/* Style badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.styles.slice(0, 2).map((style) => (
            <span
              key={style}
              className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-lg bg-black/60 backdrop-blur-sm text-white/80 border border-white/10"
            >
              {style}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-display font-bold text-[15px] text-text-primary leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-neon-blue font-bold text-lg">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-text-muted uppercase tracking-wider">
            {product.sizes.length} sizes
          </span>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}
