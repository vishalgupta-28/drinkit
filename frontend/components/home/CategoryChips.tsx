"use client";
import type { Category } from "@/types";

type Chip = { key: Category | "all"; label: string };
const CHIPS: Chip[] = [
  { key: "all", label: "All" },
  { key: "beer", label: "🍺 Beer" },
  { key: "whisky", label: "🥃 Whisky" },
  { key: "wine", label: "🍷 Wine" },
  { key: "vodka", label: "🍸 Vodka" },
  { key: "rum", label: "🥃 Rum" },
  { key: "gin", label: "🍹 Gin" },
];

export function CategoryChips({
  active,
  onChange,
}: {
  active: Category | "all";
  onChange: (c: Category | "all") => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto py-1">
      {CHIPS.map((c) => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            active === c.key
              ? "border-primary bg-primary text-white"
              : "border-gray-200 bg-card text-dark"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
