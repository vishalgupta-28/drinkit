"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Coins, Copy, Flame } from "lucide-react";
import { useRewards } from "@/hooks/useRewards";

const LEVEL_EMOJI: Record<string, string> = { Bronze: "🥉", Silver: "🥈", Gold: "🥇", Platinum: "💎" };

export default function RewardsPage() {
  const { points, level, progressToNext, streakDays, history, referralCode, redeem, redemptions } = useRewards();
  const [display, setDisplay] = useState(0);

  // count-up animation
  useEffect(() => {
    const start = performance.now();
    const from = display;
    const raf = (t: number) => {
      const k = Math.min(1, (t - start) / 800);
      setDisplay(Math.floor(from + (points - from) * k));
      if (k < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  const onRedeem = (pts: number, label: string) => {
    if (redeem(pts, `Redeemed: ${label}`)) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  };

  const lvl = level();

  return (
    <div className="space-y-5">
      {/* Balance */}
      <div className="rounded-xl2 bg-dark p-6 text-center text-white">
        <p className="text-xs uppercase tracking-wide text-gold">DrinkPoints Balance</p>
        <div className="mt-1 flex items-center justify-center gap-2 text-5xl font-extrabold text-gold">
          <Coins size={36} /> {display.toLocaleString("en-IN")}
        </div>
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
          {LEVEL_EMOJI[lvl]} {lvl}
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/15">
          <motion.div
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext() * 100}%` }}
          />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2 rounded bg-gold-light p-3 text-sm font-bold text-dark">
        <Flame size={20} className="animate-fire-flicker text-danger" />
        {streakDays}-day streak! Keep going for 50 bonus pts
      </div>

      {/* Redemptions */}
      <div>
        <h3 className="mb-2 text-sm font-bold">Redeem your points</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {redemptions.map((r) => (
            <div key={r.pts} className="rounded border border-gray-100 bg-card p-3 text-center">
              <div className="text-4xl">{r.emoji}</div>
              <p className="mt-1 text-xs font-semibold">{r.label}</p>
              <p className="text-xs font-bold text-gold">{r.pts} pts</p>
              <button
                onClick={() => onRedeem(r.pts, r.label)}
                disabled={points < r.pts}
                className="mt-2 w-full rounded bg-primary py-1.5 text-xs font-bold text-white disabled:opacity-40"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="rounded border border-dashed border-primary bg-primary-light p-4">
        <p className="text-sm font-bold text-primary">Refer a friend → earn 100 pts</p>
        <div className="mt-2 flex items-center gap-2">
          <code className="flex-1 rounded bg-card px-3 py-2 font-mono text-sm">{referralCode}</code>
          <button
            onClick={() => navigator.clipboard?.writeText(referralCode)}
            className="rounded bg-primary p-2 text-white"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="mb-2 text-sm font-bold">Points history</h3>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="flex justify-between rounded bg-card px-3 py-2 text-sm">
              <span>{h.label}</span>
              <span className={h.points >= 0 ? "font-bold text-primary" : "font-bold text-danger"}>
                {h.points >= 0 ? "+" : ""}
                {h.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
