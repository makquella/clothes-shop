import { motion } from "framer-motion";

export function Marquee() {
  const text = "ARCHIVE COLLECTION /// DECONSTRUCTED FORMAT /// NEW ARRIVALS /// Y2K /// YOHJI /// RICK /// ";
  
  return (
    <div className="w-[200vw] -ml-[50vw] overflow-hidden whitespace-nowrap bg-white text-black font-display font-black py-3 mt-16 mb-24 transform -rotate-3 scale-105 border-y-4 border-black z-20 relative mix-blend-screen isolate">
      {/* Repeating content for seamless loop */}
      <motion.div
        className="inline-block"
        animate={{ x: [0, -1035] }} // Adjust based on text width to make it seamless
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        <span className="text-base sm:text-lg tracking-[0.2em] px-4">{text}</span>
        <span className="text-base sm:text-lg tracking-[0.2em] px-4">{text}</span>
        <span className="text-base sm:text-lg tracking-[0.2em] px-4">{text}</span>
        <span className="text-base sm:text-lg tracking-[0.2em] px-4">{text}</span>
      </motion.div>
    </div>
  );
}
