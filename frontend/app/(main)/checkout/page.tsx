"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Smartphone, CreditCard, Wallet, ShieldCheck, Coins } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { useUserStore } from "@/store/userStore";
import { useZoneStore } from "@/store/zoneStore";
import { useToast } from "@/components/shared/Toaster";
import { useHydrated } from "@/hooks/useHydrated";
import { formatINR } from "@/lib/utils";
import { api } from "@/lib/api";
import { processPayment, type PaymentMethod } from "@/lib/payment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const METHODS: { id: PaymentMethod; label: string; hint: string; Icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", Icon: Smartphone },
  { id: "card", label: "Card", hint: "Credit / Debit", Icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", hint: "Pay at your door", Icon: Wallet },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, pointsPreview, clear } = useCartStore();
  const earn = useRewardsStore((s) => s.earn);
  const token = useUserStore((s) => s.token);
  const zone = useZoneStore((s) => s.zone);
  const show = useToast((s) => s.show);

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "failed">("idle");
  const [placed, setPlaced] = useState(false);
  const hydrated = useHydrated();

  const sub = subtotal();
  const delivery = sub > 999 ? 0 : 29;
  const total = sub + delivery;

  // Guard: must be logged in and have items — but only decide once the
  // persisted stores have rehydrated, or we'd bounce a logged-in user.
  useEffect(() => {
    if (!hydrated || placed) return; // don't redirect after a successful order clears the cart
    if (!token) {
      show("Please log in to continue");
      router.replace("/login");
    } else if (items.length === 0) {
      router.replace("/");
    }
  }, [hydrated, placed, token, items.length, router, show]);

  if (!hydrated) {
    return <div className="py-20 text-center text-sm text-muted">Loading checkout…</div>;
  }
  if (!token || items.length === 0) return null;

  const pay = async () => {
    setStatus("processing");
    const orderId = `ord_${Date.now()}`;
    const result = await processPayment({ orderId, amount: total, method });

    // Order is confirmed ONLY when payment succeeds.
    if (!result.success) {
      setStatus("failed");
      show("Payment failed — order not placed");
      return;
    }

    setPlaced(true); // freeze the cart-empty guard before we clear the cart
    const pts = pointsPreview();
    api
      .post("/orders", {
        zone: zone.slug,
        items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        total,
        payment: { method: result.method, paymentId: result.paymentId, paid: method !== "cod" },
      })
      .catch(() => {});
    earn(pts, `Order ${orderId}`);
    clear();
    show(method === "cod" ? "Order placed! Pay on delivery 🎉" : "Payment successful! 🎉");
    router.push(`/orders/${orderId}/track`);
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-extrabold">Checkout</h1>

      {/* Summary */}
      <Card className="space-y-1.5 p-4">
        {items.map((i) => (
          <div key={i.product.id} className="flex justify-between text-sm">
            <span className="text-muted">
              {i.product.name} × {i.qty}
            </span>
            <span>{formatINR(i.product.price * i.qty)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t pt-2 text-sm text-muted">
          <span>Delivery</span>
          <span>{delivery === 0 ? "FREE" : formatINR(delivery)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-gold">
          <Coins size={13} /> You&apos;ll earn {pointsPreview()} DrinkPoints
        </div>
      </Card>

      {/* Payment methods */}
      <div>
        <h2 className="mb-2 text-sm font-bold">Payment method</h2>
        <div className="space-y-2">
          {METHODS.map(({ id, label, hint, Icon }) => (
            <button
              key={id}
              onClick={() => setMethod(id)}
              className={`flex w-full items-center gap-3 rounded-xl2 border p-3 text-left ${
                method === id ? "border-primary bg-primary-light" : "border-gray-200 bg-white/60"
              }`}
            >
              <Icon size={20} className={method === id ? "text-primary" : "text-muted"} />
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted">{hint}</p>
              </div>
              <span
                className={`ml-auto h-4 w-4 rounded-full border-2 ${
                  method === id ? "border-primary bg-primary" : "border-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted">
        <ShieldCheck size={14} className="text-primary" />
        Test mode — no real charge. Integrate Razorpay with live keys for production.
      </p>

      {status === "failed" && (
        <p className="text-sm font-semibold text-danger">Payment failed. Please try again.</p>
      )}

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button size="lg" className="w-full" onClick={pay} disabled={status === "processing"}>
          {status === "processing"
            ? "Processing payment…"
            : method === "cod"
              ? `Place Order · ${formatINR(total)}`
              : `Pay ${formatINR(total)}`}
        </Button>
      </motion.div>
    </div>
  );
}
