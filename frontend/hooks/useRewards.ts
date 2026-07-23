"use client";
import { useRewardsStore } from "@/store/rewardsStore";

export const REDEMPTIONS = [
  { pts: 300, label: "₹30 discount", emoji: "💸" },
  { pts: 500, label: "Free Kingfisher 330ml", emoji: "🍺" },
  { pts: 1000, label: "Free Breezer 275ml", emoji: "🍹" },
  { pts: 2000, label: "Free Tuborg 650ml", emoji: "🍺" },
  { pts: 5000, label: "Free whisky quarter 180ml", emoji: "🥃" },
] as const;

/** 1 pt / ₹10, ×2 happy hour/weekend, ×3 birthday. */
export function calcPoints(amount: number, opts?: { happyHour?: boolean; weekend?: boolean; birthday?: boolean }) {
  let mult = 1;
  if (opts?.birthday) mult = 3;
  else if (opts?.happyHour || opts?.weekend) mult = 2;
  return Math.floor((amount / 10) * mult);
}

export function useRewards() {
  const store = useRewardsStore();
  return { ...store, redemptions: REDEMPTIONS, calcPoints };
}
