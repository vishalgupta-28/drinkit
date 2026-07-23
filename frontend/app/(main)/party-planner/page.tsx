"use client";
import { useState } from "react";
import { formatINR } from "@/lib/utils";

export default function PartyPlannerPage() {
  const [guests, setGuests] = useState(10);
  const beers = guests * 3;
  const total = beers * 180 + Math.ceil(guests / 5) * 1200;

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">🎉 Party Planner</h1>

      <div className="rounded bg-card p-4 shadow-sm">
        <label className="text-sm font-semibold">Number of guests: {guests}</label>
        <input
          type="range"
          min={2}
          max={50}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="mt-2 w-full accent-primary"
        />
      </div>

      <div className="rounded bg-primary-light p-4">
        <h3 className="font-bold text-primary">Recommended bundle</h3>
        <ul className="mt-2 space-y-1 text-sm">
          <li>🍺 {beers} × Kingfisher Premium</li>
          <li>🥃 {Math.ceil(guests / 5)} × Red Label Whisky</li>
          <li>🥤 Mixers & ice</li>
        </ul>
        <p className="mt-3 text-lg font-extrabold">{formatINR(total)}</p>
        <button className="mt-2 w-full rounded bg-primary py-3 font-bold text-white">
          Add All to Cart
        </button>
      </div>
    </div>
  );
}
