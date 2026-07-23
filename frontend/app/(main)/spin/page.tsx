"use client";
import { SpinWheel } from "@/components/rewards/SpinWheel";

export default function SpinPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <h1 className="text-xl font-extrabold">🎰 Spin &amp; Win</h1>
      <p className="text-sm text-muted">1 free spin per week — try your luck!</p>
      <SpinWheel />
    </div>
  );
}
