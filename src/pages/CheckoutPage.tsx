import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/data/products";
import type { CheckoutFormData } from "@/types";
import { AutocompleteInput } from "@/components/AutocompleteInput";
import { MOCK_CITIES, MOCK_BRANCHES } from "@/data/locations";

const initialForm: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  deliveryMethod: "nova_poshta",
  city: "",
  street: "",
  houseNumber: "",
  novaPoshtaBranch: "",
  paymentMethod: "liqpay",
  notes: "",
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = getTotal();

  useEffect(() => {
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

  // Redirect if cart is empty and not submitted
  useEffect(() => {
    if (items.length === 0 && !submitted) {
      navigate("/cart");
    }
  }, [items.length, navigate, submitted]);

  const updateField = <K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[\d+\-() ]{7,15}$/.test(form.phone.trim()))
      newErrors.phone = "Invalid phone number";
      
    if (!form.city.trim()) newErrors.city = "City is required";

    if (form.deliveryMethod === "nova_poshta" && !form.novaPoshtaBranch?.trim()) {
      newErrors.novaPoshtaBranch = "Select a branch";
    }
    
    if (form.deliveryMethod === "address") {
      if (!form.street?.trim()) newErrors.street = "Street is required";
      if (!form.houseNumber?.trim()) newErrors.houseNumber = "House Number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // In production: send to bot via Telegram.WebApp.sendData()
    const orderData = {
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        size: i.selectedSize,
        qty: i.quantity,
        price: i.product.price,
      })),
      total,
      customer: form,
    };

    try {
      window.Telegram?.WebApp?.sendData(JSON.stringify(orderData));
    } catch {
      console.log("Order data:", orderData);
    }

    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
    } catch {
      // no-op
    }

    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-7xl mb-6"
        >
          ✓
        </motion.div>
        <h1 className="font-display font-black text-3xl mb-3">
          Order Placed
        </h1>
        <p className="text-text-secondary text-sm mb-8 max-w-[280px]">
          We'll contact you shortly to confirm your order details and arrange
          payment.
        </p>
        <button
          onClick={() => navigate("/")}
          className="btn-neon px-8 py-3"
        >
          Back to Shop
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 pt-6 pb-28"
    >
      {/* Back button (browser) */}
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 flex items-center justify-center rounded-full glass-card-sm mb-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <h1 className="font-display font-black text-3xl mb-6">Checkout</h1>

      <div className="space-y-4">
        {/* Contact */}
        <div className="glass-card-sm p-5 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted font-semibold">
            Contact Info
          </h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className="input-glass w-full"
              />
              <span className="absolute top-4 right-4 text-neon-red font-black pointer-events-none drop-shadow-[0_0_8px_rgba(115,19,19,0.8)] leading-none text-lg">*</span>
              <FieldError error={errors.firstName} />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className="input-glass w-full"
              />
              <span className="absolute top-4 right-4 text-neon-red font-black pointer-events-none drop-shadow-[0_0_8px_rgba(115,19,19,0.8)] leading-none text-lg">*</span>
              <FieldError error={errors.lastName} />
            </div>
          </div>
          <div className="relative">
            <input
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="input-glass w-full"
            />
            <span className="absolute top-4 right-4 text-neon-red font-black pointer-events-none drop-shadow-[0_0_8px_rgba(115,19,19,0.8)] leading-none text-lg">*</span>
            <FieldError error={errors.phone} />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email for receipt (optional)"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="input-glass w-full"
            />
            <FieldError error={errors.email} />
          </div>
        </div>

        {/* Delivery */}
        <div className="glass-card-sm p-5 space-y-4 relative z-20">
          <h2 className="text-xs uppercase tracking-wider text-text-muted font-semibold">
            Delivery
          </h2>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateField("deliveryMethod", "nova_poshta")}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                form.deliveryMethod === "nova_poshta"
                  ? "bg-neon-blue text-black"
                  : "bg-white/5 text-text-secondary border border-white/10"
              }`}
            >
              Nova Poshta
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateField("deliveryMethod", "address")}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                form.deliveryMethod === "address"
                  ? "bg-neon-blue text-black"
                  : "bg-white/5 text-text-secondary border border-white/10"
              }`}
            >
              Address
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={form.deliveryMethod}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-1"
            >
              <div>
                <AutocompleteInput
                  placeholder="City (e.g., Kyiv)"
                  value={form.city}
                  onChange={(val) => updateField("city", val)}
                  options={MOCK_CITIES}
                  required
                />
                <FieldError error={errors.city} />
              </div>

              {form.deliveryMethod === "nova_poshta" ? (
                <div>
                  <AutocompleteInput
                    placeholder="Nova Poshta Branch"
                    value={form.novaPoshtaBranch || ""}
                    onChange={(val) => updateField("novaPoshtaBranch", val)}
                    options={MOCK_BRANCHES[form.city] || []}
                    disabled={!form.city}
                    required
                  />
                  <FieldError error={errors.novaPoshtaBranch} />
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="flex-2 relative">
                    <input
                      type="text"
                      placeholder="Street"
                      value={form.street || ""}
                      onChange={(e) => updateField("street", e.target.value)}
                      className="input-glass w-full"
                    />
                    <span className="absolute top-4 right-4 text-neon-red font-black pointer-events-none drop-shadow-[0_0_8px_rgba(115,19,19,0.8)] leading-none text-lg">*</span>
                    <FieldError error={errors.street} />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="House"
                      value={form.houseNumber || ""}
                      onChange={(e) => updateField("houseNumber", e.target.value)}
                      className="input-glass w-full"
                    />
                    <span className="absolute top-4 right-4 text-neon-red font-black pointer-events-none drop-shadow-[0_0_8px_rgba(115,19,19,0.8)] leading-none text-lg">*</span>
                    <FieldError error={errors.houseNumber} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Payment */}
        <div className="glass-card-sm p-5 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted font-semibold">
            Payment
          </h2>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateField("paymentMethod", "liqpay")}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                form.paymentMethod === "liqpay"
                  ? "bg-neon-blue text-black"
                  : "bg-white/5 text-text-secondary border border-white/10"
              }`}
            >
              💳 LiqPay
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateField("paymentMethod", "stars")}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                form.paymentMethod === "stars"
                  ? "bg-neon-blue text-black"
                  : "bg-white/5 text-text-secondary border border-white/10"
              }`}
            >
              ⭐ Telegram Stars
            </motion.button>
          </div>
          <textarea
            placeholder="Order notes (optional)"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            className="input-glass resize-none"
          />
        </div>

        {/* Order Summary */}
        <div className="glass-elevated p-5 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted font-semibold">
            Order Summary
          </h2>
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}`}
              className="flex justify-between text-sm"
            >
              <span className="text-text-secondary truncate flex-1 mr-2">
                {item.product.name} ({item.selectedSize}) ×{item.quantity}
              </span>
              <span className="text-text-primary font-semibold whitespace-nowrap">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-3 flex justify-between">
            <span className="text-text-secondary font-medium">Total</span>
            <span className="font-display font-black text-xl text-neon-blue">
              {formatPrice(total)}
            </span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="btn-neon w-full py-4 text-base"
          >
            Place Order — {formatPrice(total)}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-neon-red text-xs mt-1.5 ml-1"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
