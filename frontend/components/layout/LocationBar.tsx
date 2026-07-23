"use client";
import { useMemo, useState } from "react";
import { MapPin, ChevronDown, Search, Check } from "lucide-react";
import { useZoneStore } from "@/store/zoneStore";
import { ZONES, ZONE_SHOP } from "@/lib/mock";

export function LocationBar() {
  const { zone, shopName, setZone, setShopName } = useZoneStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return ZONES.filter((z) => !t || z.name.toLowerCase().includes(t) || z.city.toLowerCase().includes(t));
  }, [q]);

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
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="glass absolute left-0 right-0 top-full z-40 border-t p-3 text-dark shadow-lg">
            <div className="mx-auto max-w-5xl">
              <p className="mb-2 text-xs font-semibold text-muted">
                Select your city — prices &amp; stock vary by location
              </p>
              <div className="mb-3 flex items-center gap-2 rounded border border-gray-200 bg-white/70 px-3 py-2">
                <Search size={15} className="text-muted" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search city…"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filtered.map((z) => {
                  const active = z.slug === zone.slug;
                  return (
                    <button
                      key={z.slug}
                      onClick={() => {
                        setZone(z);
                        setShopName(ZONE_SHOP[z.slug] ?? "Local Store");
                        setOpen(false);
                        setQ("");
                      }}
                      className={`flex items-center justify-between rounded border p-3 text-left text-sm font-semibold ${
                        active ? "border-primary bg-primary-light text-primary" : "border-gray-200 bg-white/60"
                      }`}
                    >
                      <span>
                        {z.name}
                        <span className="block text-xs font-normal text-muted">{ZONE_SHOP[z.slug]}</span>
                      </span>
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
