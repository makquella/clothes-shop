import { useState, useEffect } from "react";
import { useProductStore } from "@/store/productStore";
import { formatPrice } from "@/data/products";
import { motion } from "framer-motion";

export function AdminPage() {
  const { products, isLoading, fetchProducts, archiveProduct, toggleProductStock, adminMetrics, resetCmsState } = useProductStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Intentional demo gate for portfolio review. This is not production authentication.
    if (password === "decon2024" || password === "admin") setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center p-4 bg-bg-primary absolute inset-0 z-50"
      >
        <form onSubmit={handleLogin} className="glass-card p-8 w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-display text-2xl font-black text-neon-blue tracking-widest">DECON // OS</h1>
            <p className="text-xs text-text-muted uppercase tracking-widest">Demo Admin Access</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Demo-only access for portfolio review. This is not production authentication.
            </p>
          </div>
          <input 
            type="password" 
            placeholder="ENTER PASSCODE" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input-glass w-full text-center tracking-[0.5em] py-4 text-xl"
          />
          <button type="submit" className="btn-neon w-full py-4 uppercase tracking-widest font-black">Authenticate</button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 md:p-12 min-h-dvh bg-bg-primary absolute inset-0 z-50 overflow-y-auto">
      <header className="mb-10 flex justify-between items-end border-b border-white/10 pb-6 relative z-10">
        <div>
          <h1 className="font-display text-3xl font-black text-neon-blue">DECON // OS</h1>
          <p className="text-text-muted text-sm tracking-widest uppercase mt-1">Local Prototype Dashboard</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <p className="text-neon-red font-mono text-xs inline-flex items-center gap-2 px-3 py-1 bg-neon-red/10 rounded-full border border-neon-red/20 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse" /> DEMO MODE
          </p>
          <div className="flex gap-4">
            <button onClick={() => resetCmsState()} className="text-xs text-text-muted hover:text-neon-red transition-colors underline underline-offset-4">Reset Prototype State</button>
            <button onClick={() => setIsAuthenticated(false)} className="text-xs text-text-muted hover:text-white transition-colors underline underline-offset-4">Logout</button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
        <div className="glass-card p-6">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2 font-semibold">Total Revenue (24h)</p>
          <p className="font-display text-4xl text-white drop-shadow-md">{formatPrice(adminMetrics.revenue)}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2 font-semibold">Pending Orders</p>
          <p className="font-display text-4xl text-neon-blue drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">{adminMetrics.pendingOrders}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-text-muted text-xs uppercase tracking-widest mb-2 font-semibold">Active Products</p>
          <p className="font-display text-4xl text-white">{products.length}</p>
        </div>
      </div>

      <div className="glass-elevated rounded-2xl overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-xs uppercase tracking-wider text-text-muted">
                <th className="p-5 font-medium">Product ID</th>
                <th className="p-5 font-medium">Name</th>
                <th className="p-5 font-medium">Price</th>
                <th className="p-5 font-medium">Stock Status</th>
                <th className="p-5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-5 font-mono text-xs text-text-secondary">{p.id}</td>
                  <td className="p-5 font-medium">{p.name}</td>
                  <td className="p-5 text-neon-blue font-semibold">{formatPrice(p.price)}</td>
                  <td className="p-5">
                    <button 
                      onClick={() => toggleProductStock(p.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-widest transition-colors ${p.inStock ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/40'}`}
                    >
                      {p.inStock ? "IN STOCK" : "SOLD OUT"}
                    </button>
                  </td>
                  <td className="p-5 text-right space-x-4">
                    <button 
                      onClick={() => archiveProduct(p.id)}
                      className="text-xs text-neon-red/60 hover:text-neon-red transition-colors uppercase tracking-widest font-semibold"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && <div className="p-10 text-center font-display font-medium text-neon-blue tracking-widest uppercase animate-pulse">Syncing Core Catalog...</div>}
      </div>
    </motion.div>
  );
}
