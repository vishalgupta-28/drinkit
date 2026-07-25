"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ChevronLeft, Coins, Truck } from "lucide-react";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useToast } from "@/components/shared/Toaster";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CATEGORY_EMOJI: Record<string, string> = {
  whisky: "🥃", beer: "🍺", wine: "🍷", vodka: "🍸", rum: "🥃", gin: "🍹",
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const { add, decrement, items } = useCartStore();
  const isAuthed = useUserStore((s) => s.token);
  const show = useToast((s) => s.show);
  const [qty, setQty] = useState(1);

  const inCart = items.find((i) => i.product.id === id)?.qty ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-40 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">This product isn&apos;t available in your zone right now.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>Browse drinks</Button>
      </div>
    );
  }

  const onDeal = product.mrp && product.mrp > product.price;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const delivery = product.price * qty > 999 ? 0 : 29;
  const total = product.price * qty + delivery;

  const increase = () => setQty((q) => Math.min(q + 1, product.stock));
  const decrease = () => setQty((q) => Math.max(1, q - 1));

  const addToCart = () => {
    for (let i = 0; i < qty; i++) add(product);
    show(`${qty} × ${product.name} added 🛒`);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-semibold text-muted">
        <ChevronLeft size={18} /> Back
      </button>

      <Card className="relative overflow-hidden p-4">
        {onDeal && (
          <span className="absolute left-3 top-3 rounded bg-danger px-2 py-1 text-[10px] font-bold text-white">
            FLASH DEAL
          </span>
        )}
        <div className="flex aspect-square flex-col items-center justify-center rounded-xl2 bg-gradient-to-br from-white/70 to-primary-light/60 text-8xl backdrop-blur">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-contain p-4" />
          ) : (
            CATEGORY_EMOJI[product.category] ?? "🍾"
          )}
        </div>
      </Card>

      <div className="rounded-xl2 bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">{product.brand}</p>
        <h1 className="text-2xl font-extrabold text-dark">{product.name}</h1>
        <p className="text-sm text-muted">{product.volume_ml}ml · {product.category}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-dark">{formatINR(product.price)}</span>
          {onDeal && <span className="text-base text-muted line-through">{formatINR(product.mrp!)}</span>}
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-gold">
          <Coins size={14} /> Earn {product.points_earned} DrinkPoints
        </p>

        {lowStock && (
          <p className="mt-2 text-sm font-bold text-danger">Only {product.stock} left in your area</p>
        )}

        {product.pairs_with && (
          <div className="mt-3 rounded bg-surface px-3 py-2 text-sm font-medium">
            Pairs with {product.pairs_with}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-3 rounded border border-gray-200 px-3 py-2">
            <button onClick={decrease} className="text-muted"><Minus size={16} /></button>
            <span className="w-4 text-center font-bold">{qty}</span>
            <button onClick={increase} className="text-dark"><Plus size={16} /></button>
          </div>
          <Button size="lg" className="flex-1 gap-2" onClick={addToCart} disabled={product.stock === 0}>
            <ShoppingCart size={18} /> Add to cart
          </Button>
        </div>

        {inCart > 0 && (
          <p className="mt-2 text-sm text-muted">
            {inCart} in cart.{" "}
            <button className="font-semibold text-primary" onClick={() => decrement(product.id)}>Remove one</button>
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <Truck size={14} /> {product.price * qty > 999 ? "Free delivery" : `Delivery fee ${formatINR(29)}`}
        </div>
      </div>
    </div>
  );
}
