import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { BottomNav } from "./BottomNav";

export function Layout() {
  const location = useLocation();
  const hideNav = location.pathname === "/checkout";

  useEffect(() => {
    // Fix Telegram Theme / Overscroll Colors
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.setHeaderColor("#0a0a0a");
      tg.setBackgroundColor("#0a0a0a");
      tg.expand();
    }
  }, []);

  return (
    <div className="page-container relative overflow-hidden min-h-screen bg-transparent">
      <div className="bg-aurora" />
      {/* SVG Refraction Filter (global) */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="refraction">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <main className="relative">
        <Outlet />
      </main>

      {!hideNav && <BottomNav />}
    </div>
  );
}
