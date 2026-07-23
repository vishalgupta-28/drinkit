"use client";
import { useEffect, useState } from "react";

const OPEN_HOUR = 10; // 10:00
const CLOSE_HOUR = 23; // 23:00

/** Delivery window status, mirrors Blinkit's "Store Closed" / open label. */
export function useStoreStatus() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  if (!now) return { open: true, label: "Delivery available", closeLabel: "" };

  const h = now.getHours();
  const open = h >= OPEN_HOUR && h < CLOSE_HOUR;
  return {
    open,
    label: open ? "Delivery in 12 mins" : "Store Closed",
    closeLabel: open ? `Open until 11 PM` : `Opens at 10 AM`,
  };
}
