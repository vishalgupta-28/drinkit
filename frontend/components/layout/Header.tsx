"use client";
import Link from "next/link";
import { Search, Coins, User } from "lucide-react";
import { useRewardsStore } from "@/store/rewardsStore";
import { useUserStore } from "@/store/userStore";

export function Header() {
  const points = useRewardsStore((s) => s.points);
  const name = useUserStore((s) => s.name);
  const isAuthed = useUserStore((s) => s.token);

  return (
    <header className="glass-primary sticky top-0 z-40 text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-xl font-extrabold">
          <span>🥃</span> DrinkIt
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/rewards"
            className="flex items-center gap-1 rounded-full bg-gold/90 px-3 py-1.5 text-sm font-bold text-dark"
          >
            <Coins size={16} /> {points.toLocaleString("en-IN")}
          </Link>
          <Link href="/search" aria-label="Search" className="rounded-full bg-white/15 p-2">
            <Search size={18} />
          </Link>
          <Link
            href={isAuthed ? "/profile" : "/login"}
            aria-label="Account"
            className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-2 text-xs font-semibold"
          >
            <User size={16} />
            <span className="hidden sm:inline">{isAuthed ? name.split(" ")[0] : "Log in"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
