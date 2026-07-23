"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Slide {
  badge: string;
  title: string;
  highlight: string;
  cta: string;
  href: string;
  circle: string;
}

const SLIDES: Slide[] = [
  { badge: "PARTY TONIGHT?", title: "WE GOT YOUR DRINKS!", highlight: "UP TO 20% OFF", cta: "ORDER NOW", href: "#products", circle: "UP TO 20% OFF" },
  { badge: "HAPPY HOUR", title: "2X DRINKPOINTS", highlight: "6 PM – 8 PM DAILY", cta: "SHOP NOW", href: "#products", circle: "2X POINTS" },
  { badge: "NEW HERE?", title: "REFER & EARN BIG", highlight: "GET 100 POINTS FREE", cta: "INVITE", href: "/rewards", circle: "+100 PTS" },
];

export function HeroBanner() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[i];

  return (
    <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-[#0b3b18] via-[#0a2a12] to-[#071c0c] text-white shadow-lg">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative flex min-h-[190px] items-center justify-between gap-4 p-5 md:p-7">
        {/* Copy */}
        <div className="z-10 max-w-[62%]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <span className="inline-block rounded-full border border-white/30 px-3 py-1 text-[11px] font-bold tracking-wide">
                {s.badge}
              </span>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight md:text-4xl">{s.title}</h2>
              <p className="mt-1 text-sm font-bold text-primary md:text-lg" style={{ color: "#5fd873" }}>
                {s.highlight}
              </p>
              <Link
                href={s.href}
                className="mt-4 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-extrabold text-dark transition active:scale-95"
              >
                {s.cta}
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* dots */}
          <div className="mt-4 flex gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </div>

        {/* Bottle scene */}
        <div className="pointer-events-none relative z-0 hidden shrink-0 sm:block">
          <span
            className="absolute -top-1 right-2 z-10 grid h-16 w-16 place-items-center rounded-full border-2 text-center text-[9px] font-extrabold leading-tight"
            style={{ borderColor: "#5fd873", color: "#5fd873" }}
          >
            {s.circle}
          </span>
          <BottleScene />
        </div>
      </div>
    </div>
  );
}

/** Hand-built SVG: three bottles + a rocks glass with ice. */
function BottleScene() {
  return (
    <svg width="230" height="150" viewBox="0 0 230 150" aria-hidden className="drop-shadow-xl">
      <defs>
        <linearGradient id="amber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8a13a" />
          <stop offset="1" stopColor="#b5701a" />
        </linearGradient>
        <linearGradient id="clear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dff0ff" />
          <stop offset="1" stopColor="#9cc3e6" />
        </linearGradient>
        <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7a3d16" />
          <stop offset="1" stopColor="#4a220b" />
        </linearGradient>
      </defs>

      {/* Rocks glass (front-left) */}
      <g transform="translate(6,86)">
        <path d="M2 0h34l-4 46a6 6 0 0 1-6 5H12a6 6 0 0 1-6-5L2 0Z" fill="#c98a2e" opacity="0.85" />
        <path d="M2 0h34l-1.5 17H3.5L2 0Z" fill="#f0c070" opacity="0.5" />
        <rect x="9" y="20" width="9" height="9" rx="2" fill="#ffffff" opacity="0.55" />
        <rect x="20" y="30" width="9" height="9" rx="2" fill="#ffffff" opacity="0.45" />
      </g>

      {/* Whiskey bottle */}
      <g transform="translate(52,20)">
        <rect x="16" y="0" width="8" height="10" rx="1" fill="#2f2f2f" />
        <rect x="17" y="10" width="6" height="12" fill="url(#amber)" />
        <path d="M8 26c0-3 4-5 12-5s12 2 12 5v96a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V26Z" fill="url(#amber)" />
        <rect x="12" y="46" width="16" height="34" rx="2" fill="#f6ecd2" />
        <rect x="14" y="52" width="12" height="3" rx="1.5" fill="#1f7a2e" />
      </g>

      {/* Vodka bottle (tallest, clear) */}
      <g transform="translate(96,8)">
        <rect x="15" y="0" width="8" height="9" rx="1" fill="#1f4f7a" />
        <rect x="16" y="9" width="6" height="14" fill="url(#clear)" />
        <path d="M8 26c0-3 4-4 11-4s11 1 11 4v104a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5V26Z" fill="url(#clear)" opacity="0.92" />
        <rect x="12" y="50" width="14" height="40" rx="2" fill="#ffffff" opacity="0.85" />
        <rect x="14" y="56" width="10" height="3" rx="1.5" fill="#2f6fae" />
      </g>

      {/* Dark whiskey bottle */}
      <g transform="translate(140,18)">
        <rect x="16" y="0" width="8" height="10" rx="1" fill="#c9a24a" />
        <rect x="17" y="10" width="6" height="12" fill="url(#dark)" />
        <path d="M8 26c0-3 4-5 12-5s12 2 12 5v96a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V26Z" fill="url(#dark)" />
        <rect x="12" y="48" width="16" height="36" rx="2" fill="#e9d9b8" />
        <rect x="14" y="54" width="12" height="3" rx="1.5" fill="#8a1f1f" />
      </g>

      {/* ice cubes (bottom-right) */}
      <g transform="translate(182,120)" opacity="0.7">
        <rect x="0" y="6" width="14" height="14" rx="3" fill="#dff0ff" />
        <rect x="16" y="0" width="14" height="14" rx="3" fill="#cfe6f7" />
        <rect x="10" y="18" width="14" height="14" rx="3" fill="#eaf6ff" />
      </g>
    </svg>
  );
}
