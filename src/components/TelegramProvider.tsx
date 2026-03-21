import { useEffect, useState, type ReactNode } from "react";

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor("#0a0a0a");
        tg.setBackgroundColor("#0a0a0a");

        if (tg.themeParams) {
          document.documentElement.style.setProperty(
            "--tg-theme-bg-color",
            tg.themeParams.bg_color ?? "#0a0a0a"
          );
        }

        // Prevent swipe-to-close on modern TG clients (creates native full-screen feel)
        try {
          if (tg.disableVerticalSwipes) {
            tg.disableVerticalSwipes();
          }
        } catch (err) {
          console.warn("disableVerticalSwipes not supported");
        }
      }
    } catch (e) {
      console.warn("Telegram WebApp SDK not available, running in dev mode", e);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

// Telegram WebApp type augmentation
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          setText: (text: string) => void;
          setParams: (params: Record<string, unknown>) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        initData: string;
        initDataUnsafe: Record<string, unknown>;
        colorScheme: "light" | "dark";
        viewportHeight: number;
        viewportStableHeight: number;
        isExpanded: boolean;
        disableVerticalSwipes?: () => void;
        sendData: (data: string) => void;
        showAlert: (message: string) => void;
        showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
        HapticFeedback: {
          impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
          notificationOccurred: (type: "error" | "success" | "warning") => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}
