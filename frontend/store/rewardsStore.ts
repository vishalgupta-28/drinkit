import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PointsEntry, RewardLevel } from "@/types";

function levelFor(points: number): RewardLevel {
  if (points >= 10000) return "Platinum";
  if (points >= 5000) return "Gold";
  if (points >= 1000) return "Silver";
  return "Bronze";
}

// [floor, next-threshold] per level, for the progress bar
const NEXT_THRESHOLD: Record<RewardLevel, number> = {
  Bronze: 1000,
  Silver: 5000,
  Gold: 10000,
  Platinum: 10000,
};

interface RewardsState {
  points: number;
  streakDays: number;
  history: PointsEntry[];
  referralCode: string;
  level: () => RewardLevel;
  progressToNext: () => number; // 0..1
  earn: (points: number, label: string) => void;
  redeem: (points: number, label: string) => boolean;
}

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      points: 1240,
      streakDays: 3,
      referralCode: "DRINK-RAHUL24",
      history: [
        { id: "1", label: "Order #ord_1029", points: 180, at: new Date().toISOString() },
        { id: "2", label: "3-day streak bonus", points: 50, at: new Date().toISOString() },
      ],
      level: () => levelFor(get().points),
      progressToNext: () => {
        const p = get().points;
        const lvl = levelFor(p);
        const floor =
          lvl === "Platinum" ? 10000 : lvl === "Gold" ? 5000 : lvl === "Silver" ? 1000 : 0;
        const next = NEXT_THRESHOLD[lvl];
        if (next === floor) return 1;
        return Math.min(1, (p - floor) / (next - floor));
      },
      earn: (points, label) =>
        set((s) => ({
          points: s.points + points,
          history: [
            { id: crypto.randomUUID(), label, points, at: new Date().toISOString() },
            ...s.history,
          ],
        })),
      redeem: (points, label) => {
        if (get().points < points) return false;
        set((s) => ({
          points: s.points - points,
          history: [
            { id: crypto.randomUUID(), label, points: -points, at: new Date().toISOString() },
            ...s.history,
          ],
        }));
        return true;
      },
    }),
    { name: "drinkit-rewards", skipHydration: true },
  ),
);
