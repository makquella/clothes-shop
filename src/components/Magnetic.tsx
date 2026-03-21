import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

export function Magnetic({ children, strength = 40 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center and apply strength
    // This creates a "pull" toward the mouse
    x.set((clientX - centerX) * (strength / 100));
    y.set((clientY - centerY) * (strength / 100));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className="inline-block w-full"
    >
      {children}
    </motion.div>
  );
}
