"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Coins, Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatINR } from "@/lib/utils";

export function CartSheet() {
  const { items, count, subtotal, pointsPreview, add, decrement } = useCartStore();
  const [open, setOpen] = useState(false);
  const n = count();
  if (n === 0) return null;

  const delivery = subtotal() > 999 ? 0 : 29;
  const total = subtotal() + delivery;

  return (
    <>
      {/* Sticky bottom bar */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-16 left-1/2 z-40 flex w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded bg-primary/90 px-4 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md md:bottom-4"
      >
        <span className="flex items-center gap-2">
          <ShoppingCart size={18} /> {n} items · {formatINR(subtotal())}
        </span>
        <span className="flex items-center gap-1 text-gold">
          <Coins size={14} /> +{pointsPreview()} → View Cart
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="glass glass-sheen fixed bottom-0 left-0 right-0 z-50 mx-auto max-h-[85vh] max-w-md overflow-y-auto rounded-t-2xl p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-extrabold">Your Cart</h2>
                <button onClick={() => setOpen(false)}><X size={20} /></button>
              </div>

              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.product.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{i.product.name}</p>
                      <p className="text-xs text-muted">{formatINR(i.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded bg-primary px-2 py-1 text-white">
                      <button onClick={() => decrement(i.product.id)}><Minus size={14} /></button>
                      <span className="w-4 text-center text-sm font-bold">{i.qty}</span>
                      <button onClick={() => add(i.product)}><Plus size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 rounded bg-gold-light p-3 text-sm font-semibold text-dark">
                <Coins size={16} className="text-gold" />
                You&apos;ll earn {pointsPreview()} DrinkPoints on this order
              </div>

              <div className="mt-4 space-y-1.5 border-t pt-3 text-sm">
                <Row label="Subtotal" value={formatINR(subtotal())} />
                <Row label="Delivery" value={delivery === 0 ? "FREE" : formatINR(delivery)} />
                <Row label="Total" value={formatINR(total)} bold />
              </div>

              <button className="mt-4 w-full rounded bg-primary py-3 font-bold text-white active:scale-95">
                Place Order
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-extrabold" : "text-muted"}`}>
      <span>{label}</span>
      <span className={bold ? "text-dark" : ""}>{value}</span>
    </div>
  );
}
