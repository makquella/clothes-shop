import { BrowserRouter, Routes, Route } from "react-router";
import { AnimatePresence } from "framer-motion";
import { TelegramProvider } from "@/components/TelegramProvider";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { ManifestoPage } from "@/pages/ManifestoPage";
import { AdminPage } from "@/pages/AdminPage";
import { CustomCursor } from "@/components/CustomCursor";

export default function App() {
  return (
    <TelegramProvider>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="manifesto" element={<ManifestoPage />} />
            </Route>
            <Route path="admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
        <CustomCursor />
      </BrowserRouter>
    </TelegramProvider>
  );
}
