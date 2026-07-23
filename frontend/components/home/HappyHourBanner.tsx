"use client";
import { motion } from "framer-motion";
import { useHappyHour } from "@/hooks/useHappyHour";

export function HappyHourBanner() {
  const { active, countdown } = useHappyHour();
  if (!active) return null;
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-auto flex max-w-5xl items-center justify-between rounded bg-gold px-4 py-2.5 text-sm font-bold text-dark"
    >
      <span>🍺 Happy Hour! 15% OFF + 2x Points</span>
      <span className="rounded bg-dark px-2 py-1 font-mono text-white">{countdown}</span>
    </motion.div>
  );
}
