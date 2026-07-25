"use client";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2, Coins, ChevronLeft, Truck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/components/shared/Toaster";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CartPage() {
  const router = useRouter();
  const { items, count, subtotal, pointsPreview, add, decrement, remove, clear } = useCartStore();
  const isAuthed = useUserStore((s) => s.token);
  const show = useToast((s) => s.show);

  const n = count();
  const delivery = subtotal() > 999 ? 0 : 29;
  const total = subtotal() + delivery;

  const checkout = () => {
    if (!isAuthed) {
      show("Please log in to continue");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (n === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-xl font-extrabold text-dark">Your cart is empty</h1>
        <p className="text-sm text-muted">Add some drinks and they&apos;ll appear here.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>Browse drinks</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={18} /> Back
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-dark">My Cart ({n})</h1>
        <button onClick={clear} className="flex items-center gap-1 text-sm font-semibold text-danger">
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {items.map((i) => (
          <Card key={i.product.id} className="flex items-center justify-between p-3">
            <div className="min-w-0 flex-1" onClick={() => router.push(`/product/${i.product.id}`)}>
              <p className="cursor-pointer truncate text-sm font-semibold text-dark">{i.product.name}</p>
              <p className="text-xs text-muted">{formatINR(i.product.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded bg-primary px-2 py-1 text-white">
                <button onClick={() => decrement(i.product.id)}><Minus size={14} /></button>
                <span className="w-4 text-center text-sm font-bold">{i.qty}</span>
                <button onClick={() => add(i.product)}><Plus size={14} /></button>
              </div>
              <button onClick={() => remove(i.product.id)} className="text-muted hover:text-danger">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="space-y-2 p-4">
        <div className="flex items-center gap-2 rounded bg-gold-light p-2 text-sm font-semibold text-dark">
          <Coins size={16} className="text-gold" />
          You&apos;ll earn {pointsPreview()} DrinkPoints on this order
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <Truck size={14} /> {delivery === 0 ? "Free delivery unlocked" : `${formatINR(29)} delivery fee`}
        </div>
        <div className="space-y-1 border-t pt-2 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatINR(subtotal())}</span></div>
          <div className="flex justify-between text-muted"><span>Delivery</span><span>{delivery === 0 ? "FREE" : formatINR(delivery)}</span></div>
          <div className="flex justify-between text-base font-extrabold text-dark"><span>Total</span><span>{formatINR(total)}</span></div>
        </div>
        <Button size="lg" className="w-full" onClick={checkout}>
          {isAuthed ? `Proceed to Pay · ${formatINR(total)}` : "Log in to Continue"}
        </Button>
      </Card>
    </div>
  );
}
