import { NavLink } from "react-router";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export function BottomNav() {
  const itemCount = useCartStore((s) => s.getItemCount());

  const navItems = [
    { to: "/", icon: <HomeIcon />, label: "Shop" },
    { to: "/manifesto", icon: <EyeIcon />, label: "Vision" },
    { to: "/cart", icon: <CartIcon />, label: "Cart", badge: itemCount },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      <div className="glass-elevated mx-4 mb-4 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              id={item.to === "/cart" ? "cart-nav-icon" : undefined}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-neon-blue bg-white/6"
                    : "text-text-secondary hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="w-6 h-6">{item.icon}</span>
                  <span className="text-[11px] font-medium">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold bg-neon-red text-white"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-2xl bg-white/4"
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
