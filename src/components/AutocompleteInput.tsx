import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
  required?: boolean;
}

export function AutocompleteInput({ placeholder, value, onChange, options, disabled, required }: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        className={`input-glass w-full ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {required && (
        <span className="absolute top-4 right-4 text-neon-red font-black pointer-events-none drop-shadow-[0_0_8px_rgba(115,19,19,0.8)] leading-none text-lg">
          *
        </span>
      )}
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 max-h-60 overflow-y-auto glass-elevated py-2 rounded-2xl border border-white/10 shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {filteredOptions.map((opt, i) => (
              <li
                key={i}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-sm text-text-primary hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0"
              >
                {opt}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
