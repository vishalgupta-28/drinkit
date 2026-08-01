"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Smartphone, CreditCard, Wallet, ShieldCheck, Coins, MapPin, Ban } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { useUserStore } from "@/store/userStore";
import { useZoneStore } from "@/store/zoneStore";
import { useAddressStore } from "@/store/addressStore";
import { useToast } from "@/components/shared/Toaster";
import { useHydrated } from "@/hooks/useHydrated";
import { formatINR } from "@/lib/utils";
import { api } from "@/lib/api";
import { processPayment, type PaymentMethod } from "@/lib/payment";
import type { Address } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const METHODS: { id: PaymentMethod; label: string; hint: string; Icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", hint: "GPay, PhonePe, Paytm", Icon: Smartphone },
  { id: "card", label: "Card", hint: "Credit / Debit", Icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", hint: "Pay at your door", Icon: Wallet },
];

const EMPTY: Address = { fullName: "", phone: "", line1: "", landmark: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, pointsPreview, clear } = useCartStore();
  const earn = useRewardsStore((s) => s.earn);
  const token = useUserStore((s) => s.token);
  const zone = useZoneStore((s) => s.zone);
  const savedAddress = useAddressStore((s) => s.address);
  const setAddress = useAddressStore((s) => s.setAddress);
  const show = useToast((s) => s.show);

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [status, setStatus] = useState<"idle" | "processing" | "failed">("idle");
  const [placed, setPlaced] = useState(false);
  const [addr, setAddr] = useState<Address>(EMPTY);
  const hydrated = useHydrated();

  // prefill the form from a saved address once hydrated
  useEffect(() => {
    if (savedAddress) setAddr(savedAddress);
    else setAddr((a) => ({ ...a, city: zone.city, state: zone.name }));
  }, [savedAddress, zone.city, zone.name]);

  const sub = subtotal();
  const delivery = sub > 999 ? 0 : 29;
  const total = sub + delivery;

  // Dry states: alcohol delivery is prohibited by law.
  const serviceable = zone.serviceable !== false;

  useEffect(() => {
    if (!hydrated || placed) return;
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

  const addressValid =
    addr.fullName.trim() &&
    /^\+?\d[\d\s-]{8,}$/.test(addr.phone) &&
    addr.line1.trim() &&
    addr.city.trim() &&
    addr.state.trim() &&
    /^\d{6}$/.test(addr.pincode);

  const pay = async () => {
    if (!serviceable) return;
    if (!addressValid) {
      show("Please complete your delivery address");
      return;
    }
    setAddress(addr); // remember for next time
    setStatus("processing");
    const orderId = `ord_${Date.now()}`;
    const result = await processPayment({ orderId, amount: total, method });

    if (!result.success) {
      setStatus("failed");
      show("Payment failed — order not placed");
      return;
    }

    setPlaced(true);
    const pts = pointsPreview();
    api
      .post("/orders", {
        zone: zone.slug,
        items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        total,
        address: addr,
        payment: { method: result.method, paymentId: result.paymentId, paid: method !== "cod" },
      })
      .catch(() => {});
    earn(pts, `Order ${orderId}`);
    clear();
    show(method === "cod" ? "Order placed! Pay on delivery 🎉" : "Payment successful! 🎉");
    router.push(`/orders/${orderId}/track`);
  };

  const field = (k: keyof Address, label: string, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="text-xs font-semibold text-muted">{label}</label>
      <input
        value={addr[k] ?? ""}
        onChange={(e) => setAddr({ ...addr, [k]: e.target.value })}
        className="mt-0.5 w-full rounded border border-gray-200 bg-white/70 px-3 py-2 text-sm"
        {...extra}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-extrabold">Checkout</h1>

      {/* Dry-state block */}
      {!serviceable && (
        <Card className="flex items-start gap-3 border border-danger/30 p-4">
          <Ban className="mt-0.5 shrink-0 text-danger" size={20} />
          <div>
            <p className="text-sm font-bold text-danger">Delivery not available in {zone.name}</p>
            <p className="mt-1 text-xs text-muted">
              Alcohol sale &amp; delivery is prohibited in this state. Please choose a serviceable
              location to place an order.
            </p>
          </div>
        </Card>
      )}

      {/* Delivery address */}
      <div>
        <h2 className="mb-2 flex items-center gap-1.5 text-sm font-bold">
          <MapPin size={15} className="text-primary" /> Delivery address
        </h2>
        <Card className="space-y-2.5 p-4">
          <div className="grid grid-cols-2 gap-2.5">
            {field("fullName", "Full name")}
            {field("phone", "Phone", { inputMode: "tel", placeholder: "+91…" })}
          </div>
          {field("line1", "Flat / House no, Street", { placeholder: "631, Railway Rd" })}
          {field("landmark", "Landmark (optional)")}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-1">{field("pincode", "Pincode", { inputMode: "numeric", maxLength: 6 })}</div>
            <div className="col-span-1">{field("city", "City")}</div>
            <div className="col-span-1">{field("state", "State")}</div>
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="space-y-1.5 p-4">
        {items.map((i) => (
          <div key={i.product.id} className="flex justify-between text-sm">
            <span className="text-muted">{i.product.name} × {i.qty}</span>
            <span>{formatINR(i.product.price * i.qty)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t pt-2 text-sm text-muted">
          <span>Delivery to {zone.city}</span>
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
        <Button
          size="lg"
          className="w-full"
          onClick={pay}
          disabled={status === "processing" || !serviceable}
        >
          {!serviceable
            ? "Delivery unavailable here"
            : status === "processing"
              ? "Processing payment…"
              : method === "cod"
                ? `Place Order · ${formatINR(total)}`
                : `Pay ${formatINR(total)}`}
        </Button>
      </motion.div>
    </div>
  );
}
