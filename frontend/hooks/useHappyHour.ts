"use client";
import { useEffect, useState } from "react";

/** Happy Hour = 6PM–8PM local. Returns active flag + countdown to end. */
export function useHappyHour() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hour = now.getHours();
  const active = hour >= 18 && hour < 20;

  let countdown = "";
  if (active) {
    const end = new Date(now);
    end.setHours(20, 0, 0, 0);
    const diff = Math.max(0, end.getTime() - now.getTime());
    const h = String(Math.floor(diff / 3.6e6)).padStart(2, "0");
    const m = String(Math.floor((diff % 3.6e6) / 6e4)).padStart(2, "0");
    const s = String(Math.floor((diff % 6e4) / 1000)).padStart(2, "0");
    countdown = `${h}:${m}:${s}`;
  }

  return { active, countdown };
}
