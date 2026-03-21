import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function ManifestoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 1]);

  useEffect(() => {
    // Add a dark overriding theme strictly for Manifesto page to enforce total blackout
    document.body.style.backgroundColor = "#000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-transparent text-white relative px-4 pt-20 pb-32 overflow-hidden selection:bg-white selection:text-black">
      {/* Background kinetic grid */}
      <div className="fixed inset-0 pointer-events-none opacity-20 xray-grid z-0" />

      <motion.div style={{ y: y1 }} className="sticky top-20 z-10 w-full max-w-2xl mx-auto space-y-20">
        
        <motion.h1 style={{ opacity: opacityText }} className="font-display font-black text-6xl leading-[0.8] uppercase tracking-tighter">
          Deconstruct<br/>
          <motion.span 
            animate={{ skewX: [-12, -15, -12, -10, -12] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-neon-blue inline-block transform"
          >
            System
          </motion.span>
        </motion.h1>

        <div className="space-y-6 text-sm md:text-base font-medium text-white/70 max-w-md ml-auto border-l border-white/20 pl-6">
          <p>We reject the pristine. We reject the factory standard. Perfection is an illusion sold to the masses.</p>
          <p className="text-white font-bold">Beauty lies in the raw edge.</p>
        </div>

      </motion.div>

      <motion.div style={{ y: y2 }} className="relative z-10 w-full max-w-2xl mx-auto mt-[40vh] space-y-20">
        
        <h2 className="font-display font-black text-5xl leading-none text-right">
          ANTI<br/><span className="text-neon-red">GARDE</span>
        </h2>

        <div className="space-y-6 text-sm md:text-base font-medium text-white/70 max-w-md border-r border-white/20 pr-6 text-right">
          <p>Every garment is an artifact of destruction. A piece of history torn down and rebuilt for the brutal modern context.</p>
          <p className="text-white font-bold blur-[0.5px]">Do not wash. Do not conform.</p>
        </div>

      </motion.div>
      
      {/* Distorted overlay text */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center mix-blend-difference overflow-hidden">
        <h1 
          className="font-display font-black text-[150px] md:text-[250px] opacity-20 rotate-90 select-none whitespace-nowrap glitch-text" 
          data-text="VOID"
        >
          VOID
        </h1>
      </div>
    </div>
  );
}
