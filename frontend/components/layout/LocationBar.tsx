"use client";
import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useZoneStore } from "@/store/zoneStore";
import { ZONES } from "@/lib/mock";

export function LocationBar() {
  const { zone, shopName, setZone, setShopName } = useZoneStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-primary relative text-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="mx-auto flex w-full max-w-5xl items-center gap-1.5 px-4 pb-3 text-sm"
      >
        <MapPin size={15} />
        <span className="font-medium">Delivering to {zone.name}</span>
        <span className="opacity-80">→ {shopName}</span>
        <ChevronDown size={15} className={open ? "rotate-180 transition" : "transition"} />
      </button>

      {open && (
        <div className="glass absolute left-0 right-0 top-full z-40 border-t p-3 text-dark shadow-lg">
          <div className="mx-auto max-w-5xl">
            <p className="mb-2 text-xs font-semibold text-muted">Choose your zone (prices vary!)</p>
            <div className="flex gap-2">
              {ZONES.map((z) => (
                <button
                  key={z.slug}
                  onClick={() => {
                    setZone(z);
                    setShopName(z.slug === "delhi" ? "Sharma Wines" : "Cyber Hub Liquor");
                    setOpen(false);
                  }}
                  className={`flex-1 rounded border p-3 text-left text-sm font-semibold ${
                    z.slug === zone.slug ? "border-primary bg-primary-light text-primary" : "border-gray-200"
                  }`}
                >
                  {z.name}
                  <span className="block text-xs font-normal text-muted">{z.city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
