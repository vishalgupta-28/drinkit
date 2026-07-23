"use client";
import { motion } from "framer-motion";
import { Plus, Coins } from "lucide-react";
import type { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useToast } from "@/components/shared/Toaster";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORY_EMOJI: Record<string, string> = {
  whisky: "🥃", beer: "🍺", wine: "🍷", vodka: "🍸", rum: "🥃", gin: "🍹",
};

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const show = useToast((s) => s.show);
  const lowStock = product.stock > 0 && product.stock <= 3;
  const onDeal = product.mrp && product.mrp > product.price;

  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="relative flex flex-col overflow-hidden p-2.5">
        {onDeal && (
          <Badge variant="danger" className="absolute left-2 top-2 z-10 rounded">
            FLASH
          </Badge>
        )}

        {/* Crystal product tile */}
        <div className="mb-2 flex h-32 items-center justify-center rounded-xl2 bg-gradient-to-br from-white/70 to-primary-light/60 text-5xl backdrop-blur">
          {CATEGORY_EMOJI[product.category] ?? "🍾"}
        </div>

        {lowStock && (
          <Badge variant="danger" className="mb-1 w-fit animate-pulse-badge bg-danger/15 text-danger">
            Only {product.stock} left!
          </Badge>
        )}

        <h3 className="line-clamp-1 text-sm font-semibold text-dark">{product.name}</h3>
        <p className="text-[11px] text-muted">
          {product.volume_ml}ml · {product.brand}
        </p>
        {product.pairs_with && (
          <span className="mt-1 w-fit rounded bg-white/50 px-1.5 py-0.5 text-[10px] text-muted">
            Pairs with {product.pairs_with}
          </span>
        )}

        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base font-extrabold text-dark">{formatINR(product.price)}</span>
              {onDeal && (
                <span className="text-xs text-muted line-through">{formatINR(product.mrp!)}</span>
              )}
            </div>
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-gold">
              <Coins size={11} /> Earn {product.points_earned} pts
            </span>
          </div>
          <Button
            size="icon"
            onClick={() => {
              add(product);
              show(`${product.name} added 🛒`);
            }}
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
