"use client";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Phone, Star, Wifi, WifiOff } from "lucide-react";
import { useOrderTracking, type Rider } from "@/hooks/useOrderTracking";
import type { OrderStatus } from "@/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "preparing", label: "Shop Preparing" },
  { key: "picked_up", label: "Rider Picked Up" },
  { key: "delivered", label: "Delivered" },
];

const DEFAULT_RIDER: Rider = { name: "Rahul", rating: 4.8, phone: "+919800000001" };

export default function TrackPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id ?? "";
  const { status, rider, riderLoc, connected } = useOrderTracking(orderId);

  const activeIndex = STEPS.findIndex((s) => s.key === status);
  const r = rider ?? DEFAULT_RIDER;
  const eta = riderLoc?.etaMin ?? 8;
  const delivered = status === "delivered";

  // celebrate on delivery
  const celebrated = useRef(false);
  useEffect(() => {
    if (delivered && !celebrated.current) {
      celebrated.current = true;
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 } });
    }
  }, [delivered]);

  return (
    <div className="space-y-4">
      {/* connection status */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold">Order #{orderId}</h1>
        <span
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            connected ? "bg-primary-light text-primary" : "bg-gray-100 text-muted"
          }`}
        >
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? "LIVE" : "offline"}
        </span>
      </div>

      {/* Rider card */}
      <div className="flex items-center justify-between rounded bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-light text-xl">🚴</div>
          <div>
            <p className="font-bold">
              {delivered ? `${r.name} delivered your order 🎉` : `${r.name} is on the way`}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <Star size={12} className="fill-gold text-gold" /> {r.rating} ·{" "}
              {delivered ? "Enjoy!" : `${eta} min away`}
            </p>
          </div>
        </div>
        <a
          href={`tel:${r.phone}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white"
        >
          <Phone size={18} />
        </a>
      </div>

      {/* Map — shows the live rider coordinates when they arrive over WebSocket */}
      <div className="grid h-64 place-items-center rounded bg-gradient-to-br from-primary-light to-surface text-center text-sm text-muted">
        {riderLoc ? (
          <div>
            <div className="text-3xl">📍🚴</div>
            <p className="mt-1 font-mono text-xs">
              rider @ {riderLoc.lat.toFixed(4)}, {riderLoc.lng.toFixed(4)}
            </p>
            <p className="text-[11px]">(live position via WebSocket)</p>
          </div>
        ) : (
          <span>🗺️ Waiting for live rider location…</span>
        )}
      </div>

      {/* Timeline — advances as order.* events arrive */}
      <div className="rounded bg-card p-4">
        {STEPS.map((s, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <div key={s.key} className="flex items-center gap-3 py-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                  done
                    ? "bg-primary text-white"
                    : current
                      ? "animate-pulse-badge bg-primary text-white"
                      : "bg-gray-200"
                }`}
              >
                {done ? "✓" : current ? "•" : ""}
              </span>
              <span className={current ? "font-bold text-primary" : done ? "text-dark" : "text-muted"}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
