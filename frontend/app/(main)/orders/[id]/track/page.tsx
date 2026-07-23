"use client";
import { Phone, Star } from "lucide-react";

const STEPS = [
  { label: "Order Confirmed", done: true },
  { label: "Shop Preparing", done: true },
  { label: "Rider Picked Up", done: false, current: true },
  { label: "Delivered", done: false },
];

export default function TrackPage() {
  return (
    <div className="space-y-4">
      {/* Rider card */}
      <div className="flex items-center justify-between rounded bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-light text-xl">🚴</div>
          <div>
            <p className="font-bold">Rahul is on the way</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <Star size={12} className="fill-gold text-gold" /> 4.8 · 8 min away
            </p>
          </div>
        </div>
        <a href="tel:+919800000001" className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white">
          <Phone size={18} />
        </a>
      </div>

      {/* Map placeholder — replace with @react-google-maps/api GoogleMap */}
      <div className="grid h-64 place-items-center rounded bg-gradient-to-br from-primary-light to-surface text-sm text-muted">
        🗺️ Live map — rider marker updates via WebSocket
      </div>

      {/* Timeline */}
      <div className="rounded bg-card p-4">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full text-xs ${
                s.done ? "bg-primary text-white" : s.current ? "animate-pulse-badge bg-primary text-white" : "bg-gray-200"
              }`}
            >
              {s.done ? "✓" : s.current ? "•" : ""}
            </span>
            <span className={s.current ? "font-bold text-primary" : s.done ? "text-dark" : "text-muted"}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
